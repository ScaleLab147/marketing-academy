#!/usr/bin/env node
// 이 기기에만 있는 데이터(GitHub에 안 올린 코드, .env 비밀키 파일, Claude Code 대화 기록)를
// 점검하고 클라우드로 옮긴다. 전체 절차는 docs/cloud-migration.md 참고.
//
//   옵션 없음        점검만 한다. 아무것도 올리거나 바꾸지 않는다.
//   --upload         GitHub에 없는 코드 작업을 backup/<기기>/<시각>/ 브랜치로 올린다. 작업 폴더는 그대로 둔다.
//   --export-chats   Claude Code 대화를 Markdown 파일로 내보낸다. 기본 위치: 바탕화면/claude-chats-<기기>
//   --device <이름>  브랜치·폴더 이름에 쓸 기기 이름. 기본: 컴퓨터 이름
//   --out <폴더>     대화를 내보낼 폴더
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";

const USAGE =
  "사용법: node scripts/cloud-migrate.mjs [--upload] [--export-chats] [--device <이름>] [--out <폴더>]";
// GitHub는 50MB가 넘는 파일에 경고하고 100MB가 넘으면 거부한다.
const LARGE_FILE_BYTES = 50 * 1024 * 1024;
const MAX_TRANSCRIPT_BYTES = 256 * 1024 * 1024;
const EDIT_TOOLS = new Set(["Edit", "MultiEdit", "Write", "NotebookEdit"]);
// 내보낸 대화에서 가리는 값들. 완벽하지 않으니 공유하기 전에 한 번 훑어본다.
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\beyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}/g, // JWT (Supabase 키 등)
  /\b(?:sk|pk|rk)-(?:ant-|proj-)?[\w-]{20,}/g, // Anthropic·OpenAI 등 API 키
  /\b(?:test|live)_g?(?:sk|ck)_\w{10,}/g, // 토스페이먼츠 키
  /\bsb_(?:secret|publishable)_[\w-]{10,}/g, // Supabase 새 형식 키
  /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_\w{20,})/g, // GitHub 토큰
  /\bxox[abprs]-[\w-]{10,}/g, // Slack 토큰
  /\bAKIA[0-9A-Z]{16}\b/g, // AWS 액세스 키
  /\bAIza[\w-]{35}/g, // Google API 키
  /\b(?:secret|ntn)_[A-Za-z0-9]{30,}/g, // Notion 토큰
];
const SECRET_ASSIGNMENT =
  /\b([A-Z][A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PASSWD|KEY)[A-Z0-9_]*\s*=\s*)(["']?)[^\s"'`]+\2/g;

let opts;
try {
  ({ values: opts } = parseArgs({
    args: process.argv.slice(2),
    options: {
      upload: { type: "boolean", default: false },
      "export-chats": { type: "boolean", default: false },
      device: { type: "string" },
      out: { type: "string" },
      help: { type: "boolean", short: "h", default: false },
    },
  }));
} catch (err) {
  console.error(`${err.message}\n${USAGE}`);
  process.exit(2);
}
if (opts.help) {
  console.log(USAGE);
  process.exit(0);
}

const device = slug(opts.device ?? os.hostname().replace(/\.local$/i, "")) || "device";
const now = new Date();
const stamp = `${formatDate(now).replaceAll("-", "")}-${[now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join("")}`;
const todo = [];
const root = tryGit(["rev-parse", "--show-toplevel"], { cwd: process.cwd() });
const repo = root ? inspectRepo() : null;
const visibility = repo?.github ? await fetchVisibility(repo.github) : null;
const envFiles = inspectEnvFiles(root ?? process.cwd());
const chats = inspectChats();

const mode = [opts.upload && "코드 올리기", opts["export-chats"] && "대화 내보내기"].filter(Boolean);
console.log(`\n클라우드 이전 ${mode.length ? mode.join(" + ") : "점검 (아무것도 올리거나 바꾸지 않음)"}`);
console.log(`기기: ${device}\n${"=".repeat(48)}`);
reportRepo();
reportEnvFiles();
reportChats();

console.log("");
if (todo.length) {
  console.log("남은 일");
  todo.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
} else {
  console.log("✓ 이 기기에서 클라우드로 옮길 코드와 대화가 더 없습니다.");
}
console.log("");

// ① 코드 ---------------------------------------------------------------

function inspectRepo() {
  const remoteUrl = tryGit(["remote", "get-url", "origin"]);
  const fetched =
    remoteUrl !== null &&
    tryGit(["fetch", "origin", "--prune", "--quiet"], {
      env: { GIT_TERMINAL_PROMPT: "0" },
      timeout: 60_000,
    }) !== null;
  const hasHead = tryGit(["rev-parse", "--verify", "--quiet", "HEAD"]) !== null;
  const branch = tryGit(["symbolic-ref", "--quiet", "--short", "HEAD"]);

  const changes = [];
  const excluded = [];
  const nested = [];
  const status = git(["status", "--porcelain=v1", "-z", "--untracked-files=all"], { raw: true });
  for (const change of parseStatus(status)) {
    // 끝이 /인 항목은 안쪽에 있는 다른 git 저장소다.
    if (change.file.endsWith("/")) nested.push(change.file);
    else if (isSecretFile(change.file)) excluded.push({ ...change, reason: "비밀키로 보이는 파일" });
    else if (fileSize(change.file) > LARGE_FILE_BYTES)
      excluded.push({ ...change, reason: `${Math.round(fileSize(change.file) / 1024 / 1024)}MB, 너무 큼` });
    else changes.push(change);
  }

  // 커밋하지 않은 변경을 담은 트리. 이 기기에서 이미 같은 내용을 올렸으면 다시 올리지 않는다.
  let snapshot = null;
  let snapshotUploaded = false;
  if (changes.length) {
    const tree = snapshotTree(hasHead, [...excluded.map(({ file }) => file), ...nested]);
    snapshotUploaded = git(["for-each-ref", "--format=%(refname) %(tree)", `refs/remotes/origin/backup/${device}`])
      .split("\n")
      .some((line) => line.endsWith(`/worktree ${tree}`));
    if (!snapshotUploaded && tree !== (hasHead ? git(["rev-parse", "HEAD^{tree}"]) : "")) snapshot = tree;
  }

  const notOnGitHub = (rev, ...extra) => Number(git(["rev-list", "--count", rev, "--not", "--remotes=origin", ...extra]));
  const unpushed = [];
  for (const ref of git(["for-each-ref", "--format=%(refname)", "refs/heads"]).split("\n").filter(Boolean)) {
    const count = notOnGitHub(ref);
    if (count > 0) unpushed.push({ branch: ref.replace(/^refs\/heads\//, ""), count });
  }
  const detached = hasHead && !branch ? notOnGitHub("HEAD", "--branches") : 0;
  const stashes = (tryGit(["stash", "list", "--format=%H"]) ?? "")
    .split("\n")
    .filter(Boolean)
    .map((hash, index) => ({ hash, index }))
    .filter(({ hash }) => notOnGitHub(hash) > 0);

  return {
    remoteUrl,
    github: parseGitHub(remoteUrl),
    fetched,
    hasHead,
    changes,
    excluded,
    nested,
    snapshot,
    snapshotUploaded,
    unpushed,
    detached,
    stashes,
  };
}

function reportRepo() {
  console.log("\n① 코드: GitHub에 아직 없는 작업");
  if (!repo) {
    console.log("   git 저장소가 아닌 폴더라서 건너뜁니다. 프로젝트 폴더에서 실행하세요.");
    return;
  }
  console.log(`   폴더: ${root}`);
  if (repo.remoteUrl) {
    // 주소에 로그인 정보(user:token@)가 들어 있으면 화면에 찍지 않는다.
    const where = repo.github ? `${repo.github.owner}/${repo.github.repo}` : repo.remoteUrl.replace(/\/\/[^/@]+@/, "//");
    const note =
      visibility === "public"
        ? " (공개 저장소: 올린 내용은 누구나 볼 수 있습니다)"
        : visibility === "private"
          ? " (비공개 저장소)"
          : "";
    console.log(`   GitHub: ${where}${note}`);
    if (!repo.fetched)
      console.log("   ! GitHub 최신 상태를 받지 못해 마지막으로 받아 둔 상태와 비교합니다 (인터넷·로그인 확인).");
  } else {
    console.log("   ! GitHub 연결(origin)이 없어 올릴 수 없습니다. 먼저 GitHub 저장소를 연결하세요.");
  }

  if (repo.changes.length) {
    const note = repo.snapshotUploaded ? " (이 상태 그대로 이미 올려 둠)" : "";
    console.log(`   • 커밋하지 않은 변경 ${repo.changes.length}개${note}`);
    for (const { code, file } of repo.changes.slice(0, 15)) console.log(`       [${changeLabel(code)}] ${file}`);
    if (repo.changes.length > 15) console.log(`       … 외 ${repo.changes.length - 15}개`);
  }
  if (repo.unpushed.length) {
    const list = repo.unpushed.map(({ branch, count }) => `${branch} ${count}개`).join(", ");
    console.log(`   • GitHub에 없는 커밋: ${list}`);
  }
  if (repo.detached) console.log(`   • 브랜치에 속하지 않은 커밋 ${repo.detached}개`);
  if (repo.stashes.length) console.log(`   • 임시 보관(stash) ${repo.stashes.length}개`);
  for (const { file, reason } of repo.excluded) console.log(`   • 올리지 않음 (${reason}): ${file}`);
  for (const dir of repo.nested) console.log(`   • 건너뜀 (안에 다른 git 저장소가 있음): ${dir}`);

  const pending = Boolean(repo.snapshot || repo.unpushed.length || repo.detached || repo.stashes.length);
  if (!pending) {
    console.log("   ✓ 모두 GitHub에 올라가 있습니다.");
  } else if (!repo.remoteUrl) {
    todo.push("코드: GitHub 저장소를 연결한 뒤 --upload 로 올리기");
  } else if (opts.upload) {
    upload();
  } else {
    todo.push("코드: 같은 명령 끝에 --upload 를 붙여 다시 실행 (backup/ 브랜치로 올라가고 작업 폴더는 그대로입니다)");
  }
  if (repo.excluded.some(({ reason }) => reason.endsWith("너무 큼")))
    todo.push("큰 파일: Google Drive 같은 공유 드라이브에 직접 올리기");
  if (repo.nested.length) todo.push("안쪽 git 저장소: 그 폴더에서도 이 도구를 실행하기");
}

function upload() {
  const base = `backup/${device}/${stamp}`;
  const refs = [];
  if (repo.snapshot) {
    const parent = repo.hasHead ? ["-p", "HEAD"] : [];
    const message = `백업: ${device}의 커밋하지 않은 변경 (${stamp})`;
    const commit = git(["commit-tree", repo.snapshot, ...parent, "-m", message], { env: authorEnv() });
    refs.push([commit, `${base}/worktree`, "커밋하지 않은 변경"]);
  }
  for (const { branch, count } of repo.unpushed)
    refs.push([`refs/heads/${branch}`, `${base}/branch/${branch}`, `${branch} 브랜치, GitHub에 없는 커밋 ${count}개`]);
  if (repo.detached) refs.push(["HEAD", `${base}/detached-head`, `브랜치에 속하지 않은 커밋 ${repo.detached}개`]);
  for (const { hash, index } of repo.stashes)
    refs.push([hash, `${base}/stash-${index}`, `임시 보관 stash@{${index}}`]);

  try {
    git(["push", "--quiet", "origin", ...refs.map(([source, target]) => `${source}:refs/heads/${target}`)], {
      env: { GIT_TERMINAL_PROMPT: "0" },
      timeout: 300_000,
    });
  } catch (err) {
    console.log("   ✗ GitHub에 올리지 못했습니다.");
    console.log(indent(String(err.stderr || err.message).trim(), 7));
    todo.push("코드: GitHub 로그인(GitHub Desktop 또는 gh auth login)을 확인한 뒤 --upload 다시 실행");
    process.exitCode = 1;
    return;
  }
  console.log("   ✓ GitHub에 올렸습니다.");
  for (const [, target, what] of refs) console.log(`       ${target}  (${what})`);
  if (repo.github) {
    const { owner, repo: name } = repo.github;
    console.log(`     확인: https://github.com/${owner}/${name}/branches/all?query=${encodeURIComponent(`backup/${device}`)}`);
  }
  todo.push(`정리: 클라우드 세션에서 "backup/${device} 브랜치들 검토해서 필요한 것만 main에 합쳐 줘"라고 요청`);
}

// 지금 작업 폴더 그대로를 git 트리로 만든다. 임시 인덱스를 써서 사용자의 스테이징과 파일은 건드리지 않는다.
function snapshotTree(hasHead, skip) {
  const index = path.join(os.tmpdir(), `cloud-migrate-${process.pid}.index`);
  const env = { GIT_INDEX_FILE: index };
  try {
    if (hasHead) git(["read-tree", "HEAD"], { env });
    git(["add", "-A", "--", ".", ...skip.map((file) => `:(exclude,literal)${file}`)], { env });
    return git(["write-tree"], { env });
  } finally {
    fs.rmSync(index, { force: true });
  }
}

// ② 비밀키 파일 -----------------------------------------------------------

function inspectEnvFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.startsWith(".env") && isSecretFile(entry.name))
    .map(({ name }) => {
      const text = fs.readFileSync(path.join(dir, name), "utf8");
      return { name, keys: [...text.matchAll(/^\s*(?:export\s+)?([A-Za-z_]\w*)\s*=/gm)].map((m) => m[1]) };
    });
}

function reportEnvFiles() {
  console.log("\n② 비밀키 파일 (.env): GitHub에 올리지 않습니다");
  if (!envFiles.length) {
    console.log("   없음");
    return;
  }
  for (const { name, keys } of envFiles) console.log(`   • ${name}: ${keys.join(", ") || "(변수 없음)"}`);
  todo.push(
    "비밀키 (아직 안 했다면): 위 변수의 값을 Vercel 프로젝트 Settings > Environment Variables에 직접 입력. 채팅에 붙여넣지 않기",
  );
}

// ③ Claude Code 대화 --------------------------------------------------------

function inspectChats() {
  const projectsDir = path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude"), "projects");
  const projects = [];
  if (!fs.existsSync(projectsDir)) return { projectsDir, projects };

  for (const entry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(projectsDir, entry.name);
    // .orphaned- 가 붙은 파일은 같은 대화의 예전 사본이다.
    const files = fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".jsonl") && !name.includes(".orphaned-"))
      .map((name) => path.join(dir, name));
    const tooLarge = files.filter((file) => fs.statSync(file).size > MAX_TRANSCRIPT_BYTES).length;
    const sessions = files
      .filter((file) => fs.statSync(file).size <= MAX_TRANSCRIPT_BYTES)
      .map(readSession)
      .filter((s) => s.messages.some((m) => m.role === "assistant"))
      .sort((a, b) => b.end.localeCompare(a.end));
    const memoryDir = path.join(dir, "memory");
    const memory = fs.existsSync(memoryDir)
      ? fs
          .readdirSync(memoryDir)
          .filter((name) => name.endsWith(".md"))
          .map((name) => path.join(memoryDir, name))
      : [];
    if (!sessions.length && !memory.length && !tooLarge) continue;
    const cwd = sessions.find((s) => s.cwd)?.cwd;
    projects.push({ name: cwd ? path.basename(cwd) : entry.name, sessions, memory, tooLarge });
  }
  return { projectsDir, projects };
}

function readSession(file) {
  const session = { id: path.basename(file, ".jsonl"), cwd: "", branch: "", start: "", end: "", messages: [], edited: new Set() };
  let customTitle = "";
  let aiTitle = "";
  let summary = "";
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (!entry || typeof entry !== "object") continue;
    if (entry.customTitle) customTitle = entry.customTitle;
    if (entry.type === "ai-title" && entry.aiTitle) aiTitle = entry.aiTitle;
    if (entry.type === "summary" && entry.summary) summary = entry.summary;
    if (entry.cwd && !session.cwd) session.cwd = entry.cwd;
    if (entry.gitBranch) session.branch = entry.gitBranch;
    if (entry.timestamp) {
      session.start ||= entry.timestamp;
      session.end = entry.timestamp;
    }
    if (entry.isSidechain) continue;

    const prompt = promptText(entry);
    if (prompt) session.messages.push({ role: "user", time: entry.timestamp, text: prompt });
    if (entry.type === "assistant" && Array.isArray(entry.message?.content)) {
      for (const part of entry.message.content) {
        if (part?.type === "text" && part.text?.trim()) {
          session.messages.push({ role: "assistant", time: entry.timestamp, text: part.text });
        } else if (part?.type === "tool_use" && EDIT_TOOLS.has(part.name)) {
          const target = part.input?.file_path ?? part.input?.notebook_path;
          if (typeof target === "string") session.edited.add(target);
        }
      }
    }
  }
  const firstPrompt = session.messages.find((m) => m.role === "user")?.text.split("\n")[0].slice(0, 60);
  session.title = String(customTitle || aiTitle || summary || firstPrompt || "(제목 없음)").replace(/\s+/g, " ").trim();
  return session;
}

