"use client";
import Link from "next/link";
import { AppShell, PageHeading } from "@/components/AppShell";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Conversation } from "@/lib/types";
export default function StudentMessagesPage() {
  const {
    data: conversations,
    loading,
    error,
  } = useAuthenticatedResource<Conversation[]>("student", "/messages", "/login");
  return (
    <AppShell role="student">
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
            title="メッセージ"
            description="企業とのやりとりを確認できます。"
          />
          {!conversations?.length ? (
            <div className="empty-state">メッセージはまだありません。</div>
          ) : (
            <div className="conversation-list">
              {conversations.map((c) => (
                <Link key={c.id} href={`/messages/${c.id}`}>
                  {c.company.name}との会話 <span style={{ marginLeft: "auto" }}>→</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
