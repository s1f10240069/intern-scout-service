"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell, BackLink, PageHeading } from "@/components/AppShell";
import { Card } from "@/components/ui";
import MessageForm from "@/components/MessageForm";
import MessageThread from "@/components/MessageThread";
import { apiFetch, ApiError } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import type { Conversation, Student } from "@/lib/types";
type StudentConversation = { student: Student; conversation: Conversation | null };
export default function CompanyStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<StudentConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const token = getToken("company");
    if (!token) {
      router.replace("/login?account_type=company");
      return;
    }
    apiFetch<StudentConversation>(`/company/students/${id}/conversation`, { token })
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          clearToken("company");
          router.replace("/login?account_type=company");
          return;
        }
        setError("学生情報を取得できませんでした。");
      })
      .finally(() => setLoading(false));
  }, [id, router]);
  const send = async (body: string) => {
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
        router.replace("/login?account_type=company");
        throw new Error("ログインし直してください。");
      }
      throw new Error("メッセージを送信できませんでした。");
    }
  };
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
        data && (
          <>
            <BackLink href="/company/students">学生一覧へ戻る</BackLink>
            <PageHeading eyebrow="Student profile" title={data.student.name} />
            <div className="dashboard-grid">
              <Card>
                <dl className="meta-list">
                  <div>
                    <dt>大学・学部</dt>
                    <dd>{data.student.university ?? "未登録"}</dd>
                  </div>
                  <div>
                    <dt>卒業予定年</dt>
                    <dd>{data.student.graduation_year ?? "未登録"}</dd>
                  </div>
                  <div>
                    <dt>スキル</dt>
                    <dd>{data.student.skills ?? "未登録"}</dd>
                  </div>
                </dl>
              </Card>
              <Card>
                <h2 style={{ margin: "0 0 16px" }}>メッセージ</h2>
                <MessageThread conversation={data.conversation} viewer="company" />
                <MessageForm onSend={send} />
              </Card>
            </div>
          </>
        )
      )}
    </AppShell>
  );
}
