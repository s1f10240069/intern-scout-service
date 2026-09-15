# AI引き継ぎメモ

最終更新: 2026-09-15

このファイルは、会話履歴を持たないAIや開発者が作業を再開するための要約である。要件の正本は `docs/REQUIREMENTS.md`、開発の原則は `docs/PRINCIPLES.md`、より詳しい設計経緯は `docs/PROGRESS.md`、画面遷移・実装差分は `docs/SCREEN_FLOW.md` を参照すること。

## プロジェクトの目的

Rails APIとNext.jsで作る、学生と企業をつなぐスカウトサービスのプロトタイプ。機能は次の優先順で実装し、すべてを必須とはせず期限内に動く範囲まで完成させる。

1. 学生が登録できる
2. 企業が学生にメッセージを送れる
3. 企業が募集を掲載できる（1・2の完成後、余裕があれば着手）

## 現在の実装状況

### 完了

- Docker ComposeでRails API・Next.js・PostgreSQLをまとめて起動できる
- 学生の登録、ログイン、マイページ
  - モデル: `Student`（`students` テーブル）
  - API: `POST /students`、`POST /login`、`GET /me`
  - 互換API: `POST/GET /interns` は移行期間のみ維持
  - 画面: `/interns/new`、`/login`、`/mypage`
- 企業の登録、ログイン、学生一覧
  - API: `POST /companies`、`POST /company_login`、`GET /company_me`
  - 画面: `/companies/new`、`/companies/login`、`/company/students`
  - 旧 `/companies/dashboard` は新パスへリダイレクト
- 認証
  - `has_secure_password`でパスワードをハッシュ化
  - ログイン・登録成功時にAPIトークンを発行し、フロントエンドの`localStorage`に保存
  - 企業だけが`GET /students`と`GET /students/:id`へアクセスできる
  - `password_digest`と`api_token`はAPIレスポンスへ出さない
- フロントエンドの共通処理
  - `frontend/src/lib/api.ts`: JSON API通信、Authorizationヘッダー、`ApiError`
  - `frontend/src/lib/auth.ts`: アカウント種別ごとのトークン管理。旧 `internApiToken` は初回読込時に `studentApiToken` へ移行
  - `frontend/src/lib/types.ts`: `Student` / `Company` の共通型
  - `frontend/src/hooks/useAuthenticatedResource.ts`: 認証済みページのデータ取得・認証切れ処理
- フロントエンドの`lint`と本番`build`は成功済み

### 未着手

- 優先度2-B: 企業と学生のメッセージ機能
- 優先度3: 企業の募集掲載機能
- 優先度4以降: 学生向け検索・企業一覧など

## 次に実装する機能と順序

メッセージ前の `Intern` → `Student` と `/companies/dashboard` → `/company/students` の移行は完了した。旧API、旧画面リダイレクト、旧トークンキーの読込互換は移行期間中のみ残している。次はメッセージ機能へ進み、統合ログイン / 登録はその後に回す。

メッセージは一方通行の送信だけでなく、双方向の会話として実装する方針。

- `Conversation`: 企業と学生の組み合わせごとに1件。最初の送信時に作成する
- `Message`: `Conversation`に属し、送信者種別と本文を持つ
- 企業側: 一覧から学生詳細へ進み、会話を開始・返信できるようにする
- 学生側: 会話一覧とスレッドを見て返信できるようにする

推奨実装順は、最小限の呼称・パス移行 → Railsのモデル・マイグレーション → 認可を含むAPIとリクエストテスト → フロントエンドの企業側送信画面 → 学生側閲覧・返信画面。

会話は `(company_id, student_id)` の組み合わせをDBで一意にし、送信者種別はリクエストから受け取らず認証情報から決定する。当事者以外の閲覧・送信を禁止する。詳細な制約と受け入れ条件は `docs/SCREEN_FLOW.md` を参照。

## 実行方法

Docker Desktopを起動したうえで、リポジトリ直下から実行する。

```bash
docker compose build
docker compose up -d
docker compose exec backend bin/rails db:create db:migrate db:seed
```

以降の開発起動は次でよい。

```bash
npm run dev
```

- フロントエンド: `http://localhost:3000`
- バックエンドAPI: `http://localhost:3001`
- フロントエンド単体の検証: `cd frontend && npm.cmd run lint && npm.cmd run build`
  - Windows PowerShellの実行ポリシーによって`npm`ではなく`npm.cmd`が必要になる場合がある

## テスト用アカウント

`db:seed`後、次の全アカウントのパスワードは`password123`。

| 種別 | メールアドレス |
|---|---|
| 学生 | `intern1@example.com` |
| 学生 | `intern2@example.com` |
| 企業 | `company1@example.com` |
| 企業 | `company2@example.com` |

## 注意点

- ローカルRuby/Railsを前提にせず、Docker Composeで動作確認する。レビュー者が追加セットアップなしで実行できることを重視している。
- `backend/Gemfile`の`json` gemは`~> 2.7`に固定する。3.0系ではRailsのJSONリクエスト解析が失敗した経緯があるため、安易に更新しない。
- APIが401または403を返した場合にのみ、認証フックはトークンを削除してログイン画面へ移動する。通信障害や5xxではトークンを残してエラーを表示する。
- 2026-09-11時点の最新コミットは `bdc14fc Refactor frontend authentication handling`。
- 呼称変更: `Student` モデル、`students` テーブル、`/students` API、`studentApiToken` への移行済み。`/interns` と `internApiToken` の読込処理は互換用に一時的に残している。
- 画面遷移・設計方針と実装差分（これからやること）は `docs/SCREEN_FLOW.md` にまとめている。
