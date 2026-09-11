import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>インターン生スカウトサービス</h1>
      <p>
        <Link href="/interns/new">インターン生登録</Link>
      </p>
      <p>
        <Link href="/login">ログイン</Link>
      </p>
    </main>
  );
}
