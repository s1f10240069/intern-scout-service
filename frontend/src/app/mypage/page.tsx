"use client";
import Link from "next/link";
import { AppShell, PageHeading } from "@/components/AppShell";
import { Card } from "@/components/ui";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Student } from "@/lib/types";
export default function MyPage() {
  const {
    data: student,
    loading,
    error,
  } = useAuthenticatedResource<Student>("student", "/me", "/login");
  if (loading)
    return (
      <AppShell role="student">
        <div className="state-card">
          <span className="spinner" />
          読み込み中...
        </div>
      </AppShell>
    );
  if (error)
    return (
      <AppShell role="student">
        <div className="state-card state-card--error">{error}</div>
      </AppShell>
    );
  if (!student) return null;
  return (
    <AppShell role="student">
      <PageHeading
        eyebrow="Student dashboard"
        title={`こんにちは、${student.name}さん`}
        description="気になる企業や求人を見つけて、直接メッセージを送りましょう。"
      />
      <div className="dashboard-grid">
        <Card>
          <h2>あなたのプロフィール</h2>
          <dl className="meta-list">
            <div>
              <dt>メールアドレス</dt>
              <dd>{student.email}</dd>
            </div>
            <div>
              <dt>大学・学部</dt>
              <dd>{student.university ?? "未登録"}</dd>
            </div>
            <div>
              <dt>卒業予定年</dt>
              <dd>{student.graduation_year ? `${student.graduation_year}年` : "未登録"}</dd>
            </div>
            <div>
              <dt>スキル</dt>
              <dd>{student.skills ?? "未登録"}</dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2>探す</h2>
          <div className="quick-links">
            <Link className="quick-link" href="/companies">
              企業を探す <span>→</span>
            </Link>
            <Link className="quick-link" href="/jobs">
              求人を探す <span>→</span>
            </Link>
            <Link className="quick-link" href="/messages">
              メッセージ <span>→</span>
            </Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