// 사람이 직접 보낸 요청만 고른다. 도구 결과, 자동으로 붙은 메시지, 대화 요약은 뺀다.
function promptText(entry) {
  let content;
  if (entry.type === "user" && !entry.isMeta && !entry.isCompactSummary) {
    if (entry.origin && entry.origin.kind !== "human") return "";
    content = entry.message?.content;
  } else if (entry.type === "attachment" && entry.attachment?.type === "queued_command") {
    // Claude가 일하는 도중에 보낸 메시지는 이렇게 저장된다. 에이전트 보고·작업 알림은 뺀다.
    if (entry.attachment.origin?.kind !== "human") return "";
    content = entry.attachment.prompt;
  } else {
    return "";
  }
  let text;
  if (typeof content === "string") text = content;
  else if (Array.isArray(content) && !content.some((part) => part?.type === "tool_result"))
    text = content
      .map((part) => (part?.type === "text" ? part.text : part?.type === "image" ? "[이미지]" : ""))
      .filter(Boolean)
      .join("\n");
  else return "";

  text = text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").trim();
  const command = text.match(/<command-name>([\s\S]*?)<\/command-name>/);
  if (command) {
    const args = text.match(/<command-args>([\s\S]*?)<\/command-args>/)?.[1].trim();
    return args ? `${command[1].trim()} ${args}` : command[1].trim();
  }
  // ! 로 직접 실행한 명령은 명령만 남기고, 그 출력(비밀 값이 섞일 수 있음)과 자동 알림은 뺀다.
  const bash = text.match(/^<bash-input>([\s\S]*?)<\/bash-input>/);
  if (bash) return `! ${bash[1].trim()}`;
  return /^<(local-command-|bash-std|task-notification|agent-message)/.test(text) ? "" : text;
}

