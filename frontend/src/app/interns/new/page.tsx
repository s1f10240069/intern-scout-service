"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

type FormState = {
  name: string;
  email: string;
  university: string;
  graduationYear: string;
  skills: string;
  password: string;
  passwordConfirmation: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  university: "",
  graduationYear: "",
  skills: "",
  password: "",
  passwordConfirmation: "",
};

export default function NewInternPage() {
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
      const res = await fetch(`${API_BASE_URL}/interns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intern: {
            name: form.name,
            email: form.email,
            university: form.university,
            graduation_year: form.graduationYear
              ? Number(form.graduationYear)
              : null,
            skills: form.skills,
            password: form.password,
            password_confirmation: form.passwordConfirmation,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        saveToken(data.token);
        router.push("/mypage");
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
      <h1>インターン生登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            名前
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
            大学・学部
            <input
              value={form.university}
              onChange={handleChange("university")}
            />
          </label>
        </div>
        <div>
          <label>
            卒業予定年
            <input
              type="number"
              value={form.graduationYear}
              onChange={handleChange("graduationYear")}
            />
          </label>
        </div>
        <div>
          <label>
            スキル
            <input value={form.skills} onChange={handleChange("skills")} />
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
