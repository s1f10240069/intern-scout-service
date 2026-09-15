"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";

type AccountType = "student" | "company";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAccountType = searchParams.get("account_type") === "company" ? "company" : "student";
  const [accountType, setAccountType] = useState<AccountType>(initialAccountType);
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
      if (err instanceof ApiError) {
        const message = (err.data as { error?: string })?.error;
        setError(message ?? "ログインに失敗しました");
      } else {
        setError("サーバーに接続できませんでした");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>アカウント種別</legend>
          <label>
            <input
              type="radio"
              name="accountType"
              value="student"
              checked={accountType === "student"}
              onChange={() => setAccountType("student")}
            />
            学生
          </label>
          <label>
            <input
              type="radio"
              name="accountType"
              value="company"
              checked={accountType === "company"}
              onChange={() => setAccountType("company")}
            />
            企業
          </label>
        </fieldset>
        <div>
          <label>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            パスワード
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <p>
        アカウントをお持ちでない方は<Link href="/register">新規登録</Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main>読み込み中...</main>}>
      <LoginForm />
    </Suspense>
  );
}
