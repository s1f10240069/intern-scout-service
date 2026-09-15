"use client";

import Link from "next/link";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import type { Conversation } from "@/lib/types";

export default function StudentMessagesPage() {
  const { data: conversations, loading, error } = useAuthenticatedResource<Conversation[]>(
    "student",
    "/messages",
    "/login"
  );

  if (loading) return <main>読み込み中...</main>;
  if (error) return <main>{error}</main>;

  return (
    <main>
      <p>
        <Link href="/mypage">マイページへ戻る</Link>
      </p>
      <h1>メッセージ</h1>
      {!conversations?.length ? (
        <p>メッセージはまだありません。</p>
      ) : (
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link href={`/messages/${conversation.id}`}>
                {conversation.company.name}との会話
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
