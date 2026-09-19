"use client";
import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Field, Input } from "@/components/ui";
import { saveToken } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";
type AccountType = "student" | "company";
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [accountType, setAccountType] = useState<AccountType>(
    params.get("account_type") === "company" ? "company" : "student"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await apiFetch<{ token: string }>("/login", {
        method: "POST",
        body: { account_type: accountType, email, password },
      });
      saveToken(accountType, data.token);
      router.push(accountType === "student" ? "/mypage" : "/company/students");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? ((err.data as { error?: string }).error ?? "ログインに失敗しました。")
          : "サーバーに接続できませんでした。"
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <Link href="/" className="brand">
          <span className="brand__mark">I</span>
          <span>Intern Scout</span>
        </Link>
        <div className="auth-hero__content">
          <h1>次の一歩を、ここから。</h1>
          <p>学生と企業、それぞれに最適な出会いをつなぎます。</p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <h2>ログイン</h2>
          <p className="auth-card__lead">アカウント種別を選んでログインしてください。</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <fieldset className="segmented">
              <label>
                <input
                  type="radio"
                  checked={accountType === "student"}
                  onChange={() => setAccountType("student")}
                />
                学生
              </label>
              <label>
                <input
                  type="radio"
                  checked={accountType === "company"}
                  onChange={() => setAccountType("company")}
                />
                企業
              </label>
            </fieldset>
            <Field label="メールアドレス">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </Field>
            <Field label="パスワード">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
          <p className="auth-card__footer">
            アカウントをお持ちでない方は{" "}
            <Link className="text-link" href={`/register?account_type=${accountType}`}>
              新規登録
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={<main className="state-card">読み込み中...</main>}>
      <LoginForm />
    </Suspense>
  );
}
