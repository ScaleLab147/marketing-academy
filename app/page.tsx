import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  BarChart3,
  Target,
  Zap,
  Shield,
  PlayCircle,
  MessageCircle,
  Award,
  ChevronRight,
} from "lucide-react";

const stats = [
  { number: "1,200+", label: "수강생" },
  { number: "94%", label: "만족도" },
  { number: "3.2배", label: "평균 매출 성장" },
  { number: "200+", label: "성공 사례" },
];

const problems = [
  "광고비는 쓰는데 매출은 안 오르고",
  "대행사에 맡겨도 뭘 하는지 모르겠고",
  "유튜브, 블로그, SNS 뭐부터 해야 할지 막막하고",
  "경쟁 업체는 잘 되는데 우리만 안 되는 것 같고",
];

const steps = [
  {
    step: "01",
    icon: Target,
    title: "진단",
    subtitle: "현재 마케팅 문제점 파악",
    description:
      "내 사업의 마케팅 현황을 객관적으로 분석하고, 어디서 돈이 새고 있는지 정확히 짚어냅니다.",
  },
  {
    step: "02",
    icon: PlayCircle,
    title: "학습",
    subtitle: "실전 중심 커리큘럼 수강",
    description:
      "이론이 아닌 실제 매출을 만드는 방법을 배웁니다. 네이버, 메타, 구글 광고 운영법을 직접 실습합니다.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "적용",
    subtitle: "내 사업에 즉시 적용",
    description:
      "배운 내용을 바로 내 사업에 적용하고, 1:1 피드백으로 성과가 나올 때까지 함께합니다.",
  },
];

const whyUs = [
  {
    icon: Shield,
    title: "검증된 방법론",
    description: "감이 아닌 데이터로 증명된 마케팅 프레임워크를 사용합니다.",
  },
  {
    icon: MessageCircle,
    title: "1:1 밀착 피드백",
    description: "강의만 듣고 끝이 아닙니다. 내 사업에 맞는 맞춤 피드백을 드립니다.",
  },
  {
    icon: Zap,
    title: "즉시 적용 가능",
    description: "수강 당일부터 실행할 수 있는 구체적인 액션 플랜을 제공합니다.",
  },
  {
    icon: Award,
    title: "커뮤니티 네트워킹",
    description: "수강 후에도 함께 성장하는 마케터 네트워크에 참여할 수 있습니다.",
  },
];

