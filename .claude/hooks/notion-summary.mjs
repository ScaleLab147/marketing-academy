// Stop 훅: 사용자 요청이 끝났는데 이번 요청 중에 Notion 요약을 쓰지 않았다면,
// 한 번만 Claude를 이어서 일하게 해서 세션 요약을 반영하게 한다.
// 요약 규칙은 CLAUDE.md의 "대화 요약 (Notion)" 섹션에 있다.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const NOTION_WRITE_TOOL = /notion-(create-pages|update-page)$/;

function readEntries(transcriptPath) {
  return fs
    .readFileSync(transcriptPath, "utf8")
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
}

// 사람이 직접 보낸 요청만 센다. 도구 결과, 스킬·에이전트 메시지(isMeta), 요약 메시지는 제외.
function isHumanPrompt(entry) {
  if (entry.type !== "user" || entry.isMeta || entry.isSidechain || entry.isCompactSummary) {
    return false;
  }
  const content = entry.message?.content;
  if (typeof content === "string") return true;
  return Array.isArray(content) && !content.some((part) => part?.type === "tool_result");
}

function wroteNotion(entry) {
  return (
    entry.type === "assistant" &&
    !entry.isSidechain &&
    Array.isArray(entry.message?.content) &&
    entry.message.content.some(
      (part) => part?.type === "tool_use" && NOTION_WRITE_TOOL.test(part.name ?? ""),
    )
  );
}

function main() {
  if (process.env.CLAUDE_NOTION_SUMMARY === "off") return;

  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  if (input.stop_hook_active) return;
  if (!input.transcript_path || !fs.existsSync(input.transcript_path)) return;

  const entries = readEntries(input.transcript_path);
  const promptIndex = entries.findLastIndex(isHumanPrompt);
  if (promptIndex === -1) return;
  if (entries.slice(promptIndex + 1).some(wroteNotion)) return;

  // 같은 요청에서는 한 번만 막는다. Claude가 요약을 건너뛰어도 무한 반복하지 않게 한다.
  const sessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID || input.session_id || "unknown";
  const promptId = entries[promptIndex].uuid ?? String(promptIndex);
  const stateDir = path.join(os.tmpdir(), "claude-notion-summary");
  const stateFile = path.join(stateDir, sessionId.replace(/[^\w.-]/g, "_"));
  try {
    if (fs.readFileSync(stateFile, "utf8") === promptId) return;
  } catch {
    // 아직 기록이 없으면 처음 막는 것이다.
  }
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(stateFile, promptId);

  const reason = [
    "[자동 요약] 이번 요청이 끝났다면 CLAUDE.md의 '대화 요약 (Notion)' 규칙대로",
    "이 세션의 요약을 Notion 'Claude 대화 요약' 데이터베이스에 반영하세요.",
    `세션 ID: ${sessionId}.`,
    "이 세션의 페이지가 이미 있으면 갱신하고, 없으면 새로 만드세요.",
    "새로 반영할 내용이 없거나, Notion 도구를 쓸 수 없거나, 사용자가 요약을 원하지 않았다면 아무것도 하지 말고 끝내세요.",
    "반영한 뒤에는 사용자에게 긴 설명을 덧붙이지 마세요.",
  ].join(" ");
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
}

try {
  main();
} catch {
  // 훅 오류가 대화를 막지 않도록 조용히 끝낸다.
}
