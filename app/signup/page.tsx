"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agreeTerms) {
      setError("이용약관에 동의해주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await getSupabase().auth.signUp({ email, password });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "회원가입에 실패했습니다.";
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

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-primary-light" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            인증 이메일을 확인해주세요
          </h2>
          <p className="text-text-secondary mb-8">
            <span className="text-text-primary font-medium">{email}</span>
            으로 인증 메일을 보냈습니다.
            <br />
            이메일의 링크를 클릭하면 가입이 완료됩니다.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            로그인 페이지로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left — 혜택 안내 (데스크탑) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-card to-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.06]" />
        <div className="relative flex flex-col justify-center px-16 py-12">
          <h2 className="text-3xl font-bold text-text-primary mb-3 leading-snug">
            가입하고
            <br />
            바로 시작하세요
          </h2>
          <p className="text-text-secondary mb-10">
            회원가입 후 모든 강의 미리보기를 확인할 수 있습니다.
          </p>

          <div className="space-y-6">
            {[
              "실전 마케팅 강의 무제한 수강",
              "1:1 맞춤 피드백 지원",
              "수강생 전용 커뮤니티 참여",
              "마케팅 템플릿 & 자료 제공",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle
                  size={18}
                  className="text-primary-light shrink-0"
                />
                <span className="text-text-secondary text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — 폼 */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <p className="text-text-secondary text-sm">한국마케팅감리협회</p>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-1">
            회원가입
          </h1>
          <p className="text-text-muted text-sm mb-8">
            무료로 가입하고 강의를 확인하세요.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* 카카오 우선 */}
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

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-dark-border" />
            <span className="text-text-muted text-xs">이메일로 가입</span>
            <div className="flex-1 h-px bg-dark-border" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 (6자 이상)"
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
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              required
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-dark-border bg-dark-bg accent-primary"
              />
              <span className="text-text-muted text-xs leading-relaxed">
                <Link href="#" className="text-primary-light hover:underline">
                  이용약관
                </Link>{" "}
                및{" "}
                <Link href="#" className="text-primary-light hover:underline">
                  개인정보처리방침
                </Link>
                에 동의합니다.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-primary-light hover:underline font-medium"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
