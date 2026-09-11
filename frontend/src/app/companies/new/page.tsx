"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

export default function NewCompanyPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    try {
      const res = await fetch(`${API_BASE_URL}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.passwordConfirmation,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        saveToken("company", data.token);
        router.push("/companies/dashboard");
        return;
      }

      setErrors(data.errors ?? ["登録に失敗しました"]);
    } catch {
      setErrors(["サーバーに接続できませんでした"]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>企業登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            会社名
            <input value={form.name} onChange={handleChange("name")} required />
          </label>
        </div>
        <div>
          <label>
            メールアドレス
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </label>
        </div>
        <div>
          <label>
            パスワード
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </label>
        </div>
        <div>
          <label>
            パスワード(確認用)
            <input
              type="password"
              value={form.passwordConfirmation}
              onChange={handleChange("passwordConfirmation")}
              required
            />
          </label>
        </div>

        {errors.length > 0 && (
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "送信中..." : "登録する"}
        </button>
      </form>
    </main>
  );
}
