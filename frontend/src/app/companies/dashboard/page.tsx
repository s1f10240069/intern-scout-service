"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Intern } from "@/lib/types";

export default function CompanyDashboardPage() {
  const router = useRouter();
  const { data: interns, loading, error } = useAuthenticatedResource<Intern[]>(
    "company",
    "/interns",
    "/companies/login"
  );

  const handleLogout = () => {
    clearToken("company");
    router.push("/companies/login");
  };

  if (loading) return <main>読み込み中...</main>;
  if (error) return <main>{error}</main>;
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
