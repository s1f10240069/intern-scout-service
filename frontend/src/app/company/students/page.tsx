"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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
      <p>
        <Link href="/company/messages">会話一覧を見る</Link>
      </p>
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
              <td>
                <Link href={`/company/students/${student.id}`}>{student.name}</Link>
              </td>
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
