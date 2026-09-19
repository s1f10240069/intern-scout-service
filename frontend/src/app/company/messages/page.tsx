"use client";
import Link from "next/link";
import { AppShell, PageHeading } from "@/components/AppShell";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Conversation } from "@/lib/types";
export default function CompanyMessagesPage() {
  const {
    data: conversations,
    loading,
    error,
  } = useAuthenticatedResource<Conversation[]>(
    "company",
    "/company/messages",
    "/login?account_type=company"
  );
  return (
    <AppShell role="company">
      {loading ? (
        <div className="state-card">
          <span className="spinner" />
          読み込み中...
        </div>
      ) : error ? (
        <div className="state-card state-card--error">{error}</div>
      ) : (
        <>
          <PageHeading
            eyebrow="Messages"
            title="会話一覧"
            description="学生とのやりとりを確認できます。"
          />
          {!conversations?.length ? (
            <div className="empty-state">メッセージはまだありません。</div>
          ) : (
            <div className="conversation-list">
              {conversations.map((c) => (
                <Link key={c.id} href={`/company/messages/${c.id}`}>
                  {c.student.name}さんとの会話 <span style={{ marginLeft: "auto" }}>→</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
