"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Student } from "@/lib/types";

export default function MyPage() {
  const router = useRouter();
  const { data: student, loading, error } = useAuthenticatedResource<Student>(
    "student",
    "/me",
    "/login"
  );

  const handleLogout = () => {
    clearToken("student");
    router.push("/login");
  };

  if (loading) return <main>読み込み中...</main>;
  if (error) return <main>{error}</main>;
  if (!student) return null;

  return (
    <main>
      <h1>マイページ</h1>
      <dl>
        <dt>名前</dt>
        <dd>{student.name}</dd>
        <dt>メールアドレス</dt>
        <dd>{student.email}</dd>
        <dt>大学・学部</dt>
        <dd>{student.university}</dd>
        <dt>卒業予定年</dt>
        <dd>{student.graduation_year}</dd>
        <dt>スキル</dt>
        <dd>{student.skills}</dd>
      </dl>
      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
    </main>
  );
}
