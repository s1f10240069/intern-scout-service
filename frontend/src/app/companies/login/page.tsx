"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";

export default function CompanyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data = await apiFetch<{ token: string }>("/company_login", {
        method: "POST",
        body: { email, password },
      });

      saveToken("company", data.token);
      router.push("/company/students");
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
      <h1>企業ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </label>
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </main>
  );
}