function reportChats() {
  console.log(`\n③ 이 기기의 Claude Code 대화 기록 (${chats.projectsDir})`);
  if (!chats.projects.length) {
    console.log("   없음");
    return;
  }
  for (const { name, sessions, memory, tooLarge } of chats.projects) {
    const range = sessions.length
      ? `, ${formatDate(sessions.at(-1).start)} ~ ${formatDate(sessions[0].end)}`
      : "";
    const extra = memory.length ? `, 자동 메모리 파일 ${memory.length}개` : "";
    console.log(`   • ${name}: 대화 ${sessions.length}개${range}${extra}`);
    for (const s of sessions.slice(0, 5)) console.log(`       ${formatDate(s.end)}  ${redact(s.title)}`);
    if (sessions.length > 5) console.log(`       … 외 ${sessions.length - 5}개`);
    if (tooLarge) console.log(`       ! 너무 커서 읽지 않은 대화 파일 ${tooLarge}개`);
  }
  console.log("   계속 이어서 할 대화는 Claude 데스크톱 앱에서 열고 Continue in > Claude Code on the Web 을 누르세요.");
  if (opts["export-chats"]) exportChats();
  else todo.push("대화: 같은 명령 끝에 --export-chats 를 붙여 실행한 뒤, 만들어진 폴더를 Notion으로 가져오기");
}

