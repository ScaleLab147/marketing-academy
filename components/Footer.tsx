import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-dark-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-text-primary mb-4">
              한국마케팅감리협회
            </h3>
            <div className="text-text-muted text-sm space-y-1.5">
              <p>대표: 전대현</p>
              <p>사업자등록번호: 289-87-03256</p>
              <p>주소: 경기도 화성시 동탄중심상가2길 26-15, 8층 802-42</p>
              <p>이메일: mybeverything@gmail.com</p>
              <p>전화: 010-5585-1275</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-text-primary mb-4">바로가기</h3>
            <div className="space-y-2">
              <Link
                href="/courses"
                className="block text-text-muted hover:text-text-secondary transition-colors text-sm"
              >
                정규강의
              </Link>
              <Link
                href="/testimonials"
                className="block text-text-muted hover:text-text-secondary transition-colors text-sm"
              >
                수강생 성과
              </Link>
              <a
                href="https://cafe.naver.com/marketingsupervision"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-text-muted hover:text-text-secondary transition-colors text-sm"
              >
                네이버 카페
              </a>
              <Link
                href="#"
                className="block text-text-muted hover:text-text-secondary transition-colors text-sm"
              >
                이용약관
              </Link>
              <Link
                href="#"
                className="block text-text-muted hover:text-text-secondary transition-colors text-sm"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-text-primary mb-4">고객센터</h3>
            <div className="space-y-3">
              <a
                href="https://pf.kakao.com/_xexmLpG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-kakao text-gray-900 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-kakao-hover transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 0.5C4.029 0.5 0 3.632 0 7.5C0 9.966 1.595 12.124 4.004 13.378L2.993 17.013C2.906 17.332 3.272 17.586 3.553 17.405L7.853 14.627C8.228 14.667 8.61 14.688 9 14.688C13.971 14.688 18 11.555 18 7.5C18 3.632 13.971 0.5 9 0.5Z"
                    fill="#3C1E1E"
                  />
                </svg>
                카카오톡 문의하기
              </a>
              <p className="text-text-muted text-sm">
                평일 10:00 - 18:00 (주말/공휴일 휴무)
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border mt-8 pt-8">
          <p className="text-text-muted text-xs text-center">
            &copy; {new Date().getFullYear()} 한국마케팅감리협회. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
