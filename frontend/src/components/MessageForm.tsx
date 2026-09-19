"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { Button, Field, Textarea } from "@/components/ui";

export default function MessageForm({ onSend }: { onSend: (body: string) => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim() || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSend(body);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "メッセージを送信できませんでした。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form ref={formRef} className="message-form" onSubmit={handleSubmit}>
      <Field label="メッセージ" hint="Enterで送信・Shift + Enterで改行">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={2000}
          placeholder="メッセージを入力"
          required
        />
      </Field>
      <Button type="submit" disabled={submitting || !body.trim()}>
        {submitting ? "送信中..." : "送信"}
      </Button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