function exportChats() {
  const outDir = path.resolve(opts.out ?? defaultOutDir());
  const index = [
    `# Claude Code 대화 기록: ${device}`,
    "",
    `내보낸 시각: ${formatTime(now)}. 원래 대화는 이 기기에 그대로 남아 있습니다.`,
    "Notion으로 옮기려면 Notion의 가져오기(Import) > Text & Markdown에서 이 폴더의 .md 파일을 선택하세요.",
  ];
  let count = 0;
  for (const { name, sessions, memory } of chats.projects) {
    const folder = safeName(name);
    fs.mkdirSync(path.join(outDir, folder), { recursive: true });
    index.push("", `## ${name}`, "");
    for (const s of sessions) {
      const title = safeName(Array.from(s.title).slice(0, 60).join(""));
      const file = `${formatDate(s.start)}_${title}_${s.id.slice(0, 8)}.md`;
      fs.writeFileSync(path.join(outDir, folder, file), redact(renderSession(s)));
      const link = encodeURI(`${folder}/${file}`).replaceAll("(", "%28").replaceAll(")", "%29");
      index.push(`- ${formatDate(s.start)} [${s.title.replace(/[[\]]/g, "")}](${link})`);
      count++;
    }
    if (memory.length) {
      fs.mkdirSync(path.join(outDir, folder, "_memory"), { recursive: true });
      for (const file of memory)
        fs.writeFileSync(path.join(outDir, folder, "_memory", path.basename(file)), redact(fs.readFileSync(file, "utf8")));
      index.push(`- 자동 메모리 파일 ${memory.length}개: ${folder}/_memory/`);
    }
  }
  fs.writeFileSync(path.join(outDir, "README.md"), `${redact(index.join("\n"))}\n`);
  console.log(`   ✓ 대화 ${count}개를 저장했습니다: ${outDir}`);
  console.log("     비밀키로 보이는 값은 [가림]으로 바꿨지만 완벽하지 않으니 공유하기 전에 한 번 훑어보세요.");
  console.log("     Notion의 가져오기(Import) > Text & Markdown에서 이 폴더의 .md 파일을 선택하면 됩니다.");
}

