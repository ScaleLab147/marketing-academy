"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, TrendingUp, Shield, Users } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/";
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "카카오 로그인에 실패했습니다.";
      setError(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left — 브랜드 패널 (데스크탑만) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-card to-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.06]" />
        <div className="relative flex flex-col justify-center px-16 py-12">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-8">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-3 leading-snug">
            마케팅을 배우면
            <br />
            매출이 바뀝니다
          </h2>
          <p className="text-text-secondary mb-10">
            한국마케팅감리협회에서 실전 마케팅을 시작하세요.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: TrendingUp,
                text: "실전 중심 마케팅 커리큘럼",
              },
              {
                icon: Shield,
                text: "검증된 마케팅 프레임워크 제공",
              },
              {
                icon: Users,
                text: "수강생 전용 커뮤니티 운영",
              },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-primary-light" />
                </div>
                <span className="text-text-secondary text-sm">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — 로그인 폼 */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* 모바일에서만 보이는 로고 */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <p className="text-text-secondary text-sm">한국마케팅감리협회</p>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-1">
            로그인
          </h1>
          <p className="text-text-muted text-sm mb-8">
            계정에 로그인하여 강의를 수강하세요.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* 카카오 먼저 — 주요 액션 */}
          <button
            onClick={handleKakaoLogin}
            className="w-full bg-kakao hover:bg-kakao-hover text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 0.5C4.029 0.5 0 3.632 0 7.5C0 9.966 1.595 12.124 4.004 13.378L2.993 17.013C2.906 17.332 3.272 17.586 3.553 17.405L7.853 14.627C8.228 14.667 8.61 14.688 9 14.688C13.971 14.688 18 11.555 18 7.5C18 3.632 13.971 0.5 9 0.5Z"
                fill="#3C1E1E"
              />
            </svg>
            카카오로 시작하기
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-dark-border" />
            <span className="text-text-muted text-xs">이메일로 로그인</span>
            <div className="flex-1 h-px bg-dark-border" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            아직 계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-primary-light hover:underline font-medium"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
