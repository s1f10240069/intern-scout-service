"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";

type Intern = {
  id: number;
  name: string;
  email: string;
  university: string | null;
  graduation_year: number | null;
  skills: string | null;
};

export default function MyPage() {
  const router = useRouter();
  const [intern, setIntern] = useState<Intern | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken("intern");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((data) => setIntern(data))
      .catch(() => {
        clearToken("intern");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    clearToken("intern");
    router.push("/login");
  };

  if (loading) return <main>読み込み中...</main>;
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
