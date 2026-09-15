"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import MessageForm from "@/components/MessageForm";
import MessageThread from "@/components/MessageThread";
import { apiFetch, ApiError } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import type { Conversation, Student } from "@/lib/types";

type StudentConversation = {
  student: Student;
  conversation: Conversation | null;
};

export default function CompanyStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<StudentConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken("company");
    if (!token) {
      router.replace("/companies/login");
      return;
    }

    apiFetch<StudentConversation>(`/company/students/${id}/conversation`, { token })
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          clearToken("company");
          router.replace("/companies/login");
          return;
        }
        setError("学生情報を取得できませんでした。");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const sendMessage = async (body: string) => {
    const token = getToken("company");
    if (!token) throw new Error("ログインし直してください。");

    const path = data?.conversation
      ? `/company/messages/${data.conversation.id}/messages`
      : `/company/students/${id}/messages`;

    try {
      const conversation = await apiFetch<Conversation>(path, {
        method: "POST",
        token,
        body: { message: { body } },
      });
      setData((current) => current && { ...current, conversation });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        clearToken("company");
        router.replace("/companies/login");
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
  if (!data) return null;

  return (
    <main>
      <p>
        <Link href="/company/students">学生一覧へ戻る</Link>
      </p>
      <h1>{data.student.name}</h1>
      <dl>
        <dt>大学・学部</dt>
        <dd>{data.student.university}</dd>
        <dt>卒業予定年</dt>
        <dd>{data.student.graduation_year}</dd>
        <dt>スキル</dt>
        <dd>{data.student.skills}</dd>
      </dl>
      <h2>会話</h2>
      <MessageThread conversation={data.conversation} viewer="company" />
      <MessageForm onSend={sendMessage} />
    </main>
  );
}
