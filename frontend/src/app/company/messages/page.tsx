"use client";

import Link from "next/link";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Conversation } from "@/lib/types";

export default function CompanyMessagesPage() {
  const { data: conversations, loading, error } = useAuthenticatedResource<Conversation[]>(
    "company",
    "/company/messages",
    "/login?account_type=company"
  );

  if (loading) return <main>読み込み中...</main>;
  if (error) return <main>{error}</main>;

  return (
    <main>
      <p>
        <Link href="/company/students">学生一覧へ戻る</Link>
      </p>
      <h1>会話一覧</h1>
      {!conversations?.length ? (
        <p>会話はまだありません。</p>
      ) : (
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link href={`/company/messages/${conversation.id}`}>
                {conversation.student.name}さんとの会話
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