const faqs = [
  {
    q: "마케팅을 전혀 몰라도 수강할 수 있나요?",
    a: "네, 기초반은 마케팅을 처음 접하는 분들을 위해 설계되었습니다. 용어 설명부터 시작합니다.",
  },
  {
    q: "수강 기간은 얼마나 되나요?",
    a: "기초반 24시간, 실전반 36시간 분량이며, 수강 기간 내 무제한 반복 시청이 가능합니다.",
  },
  {
    q: "환불은 가능한가요?",
    a: "수강 시작 후 7일 이내, 진도율 30% 미만인 경우 전액 환불이 가능합니다.",
  },
  {
    q: "대행사 운영자도 들을 수 있나요?",
    a: "물론입니다. 실전반에는 대행사 운영에 필요한 클라이언트 관리, 제안서 작성 등의 내용도 포함되어 있습니다.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero — 센터 정렬 + 숫자 카운터 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-[0.07]" />
        <div className="max-w-5xl mx-auto px-4 py-28 md:py-36 relative text-center">
          <p className="text-primary-light font-semibold tracking-wide text-sm uppercase mb-5">
            한국마케팅감리협회
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-text-primary leading-[1.2] mb-6">
            마케팅을 배우면
            <br />
            <span className="text-primary-light">매출이 바뀝니다</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            광고비만 태우는 마케팅은 그만.
            <br />
            진짜 매출을 만드는 실전 마케팅을 가르칩니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02]"
            >
              수강 신청하기
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/testimonials"
              className="inline-flex items-center justify-center gap-2 bg-dark-card border border-dark-border hover:border-text-muted text-text-secondary hover:text-text-primary px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              수강생 성과 먼저 보기
            </Link>
          </div>

          {/* Stats Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-dark-card/60 border border-dark-border rounded-2xl py-5 px-4">
                <p className="text-3xl md:text-4xl font-extrabold text-primary-light mb-1">
                  {stat.number}
                </p>
                <p className="text-text-muted text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문제 공감 섹션 — "이런 고민 있으시죠?" */}
      <section className="py-20 border-t border-dark-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-light font-semibold text-sm mb-3">PROBLEM</p>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 leading-tight">
                혹시 이런
                <br />
                고민 있으신가요?
              </h2>
              <p className="text-text-secondary text-lg">
                많은 사업주, 마케터분들이 같은 문제로 고민합니다.
                <br />
                문제는 마케팅을 &quot;제대로&quot; 배운 적이 없기 때문입니다.
              </p>
            </div>
            <div className="space-y-4">
              {problems.map((problem, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl px-5 py-4 group hover:border-red-500/30 transition-colors"
                >
                  <span className="text-red-400 text-lg shrink-0">✕</span>
                  <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                    {problem}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 해결 프로세스 — 3단계 스텝 */}
      <section className="py-20 bg-dark-card/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary-light font-semibold text-sm mb-3">SOLUTION</p>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              3단계로 마케팅 역량을 완성합니다
            </h2>
            <p className="text-text-secondary text-lg">
              단순히 강의를 듣는 것이 아닌, 실행까지 함께합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="bg-dark-card border border-dark-border rounded-2xl p-7 h-full hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-primary-light/30 text-5xl font-black leading-none">
                      {step.step}
                    </span>
                  </div>
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <step.icon size={22} className="text-primary-light" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {step.title}
                  </h3>
                  <p className="text-primary-light text-sm font-medium mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {/* Arrow between cards */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight size={24} className="text-dark-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 왜 한국마케팅감리협회인가 — 2x2 그리드 */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-primary-light font-semibold text-sm mb-3">WHY US</p>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              한국마케팅감리협회가 다른 이유
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="flex gap-5 bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={22} className="text-primary-light" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 수강생 성과 미리보기 — 횡스크롤 느낌의 강조 배너 */}
      <section className="py-20 bg-dark-card/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="text-primary-light font-semibold text-sm mb-3">RESULTS</p>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                수강생들이 만든 진짜 결과
              </h2>
            </div>
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-1 text-text-secondary hover:text-primary-light transition-colors mt-4 md:mt-0"
            >
              전체 보기 <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { metric: "월 매출 200%↑", who: "김O영 · 병원 마케팅", period: "3개월 만에" },
              { metric: "ROAS 350%", who: "이O수 · 자영업 대표", period: "2개월 만에" },
              { metric: "월 수익 500만원", who: "박O진 · 프리랜서", period: "4개월 만에" },
            ].map((item) => (
              <div
                key={item.who}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
              >
                <p className="text-text-muted text-xs mb-2">{item.period}</p>
                <p className="text-2xl md:text-3xl font-extrabold text-primary-light mb-3">
                  {item.metric}
                </p>
                <p className="text-text-secondary text-sm">{item.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-primary-light font-semibold text-sm mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              자주 묻는 질문
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-dark-card border border-dark-border rounded-xl p-6"
              >
                <h3 className="font-bold text-text-primary mb-2 flex items-start gap-2">
                  <span className="text-primary-light shrink-0">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 커뮤니티 배너 — 네이버 카페 */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between bg-dark-card border border-dark-border rounded-2xl px-8 py-8 gap-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-1">
                수강생 전용 커뮤니티
              </h3>
              <p className="text-text-secondary text-sm">
                네이버 카페에서 실시간 정보 교류와 네트워킹을 함께 하세요.
              </p>
            </div>
            <a
              href="https://cafe.naver.com/marketingsupervision"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#03C75A] hover:bg-[#02b050] text-white px-6 py-3 rounded-xl font-semibold transition-colors shrink-0"
            >
              카페 바로가기
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA — 강한 마감 */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--color-primary)_0%,_transparent_50%)] opacity-[0.08]" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            더 이상 마케팅에
            <br />
            돈만 쓰지 마세요
          </h2>
          <p className="text-text-secondary text-lg mb-3">
            직접 배우면, 직접 벌 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-2 text-text-muted text-sm mb-8">
            <CheckCircle size={16} className="text-primary-light" />
            7일 이내 환불 보장
            <span className="mx-2">·</span>
            <CheckCircle size={16} className="text-primary-light" />
            평생 수강 가능
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02]"
          >
            지금 시작하기
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
