"use client";

import { FormEvent, useState } from "react";

type Props = {
  onSend: (body: string) => Promise<void>;
};

export default function MessageForm({ onSend }: Props) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSend(body);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "メッセージを送信できませんでした");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        メッセージ
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={2000}
          required
        />
      </label>
      {error && <p>{error}</p>}
      <button type="submit" disabled={submitting || !body.trim()}>
        {submitting ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
