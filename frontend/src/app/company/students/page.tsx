"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Student } from "@/lib/types";

export default function CompanyStudentsPage() {
  const router = useRouter();
  const { data: students, loading, error } = useAuthenticatedResource<Student[]>(
    "company",
    "/students",
    "/companies/login"
  );

  const handleLogout = () => {
    clearToken("company");
    router.push("/companies/login");
  };

  if (loading) return <main>読み込み中...</main>;
  if (error) return <main>{error}</main>;
  if (!students) return null;

  return (
    <main>
      <h1>学生一覧</h1>
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
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.university}</td>
              <td>{student.graduation_year}</td>
              <td>{student.skills}</td>
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
