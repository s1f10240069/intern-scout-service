import Link from "next/link";
export default function Home() {
  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <Link href="/" className="brand">
          <span className="brand__mark">I</span>
          <span>Intern Scout</span>
        </Link>
        <div className="auth-hero__content">
          <h1>インターンの出会いを、もっとまっすぐに。</h1>
          <p>
            学生は自分に合う企業と求人を見つけ、企業は未来の仲間とつながる。シンプルな出会いの場です。
          </p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <h2>はじめよう</h2>
          <p className="auth-card__lead">アカウントをお持ちの方はログインしてください。</p>
          <div className="form-stack">
            <Link className="button button--primary" href="/login">
              ログイン
            </Link>
            <Link className="button button--secondary" href="/register">
              新規登録
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
