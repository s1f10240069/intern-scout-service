"use client";

import { useEffect, useRef } from "react";
import type { Conversation } from "@/lib/types";

export default function MessageThread({
  conversation,
  viewer,
}: {
  conversation: Conversation | null;
  viewer: "company" | "student";
}) {
  const threadRef = useRef<HTMLDivElement>(null);
  const messageCount = conversation?.messages?.length ?? 0;

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messageCount]);

  if (!conversation || !conversation.messages?.length) {
    return (
      <div className="empty-state">まだメッセージはありません。最初の一言を送ってみましょう。</div>
    );
  }

  return (
    <div ref={threadRef} className="message-thread" aria-live="polite">
      {conversation.messages.map((message) => {
        const mine = message.sender_type === viewer;
        const senderName = mine
          ? "あなた"
          : message.sender_type === "company"
            ? conversation.company.name
            : conversation.student.name;
        return (
          <article key={message.id} className={`message ${mine ? "message--mine" : ""}`}>
            <div className="message__name">{senderName}</div>
            <div className="message__body">{message.body}</div>
          </article>
        );
      })}
    </div>
  );
}
