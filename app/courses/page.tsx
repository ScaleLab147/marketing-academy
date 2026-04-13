"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  X,
  Minus,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  badge: string;
  description: string;
  price: number;
  originalPrice: number;
  duration: string;
  students: string;
  rating: string;
  level: string;
  featured: boolean;
  curriculum: string[];
  includes: string[];
}

const courses: Course[] = [
  {
    id: "marketing-basic",
    title: "기초반",
    badge: "입문 · 초급",
    description: "마케팅의 기본 개념부터 실전 전략까지 체계적으로 학습합니다.",
    price: 390000,
    originalPrice: 590000,
    duration: "24시간",
    students: "1,200+",
    rating: "4.9",
    level: "입문/초급",
    featured: false,
    curriculum: [
      "마케팅 기초 개념 및 프레임워크",
      "타겟 고객 분석 및 페르소나 설정",
      "네이버 플레이스 최적화",
      "블로그 마케팅 기초",
      "SNS 마케팅 기초",
      "콘텐츠 마케팅 전략 수립",
    ],
    includes: [
      "강의 영상 무제한 수강",
      "실전 템플릿 제공",
      "수강생 커뮤니티 참여",
    ],
  },
  {
    id: "marketing-advanced",
    title: "실전반",
    badge: "중급 · 고급",
    description: "광고 운영부터 DB 마케팅까지, 매출을 극대화하는 고급 전략.",
    price: 690000,
    originalPrice: 990000,
    duration: "36시간",
    students: "800+",
    rating: "4.8",
    level: "중급/고급",
    featured: false,
    curriculum: [
      "메타 광고 A to Z",
      "네이버 검색광고 & GFA",
      "구글 광고 운영 전략",
      "DB 마케팅 & 리드 생성",
      "광고 크리에이티브 제작",
      "데이터 분석 & 성과 최적화",
      "마케팅 자동화 시스템",
      "클라이언트 관리 & PT",
    ],
    includes: [
      "강의 영상 무제한 수강",
      "실전 템플릿 제공",
      "수강생 커뮤니티 참여",
      "실제 광고 계정 실습",
      "월 1회 라이브 Q&A",
    ],
  },
  {
    id: "marketing-master",
    title: "올인원",
    badge: "전체 레벨",
    description: "기초 + 실전 + 보너스 콘텐츠를 모두 포함한 완전 패키지.",
    price: 890000,
    originalPrice: 1580000,
    duration: "60시간+",
    students: "500+",
    rating: "5.0",
    level: "전체",
    featured: true,
    curriculum: [
      "기초반 전체 커리큘럼",
      "실전반 전체 커리큘럼",
      "유튜브 마케팅 전략",
      "카카오톡 채널 마케팅",
      "마케팅 대행사 창업 가이드",
    ],
    includes: [
      "강의 영상 평생 수강",
      "실전 템플릿 + 제안서 템플릿",
      "수강생 커뮤니티 참여",
      "실제 광고 계정 실습",
      "월 1회 라이브 Q&A",
      "1:1 멘토링 3회",
      "전용 네트워킹 그룹",
    ],
  },
];

// 비교 테이블 항목
const compareFeatures = [
  { label: "강의 시간", basic: "24시간", advanced: "36시간", master: "60시간+" },
  { label: "네이버 마케팅", basic: true, advanced: true, master: true },
  { label: "SNS 마케팅", basic: true, advanced: true, master: true },
  { label: "메타/구글 광고", basic: false, advanced: true, master: true },
  { label: "DB 마케팅", basic: false, advanced: true, master: true },
  { label: "마케팅 자동화", basic: false, advanced: true, master: true },
  { label: "유튜브 전략", basic: false, advanced: false, master: true },
  { label: "대행사 창업 가이드", basic: false, advanced: false, master: true },
  { label: "1:1 멘토링", basic: false, advanced: false, master: true },
  { label: "라이브 Q&A", basic: false, advanced: true, master: true },
  { label: "커뮤니티 참여", basic: true, advanced: true, master: true },
];

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

function DetailModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  const handlePayment = async () => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          amount: course.price,
          orderName: `한국마케팅감리협회 ${course.title}`,
        }),
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      alert("결제 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-dark-card border border-dark-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors z-10"
        >
          <X size={22} />
        </button>

        <div className="p-7">
          {course.featured && (
            <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              BEST
            </span>
          )}
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            마케팅 수익화 {course.title}
          </h2>
          <p className="text-text-muted text-sm mb-6">{course.badge}</p>

          <div className="flex items-center gap-5 text-sm text-text-secondary mb-6">
            <span className="flex items-center gap-1"><Clock size={15} /> {course.duration}</span>
            <span className="flex items-center gap-1"><Users size={15} /> {course.students}명</span>
            <span className="flex items-center gap-1 text-yellow-400"><Star size={15} fill="currentColor" /> {course.rating}</span>
          </div>

          {/* 커리큘럼 */}
          <h3 className="font-bold text-text-primary text-sm mb-3">커리큘럼</h3>
          <div className="space-y-2 mb-6">
            {course.curriculum.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-primary/10 text-primary-light rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-text-secondary text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* 포함 항목 */}
          <h3 className="font-bold text-text-primary text-sm mb-3">포함 항목</h3>
          <div className="space-y-2 mb-8">
            {course.includes.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={15} className="text-primary-light shrink-0" />
                <span className="text-text-secondary text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* 가격 + CTA */}
          <div className="bg-dark-bg border border-dark-border rounded-xl p-5">
            <div className="flex items-end gap-3 mb-4">
              <span className="text-3xl font-bold text-text-primary">
                {formatPrice(course.price)}원
              </span>
              <span className="text-text-muted line-through text-base">
                {formatPrice(course.originalPrice)}원
              </span>
              <span className="text-primary-light font-semibold text-sm">
                {Math.round((1 - course.price / course.originalPrice) * 100)}% 할인
              </span>
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              수강 신청하기
              <ArrowRight size={18} />
            </button>
            <p className="text-text-muted text-xs text-center mt-3">
              VAT 포함
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="site-container py-16">
      {/* 헤더 */}
      <div className="text-center mb-14">
        <p className="text-primary-light font-semibold text-sm mb-3 uppercase tracking-wide">
          Courses
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          나에게 맞는 과정을 선택하세요
        </h1>
        <p className="text-text-secondary">
          단계별로 설계된 커리큘럼, 원하는 만큼 깊이있게 학습할 수 있습니다.
        </p>
      </div>

      {/* 가격 카드 — 3열 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`rounded-2xl p-6 flex flex-col relative ${
              course.featured
                ? "bg-gradient-to-b from-primary/10 to-dark-card border-2 border-primary/40"
                : "bg-dark-card border border-dark-border"
            }`}
          >
            {course.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-5 py-1 rounded-full">
                추천
              </div>
            )}

            <p className="text-text-muted text-xs font-medium mb-1">
              {course.badge}
            </p>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {course.title}
            </h3>
            <p className="text-text-secondary text-sm mb-5 flex-1">
              {course.description}
            </p>

            <div className="mb-5">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold text-text-primary">
                  {formatPrice(course.price)}
                </span>
                <span className="text-text-muted text-sm">원</span>
              </div>
              <span className="text-text-muted line-through text-sm">
                {formatPrice(course.originalPrice)}원
              </span>
            </div>

            <button
              onClick={() => setSelectedCourse(course)}
              className={`w-full font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm ${
                course.featured
                  ? "bg-primary hover:bg-primary-hover text-white"
                  : "bg-dark-bg border border-dark-border hover:border-primary/40 text-text-primary"
              }`}
            >
              자세히 보기
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* 비교 테이블 */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
          과정별 비교
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left text-text-muted text-sm py-4 pr-4 font-normal w-1/4">
                  항목
                </th>
                <th className="text-center text-text-secondary text-sm py-4 font-semibold w-1/4">
                  기초반
                </th>
                <th className="text-center text-text-secondary text-sm py-4 font-semibold w-1/4">
                  실전반
                </th>
                <th className="text-center text-sm py-4 font-semibold w-1/4">
                  <span className="text-primary-light">올인원</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {compareFeatures.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-dark-border/50"
                >
                  <td className="text-text-secondary text-sm py-3.5 pr-4">
                    {row.label}
                  </td>
                  {(["basic", "advanced", "master"] as const).map((plan) => {
                    const val = row[plan];
                    return (
                      <td key={plan} className="text-center py-3.5">
                        {typeof val === "string" ? (
                          <span className="text-text-primary text-sm font-medium">
                            {val}
                          </span>
                        ) : val ? (
                          <CheckCircle
                            size={18}
                            className="text-primary-light mx-auto"
                          />
                        ) : (
                          <Minus
                            size={18}
                            className="text-dark-border mx-auto"
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* 가격 행 */}
              <tr>
                <td className="text-text-primary text-sm py-4 font-semibold">
                  가격
                </td>
                {courses.map((c) => (
                  <td key={c.id} className="text-center py-4">
                    <span
                      className={`font-bold text-lg ${
                        c.featured ? "text-primary-light" : "text-text-primary"
                      }`}
                    >
                      {formatPrice(c.price)}원
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="text-center bg-dark-card border border-dark-border rounded-2xl py-12 px-6">
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          어떤 과정이 맞을지 모르겠다면?
        </h2>
        <p className="text-text-secondary mb-6">
          카카오톡으로 편하게 상담받으세요. 상황에 맞는 과정을 추천해드립니다.
        </p>
        <a
          href="https://pf.kakao.com/_xexmLpG"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-kakao hover:bg-kakao-hover text-gray-900 font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 0.5C4.029 0.5 0 3.632 0 7.5C0 9.966 1.595 12.124 4.004 13.378L2.993 17.013C2.906 17.332 3.272 17.586 3.553 17.405L7.853 14.627C8.228 14.667 8.61 14.688 9 14.688C13.971 14.688 18 11.555 18 7.5C18 3.632 13.971 0.5 9 0.5Z"
              fill="#3C1E1E"
            />
          </svg>
          무료 상담받기
        </a>
      </div>

      {/* 모달 */}
      {selectedCourse && (
        <DetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
