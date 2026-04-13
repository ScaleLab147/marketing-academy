"use client";

import { useState } from "react";
import { ArrowRight, Filter } from "lucide-react";

type Category = "전체" | "강의 만족" | "실무 적용" | "마케팅 역량";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  highlight: string;
  category: Category;
}

const testimonials: Testimonial[] = [
  {
    name: "김O영",
    role: "병원 마케팅 담당자",
    content:
      "체계적인 커리큘럼 덕분에 마케팅 전략을 처음부터 다시 세울 수 있었어요. 어디서부터 시작해야 할지 막막했는데 명확해졌습니다.",
    highlight: "전략 재수립에 큰 도움",
    category: "마케팅 역량",
  },
  {
    name: "이O수",
    role: "자영업 대표",
    content:
      "특히 메타 광고 운영 파트가 실무에 바로 적용 가능해서 좋았습니다. 이론이 아니라 실전이라 체감이 달랐어요.",
    highlight: "실무 적용 가능한 강의",
    category: "실무 적용",
  },
  {
    name: "박O진",
    role: "프리랜서 마케터",
    content:
      "실무에서 바로 써먹을 수 있는 내용이라 만족도가 높았습니다. 클라이언트에게 자신있게 제안할 수 있게 되었어요.",
    highlight: "클라이언트 제안 자신감 상승",
    category: "마케팅 역량",
  },
  {
    name: "최O현",
    role: "스타트업 CMO",
    content:
      "데이터 기반 마케팅의 중요성을 깨달았습니다. 감에 의존하던 마케팅에서 벗어나 체계적으로 접근할 수 있게 되었습니다.",
    highlight: "데이터 기반 마케팅 전환",
    category: "마케팅 역량",
  },
  {
    name: "정O미",
    role: "온라인 쇼핑몰 운영",
    content:
      "네이버 플레이스 최적화와 SNS 마케팅 강의가 특히 도움이 되었습니다. 혼자서는 절대 못 배웠을 내용이에요.",
    highlight: "네이버·SNS 마케팅 핵심 습득",
    category: "실무 적용",
  },
  {
    name: "한O석",
    role: "치과 원장",
    content:
      "직접 마케팅을 이해하니 대행사와의 소통도 훨씬 수월해졌습니다. 불필요한 지출이 뭔지 구분할 수 있게 됐어요.",
    highlight: "대행사 소통 능력 향상",
    category: "마케팅 역량",
  },
  {
    name: "윤O라",
    role: "뷰티 브랜드 마케터",
    content:
      "인스타그램 광고 운영 노하우를 배우고 나서 광고 세팅에 자신감이 붙었습니다. 정말 감사합니다.",
    highlight: "광고 세팅 자신감",
    category: "실무 적용",
  },
  {
    name: "송O우",
    role: "부동산 컨설턴트",
    content:
      "DB 마케팅 전략이 가장 인상적이었습니다. 리드를 효과적으로 확보하는 방법을 체계적으로 배웠습니다.",
    highlight: "DB 마케팅 전략 습득",
    category: "실무 적용",
  },
  {
    name: "강O민",
    role: "요식업 대표",
    content:
      "네이버 플레이스 상위 노출 방법을 배우고 적용할 수 있게 되었습니다. 강의 구성이 알차서 좋았어요.",
    highlight: "강의 구성이 알참",
    category: "강의 만족",
  },
];

const categories: Category[] = ["전체", "강의 만족", "실무 적용", "마케팅 역량"];

export default function TestimonialsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");

  const filtered =
    activeCategory === "전체"
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory);

  return (
    <div className="site-container py-[100px]">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <p className="text-primary-light font-semibold text-sm mb-3 uppercase tracking-wide">
          Reviews
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          수강생 후기
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto">
          한국마케팅감리협회 수강생들의 솔직한 후기입니다.
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
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

      {/* 후기 리스트 */}
      <div className="space-y-5">
        {filtered.map((item, index) => (
          <div
            key={index}
            className="bg-dark-card border border-dark-border rounded-2xl p-7 hover:border-primary/30 transition-colors"
          >
            <span className="inline-block bg-primary/10 text-primary-light text-xs font-medium px-3 py-1 rounded-full mb-4">
              {item.highlight}
            </span>
            <p className="text-text-secondary mb-5 leading-relaxed">
              &ldquo;{item.content}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-dark-border rounded-full flex items-center justify-center text-text-muted text-xs font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">
                    {item.name}
                  </p>
                  <p className="text-text-muted text-xs">{item.role}</p>
                </div>
              </div>
              <span className="text-text-muted text-xs bg-dark-bg px-2.5 py-1 rounded-full">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 네이버 카페 */}
      <div className="mt-16 flex flex-col md:flex-row items-center justify-between bg-dark-card border border-dark-border rounded-2xl px-8 py-8 gap-6">
        <div>
          <h3 className="font-bold text-text-primary">
            더 많은 후기가 궁금하다면?
          </h3>
          <p className="text-text-muted text-sm mt-1">
            네이버 카페에서 실시간 수강 후기를 확인하세요.
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
  );
}
