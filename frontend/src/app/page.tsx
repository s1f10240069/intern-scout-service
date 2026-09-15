import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>学生スカウトサービス</h1>
      <section>
        <h2>学生の方</h2>
        <p>
          <Link href="/interns/new">学生登録</Link>
        </p>
        <p>
          <Link href="/login">ログイン</Link>
        </p>
      </section>
      <section>
        <h2>企業の方</h2>
        <p>
          <Link href="/companies/new">企業登録</Link>
        </p>
        <p>
          <Link href="/companies/login">企業ログイン</Link>
        </p>
      </section>
    </main>
  );
}
