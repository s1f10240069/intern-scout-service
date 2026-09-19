"use client";
import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Field, Input } from "@/components/ui";
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
  const params = useSearchParams();
  const [accountType, setAccountType] = useState<AccountType>(
    params.get("account_type") === "company" ? "company" : "student"
  );
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const update = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);
    const common = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.passwordConfirmation,
    };
    const body =
      accountType === "student"
        ? {
            student: {
              ...common,
              university: form.university,
              graduation_year: form.graduationYear ? Number(form.graduationYear) : null,
              skills: form.skills,
            },
          }
        : { company: common };
    try {
      const data = await apiFetch<{ token: string }>(
        accountType === "student" ? "/students" : "/companies",
        { method: "POST", body }
      );
      saveToken(accountType, data.token);
      router.push(accountType === "student" ? "/mypage" : "/company/students");
    } catch (err) {
      setErrors(
        err instanceof ApiError
          ? ((err.data as { errors?: string[] }).errors ?? ["登録に失敗しました。"])
          : ["サーバーに接続できませんでした。"]
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
          <h1>新しい出会いを、今日から。</h1>
          <p>必要な情報を入力するだけで、すぐに利用を始められます。</p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <h2>新規登録</h2>
          <p className="auth-card__lead">プロフィールは後から充実させられます。</p>
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
            <Field label={accountType === "student" ? "名前" : "企業名"}>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </Field>
            <Field label="メールアドレス">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="name@example.com"
                required
              />
            </Field>
            {accountType === "student" && (
              <>
                <Field label="大学・学部">
                  <Input
                    value={form.university}
                    onChange={(e) => update("university", e.target.value)}
                  />
                </Field>
                <Field label="卒業予定年">
                  <Input
                    type="number"
                    value={form.graduationYear}
                    onChange={(e) => update("graduationYear", e.target.value)}
                    placeholder="例：2028"
                  />
                </Field>
                <Field label="スキル">
                  <Input
                    value={form.skills}
                    onChange={(e) => update("skills", e.target.value)}
                    placeholder="例：React、Python"
                  />
                </Field>
              </>
            )}
            <Field label="パスワード">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
              />
            </Field>
            <Field label="パスワード（確認）">
              <Input
                type="password"
                value={form.passwordConfirmation}
                onChange={(e) => update("passwordConfirmation", e.target.value)}
                required
              />
            </Field>
            {errors.length > 0 && (
              <ul className="form-errors">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "登録中..." : "登録する"}
            </Button>
          </form>
          <p className="auth-card__footer">
            アカウントをお持ちの方は{" "}
            <Link className="text-link" href={`/login?account_type=${accountType}`}>
              ログイン
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="state-card">読み込み中...</main>}>
      <RegisterForm />
    </Suspense>
  );
}
