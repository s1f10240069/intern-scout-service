import type { Conversation } from "@/lib/types";

type Props = {
  conversation: Conversation | null;
  viewer: "company" | "student";
};

export default function MessageThread({ conversation, viewer }: Props) {
  if (!conversation || !conversation.messages?.length) {
    return <p>まだメッセージはありません。</p>;
  }

  return (
    <ol>
      {conversation.messages.map((message) => {
        const senderName =
          message.sender_type === viewer
            ? "あなた"
            : message.sender_type === "company"
              ? conversation.company.name
              : conversation.student.name;

        return (
          <li key={message.id}>
            <p>
              <strong>{senderName}</strong>
            </p>
            <p>{message.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
