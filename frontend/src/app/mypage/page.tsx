"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Intern } from "@/lib/types";

export default function MyPage() {
  const router = useRouter();
  const { data: intern, loading, error } = useAuthenticatedResource<Intern>(
    "intern",
    "/me",
    "/login"
  );

  const handleLogout = () => {
    clearToken("intern");
    router.push("/login");
  };

  if (loading) return <main>読み込み中...</main>;
  if (error) return <main>{error}</main>;
  if (!intern) return null;

  return (
    <main>
      <h1>マイページ</h1>
      <dl>
        <dt>名前</dt>
        <dd>{intern.name}</dd>
        <dt>メールアドレス</dt>
        <dd>{intern.email}</dd>
        <dt>大学・学部</dt>
        <dd>{intern.university}</dd>
        <dt>卒業予定年</dt>
        <dd>{intern.graduation_year}</dd>
        <dt>スキル</dt>
        <dd>{intern.skills}</dd>
      </dl>
      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
    </main>
  );
}