function renderSession(s) {
  const edited = [...s.edited].map((file) =>
    s.cwd && file.startsWith(s.cwd) ? file.slice(s.cwd.length).replace(/^[\\/]/, "") : file,
  );
  const rows = [
    ["기간", `${formatTime(s.start)} ~ ${formatTime(s.end)}`],
    ["기기", device],
    ["폴더", s.cwd || "-"],
    ["브랜치", s.branch || "-"],
    ["세션 ID", s.id],
    ["수정한 파일", edited.join(", ") || "-"],
  ];
  const lines = [`# ${s.title}`, "", "| 항목 | 내용 |", "| --- | --- |"];
  for (const [key, value] of rows) lines.push(`| ${key} | ${value.replaceAll("|", "\\|")} |`);
  let previous = null;
  for (const { role, time, text } of s.messages) {
    if (role !== previous) lines.push("", "---", "", `### ${role === "user" ? "사용자" : "Claude"} · ${formatTime(time)}`);
    lines.push("", text.trim());
    previous = role;
  }
  return `${lines.join("\n")}\n`;
}

// 도우미 -----------------------------------------------------------------

function git(args, { env, timeout, cwd = root, raw = false } = {}) {
  const output = execFileSync("git", args, {
    cwd,
    env: { ...process.env, ...env },
    timeout,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
  return raw ? output : output.trim();
}

function tryGit(args, options) {
  try {
    return git(args, options);
  } catch {
    return null;
  }
}

function authorEnv() {
  const name = tryGit(["config", "user.name"]);
  const email = tryGit(["config", "user.email"]);
  if (name && email) return {};
  const author = name || `cloud-migrate ${device}`;
  const address = email || `cloud-migrate@${device}.local`;
  return { GIT_AUTHOR_NAME: author, GIT_AUTHOR_EMAIL: address, GIT_COMMITTER_NAME: author, GIT_COMMITTER_EMAIL: address };
}

function parseStatus(output) {
  const changes = [];
  const parts = output.split("\0");
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i]) continue;
    const code = parts[i].slice(0, 2);
    changes.push({ code, file: parts[i].slice(3) });
    // 이름을 바꾼 항목은 다음 칸에 원래 경로가 온다.
    if (code[0] === "R" || code[0] === "C") i++;
  }
  return changes;
}

