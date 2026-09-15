"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";

type AccountType = "student" | "company";

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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAccountType = searchParams.get("account_type") === "company" ? "company" : "student";
  const [accountType, setAccountType] = useState<AccountType>(initialAccountType);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);

    const commonAttributes = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.passwordConfirmation,
    };
    const path = accountType === "student" ? "/students" : "/companies";
    const body = accountType === "student"
      ? {
          student: {
            ...commonAttributes,
            university: form.university,
            graduation_year: form.graduationYear ? Number(form.graduationYear) : null,
            skills: form.skills,
          },
        }
      : { company: commonAttributes };

    try {
      const data = await apiFetch<{ token: string }>(path, { method: "POST", body });
      saveToken(accountType, data.token);
      router.push(accountType === "student" ? "/mypage" : "/company/students");
    } catch (err) {
      if (err instanceof ApiError) {
        const apiErrors = (err.data as { errors?: string[] })?.errors;
        setErrors(apiErrors ?? ["登録に失敗しました"]);
      } else {
        setErrors(["サーバーに接続できませんでした"]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>新規登録</h1>
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
            {accountType === "student" ? "名前" : "会社名"}
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            メールアドレス
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
          </label>
        </div>
        {accountType === "student" && (
          <>
            <div>
              <label>
                大学・学部
                <input
                  value={form.university}
                  onChange={(event) => updateField("university", event.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                卒業予定年
                <input
                  type="number"
                  value={form.graduationYear}
                  onChange={(event) => updateField("graduationYear", event.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                スキル
                <input
                  value={form.skills}
                  onChange={(event) => updateField("skills", event.target.value)}
                />
              </label>
            </div>
          </>
        )}
        <div>
          <label>
            パスワード
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            パスワード（確認用）
            <input
              type="password"
              value={form.passwordConfirmation}
              onChange={(event) => updateField("passwordConfirmation", event.target.value)}
              required
            />
          </label>
        </div>
        {errors.length > 0 && (
          <ul>
            {errors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? "登録中..." : "登録する"}
        </button>
      </form>
      <p>
        アカウントをお持ちの方は<Link href="/login">ログイン</Link>
      </p>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<main>読み込み中...</main>}>
      <RegisterForm />
    </Suspense>
  );
}
