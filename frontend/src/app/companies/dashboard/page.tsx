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

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [interns, setInterns] = useState<Intern[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken("company");

    if (!token) {
      router.push("/companies/login");
      return;
    }

    fetch(`${API_BASE_URL}/interns`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((data) => setInterns(data))
      .catch(() => {
        clearToken("company");
        router.push("/companies/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    clearToken("company");
    router.push("/companies/login");
  };

  if (loading) return <main>読み込み中...</main>;
  if (!interns) return null;

  return (
    <main>
      <h1>インターン生一覧</h1>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th>大学・学部</th>
            <th>卒業予定年</th>
            <th>スキル</th>
          </tr>
        </thead>
        <tbody>
          {interns.map((intern) => (
            <tr key={intern.id}>
              <td>{intern.name}</td>
              <td>{intern.university}</td>
              <td>{intern.graduation_year}</td>
              <td>{intern.skills}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={handleLogout}>
        ログアウト
      </button>
    </main>
  );
}
