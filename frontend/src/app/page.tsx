import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>学生スカウトサービス</h1>
      <section>
        <p>
          <Link href="/login">ログイン</Link>
        </p>
        <p>
          <Link href="/register">新規登録</Link>
        </p>
      </section>
    </main>
  );
}
