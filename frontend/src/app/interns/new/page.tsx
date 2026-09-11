"use client";

import { useState, FormEvent, ChangeEvent } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

type FormState = {
  name: string;
  email: string;
  university: string;
  graduationYear: string;
  skills: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  university: "",
  graduationYear: "",
  skills: "",
};

export default function NewInternPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

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
          },
        }),
      });

      if (res.ok) {
        setForm(initialForm);
        setRegistered(true);
        return;
      }

      const data = await res.json();
      setErrors(data.errors ?? ["登録に失敗しました"]);
    } catch {
      setErrors(["サーバーに接続できませんでした"]);
    } finally {
      setSubmitting(false);
    }
  };

  if (registered) {
    return (
      <main>
        <h1>登録が完了しました</h1>
        <button type="button" onClick={() => setRegistered(false)}>
          続けて登録する
        </button>
      </main>
    );
  }

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
