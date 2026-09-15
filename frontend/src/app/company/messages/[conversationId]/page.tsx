"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import MessageForm from "@/components/MessageForm";
import MessageThread from "@/components/MessageThread";
import { useAuthenticatedResource } from "@/hooks/useAuthenticatedResource";
import { apiFetch, ApiError } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import type { Conversation } from "@/lib/types";

export default function CompanyMessageThreadPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();
  const { data: conversation, setData, loading, error } =
    useAuthenticatedResource<Conversation>(
      "company",
      `/company/messages/${conversationId}`,
      "/login?account_type=company"
    );

  const sendMessage = async (body: string) => {
    const token = getToken("company");
    if (!token) throw new Error("ログインし直してください。");

    try {
      const updated = await apiFetch<Conversation>(
        `/company/messages/${conversationId}/messages`,
        { method: "POST", token, body: { message: { body } } }
      );
      setData(updated);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        clearToken("company");
        router.replace("/login?account_type=company");
        throw new Error("ログインし直してください。");
      }
      if (err instanceof ApiError && err.status === 422) {
        const errors = (err.data as { errors?: string[] }).errors;
        throw new Error(errors?.join("、") ?? "入力内容を確認してください。");
      }
      throw new Error("メッセージを送信できませんでした。");
    }
  };

  if (loading) return <main>読み込み中...</main>;
  if (error) return <main>{error}</main>;
  if (!conversation) return null;

  return (
    <main>
      <p>
        <Link href="/company/messages">会話一覧へ戻る</Link>
      </p>
      <h1>{conversation.student.name}さんとの会話</h1>
      <MessageThread conversation={conversation} viewer="company" />
      <MessageForm onSend={sendMessage} />
    </main>
  );
}
