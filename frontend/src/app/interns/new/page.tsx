"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";

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
      const data = await apiFetch<{ token: string }>("/interns", {
        method: "POST",
        body: {
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
        },
      });

      saveToken("intern", data.token);
      router.push("/mypage");
    } catch (err) {
      if (err instanceof ApiError) {
        const errors = (err.data as { errors?: string[] })?.errors;
        setErrors(errors ?? ["登録に失敗しました"]);
      } else {
        setErrors(["サーバーに接続できませんでした"]);
      }
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
