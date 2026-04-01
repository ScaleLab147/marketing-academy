"use client";

import { useState } from "react";
import { ArrowRight, TrendingUp, Filter } from "lucide-react";

type Category = "전체" | "매출 성장" | "광고 효율" | "신규 고객";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  result: string;
  metric: string;
  period: string;
  category: Category;
}

const testimonials: Testimonial[] = [
  {
    name: "김O영",
    role: "병원 마케팅 담당자",
    content:
      "수강 3개월 만에 월 매출이 2배 이상 증가했습니다. 체계적인 커리큘럼 덕분에 마케팅 전략을 처음부터 다시 세울 수 있었어요.",
    result: "월 매출 200% 성장",
    metric: "+200%",
    period: "3개월",
    category: "매출 성장",
  },
  {
    name: "이O수",
    role: "자영업 대표",
    content:
      "광고비 대비 효율이 크게 올랐습니다. 특히 메타 광고 운영 파트가 실무에 바로 적용 가능해서 좋았습니다.",
    result: "ROAS 350% 달성",
    metric: "350%",
    period: "2개월",
    category: "광고 효율",
  },
  {
    name: "박O진",
    role: "프리랜서 마케터",
    content:
      "실무에서 바로 써먹을 수 있는 내용이라 만족도가 높았습니다. 클라이언트에게 자신있게 제안할 수 있게 되었어요.",
    result: "월 수익 500만원 달성",
    metric: "500만원",
    period: "4개월",
    category: "매출 성장",
  },
  {
    name: "최O현",
    role: "스타트업 CMO",
    content:
      "데이터 기반 마케팅의 중요성을 깨달았습니다. 감에 의존하던 마케팅에서 벗어나 체계적으로 성과를 낼 수 있게 되었습니다.",
    result: "리드 생성 400% 증가",
    metric: "+400%",
    period: "5개월",
    category: "신규 고객",
  },
  {
    name: "정O미",
    role: "온라인 쇼핑몰 운영",
    content:
      "네이버 플레이스 최적화와 SNS 마케팅 강의가 특히 도움이 되었습니다. 매출이 눈에 띄게 올랐어요.",
    result: "월 매출 3,000만원 돌파",
    metric: "3,000만원",
    period: "6개월",
    category: "매출 성장",
  },
  {
    name: "한O석",
    role: "치과 원장",
    content:
      "직접 마케팅을 이해하니 대행사와의 소통도 훨씬 수월해졌습니다. 불필요한 광고비 지출을 줄일 수 있었어요.",
    result: "광고비 40% 절감",
    metric: "-40%",
    period: "3개월",
    category: "광고 효율",
  },
  {
    name: "윤O라",
    role: "뷰티 브랜드 마케터",
    content:
      "인스타그램 광고 운영 노하우를 배우고 나서 전환율이 크게 개선되었습니다. 정말 감사합니다.",
    result: "전환율 250% 향상",
    metric: "+250%",
    period: "2개월",
    category: "광고 효율",
  },
  {
    name: "송O우",
    role: "부동산 컨설턴트",
    content:
      "DB 마케팅 전략이 가장 인상적이었습니다. 리드를 효과적으로 확보하는 방법을 배워서 사업에 큰 도움이 되었습니다.",
    result: "월 리드 150건 확보",
    metric: "150건/월",
    period: "4개월",
    category: "신규 고객",
  },
  {
    name: "강O민",
    role: "요식업 대표",
    content:
      "네이버 플레이스 상위 노출 방법을 배우고 적용한 뒤 방문 고객이 눈에 띄게 늘었습니다.",
    result: "방문 고객 180% 증가",
    metric: "+180%",
    period: "3개월",
    category: "신규 고객",
  },
];

const categories: Category[] = ["전체", "매출 성장", "광고 효율", "신규 고객"];

export default function TestimonialsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");

  const filtered =
    activeCategory === "전체"
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* 통계 헤더 */}
      <div className="text-center mb-6">
        <p className="text-primary-light font-semibold text-sm mb-3 uppercase tracking-wide">
          Results
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          숫자가 증명합니다
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto">
          한국마케팅감리협회 수강생들이 실제로 달성한 성과입니다.
        </p>
      </div>

      {/* 숫자 배너 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {[
          { value: "1,200+", label: "누적 수강생" },
          { value: "94%", label: "만족도" },
          { value: "3.2배", label: "평균 매출 성장" },
          { value: "89%", label: "재수강률" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-dark-card border border-dark-border rounded-xl py-5 px-4 text-center"
          >
            <p className="text-2xl md:text-3xl font-extrabold text-primary-light">
              {s.value}
            </p>
            <p className="text-text-muted text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <Filter size={16} className="text-text-muted shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-dark-card border border-dark-border text-text-secondary hover:text-text-primary hover:border-text-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 카드 리스트 — 세로 리스트 + 오른쪽 핵심 수치 */}
      <div className="space-y-4">
        {filtered.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
          >
            {/* 핵심 수치 */}
            <div className="md:w-36 shrink-0 text-center md:text-left">
              <p className="text-3xl font-extrabold text-primary-light leading-none">
                {item.metric}
              </p>
              <p className="text-text-muted text-xs mt-1">{item.period} 만에</p>
            </div>

            {/* 내용 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                &ldquo;{item.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-dark-border rounded-full flex items-center justify-center text-text-muted text-xs font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-text-muted text-xs">{item.role}</p>
                </div>
              </div>
            </div>

            {/* 태그 */}
            <div className="shrink-0">
              <span className="inline-block bg-primary/10 text-primary-light text-xs font-medium px-3 py-1 rounded-full">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 네이버 카페 */}
      <div className="mt-16 flex flex-col md:flex-row items-center justify-between bg-dark-card border border-dark-border rounded-2xl px-8 py-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#03C75A]/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp size={22} className="text-[#03C75A]" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">
              더 많은 후기가 궁금하다면?
            </h3>
            <p className="text-text-muted text-sm">
              네이버 카페에서 실시간 수강 후기를 확인하세요.
            </p>
          </div>
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
  );
}