function changeLabel(code) {
  if (code.includes("U") || code === "AA" || code === "DD") return "충돌";
  if (code === "??" || code.includes("A")) return "새 파일";
  if (code.includes("D")) return "삭제";
  if (code.includes("R")) return "이름 변경";
  return "수정";
}

function isSecretFile(file) {
  const name = path.basename(file).toLowerCase();
  if (/^\.env(\..+)?$/.test(name)) return !/\.(example|sample|template)$/.test(name);
  return (
    /^(\.npmrc|\.netrc|\.pypirc|id_(rsa|dsa|ecdsa|ed25519))$/.test(name) ||
    /\.(pem|key|p12|pfx|keystore|jks|tfvars)$/.test(name) ||
    /(credential|service[-_]?account|secret).*\.(json|ya?ml|toml)$/.test(name)
  );
}

function fileSize(file) {
  try {
    return fs.lstatSync(path.join(root, file)).size;
  } catch {
    return 0;
  }
}

function parseGitHub(url) {
  const match = url?.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

async function fetchVisibility({ owner, repo: name }) {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: { "User-Agent": "cloud-migrate" },
      signal: AbortSignal.timeout(5000),
    });
    // 로그인 없이 보이지 않으면 비공개 저장소다.
    if (res.status === 404) return "private";
    return res.ok ? ((await res.json()).private ? "private" : "public") : null;
  } catch {
    return null;
  }
}

function redact(text) {
  const masked = SECRET_PATTERNS.reduce((out, pattern) => out.replace(pattern, "[가림]"), text);
  return masked.replace(SECRET_ASSIGNMENT, "$1[가림]");
}

function defaultOutDir() {
  const desktop = path.join(os.homedir(), "Desktop");
  return path.join(fs.existsSync(desktop) ? desktop : os.homedir(), `claude-chats-${device}`);
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function safeName(text) {
  const name = text
    .replace(/[\\/:*?"<>|#%\p{Cc}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.+$/, "");
  return name || "untitled";
}

function indent(text, spaces) {
  return text
    .split("\n")
    .map((line) => " ".repeat(spaces) + line)
    .join("\n");
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "?" : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatTime(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "?" : `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
