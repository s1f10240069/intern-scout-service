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
  - 画面: `/register`（学生選択）、`/login`（学生選択）、`/mypage`
- 企業の登録、ログイン、学生一覧
  - API: `POST /companies`、`POST /login`（`account_type: company`）、`GET /company_me`
  - 互換API: `POST /company_login` は移行期間のみ維持
  - 画面: `/register`（企業選択）、`/login`（企業選択）、`/company/students`
  - 旧 `/companies/dashboard` は新パスへリダイレクト
- 認証
  - `has_secure_password`でパスワードをハッシュ化
  - ログイン・登録成功時にAPIトークンを発行し、フロントエンドの`localStorage`に保存
  - 企業だけが`GET /students`と`GET /students/:id`へアクセスできる
  - `password_digest`と`api_token`はAPIレスポンスへ出さない
- フロントエンドの共通処理
  - `frontend/src/lib/api.ts`: JSON API通信、Authorizationヘッダー、`ApiError`
  - `frontend/src/lib/auth.ts`: アカウント種別ごとのトークン管理
  - `frontend/src/lib/types.ts`: `Student` / `Company` の共通型
  - `frontend/src/hooks/useAuthenticatedResource.ts`: 認証済みページのデータ取得・認証切れ処理
- フロントエンドの`lint`と本番`build`は成功済み
- 企業と学生の双方向メッセージ
  - 企業: `/company/students/:id` から会話開始、`/company/messages` から会話一覧・返信
  - 学生: `/messages` から会話一覧・返信
  - `(company_id, student_id)` の一意制約、当事者認可、送信者のサーバー側決定、本文制約を実装済み
  - Rails統合テストで新旧学生APIとメッセージAPIを検証
- 統合ログイン / 登録
  - `/login` と `/register` で学生・企業を選択
  - 旧 `/companies/new`、`/companies/login` は新画面へリダイレクト
- 求人掲載・閲覧（自動検証済み、目視確認待ち）
  - 企業: `/company/jobs` で作成・一覧・編集・削除
  - 学生: `/companies` で企業と掲載求人を閲覧、`/jobs` で求人一覧・詳細を閲覧
  - `JobPosting` / `job_postings`、企業所有権の認可、必須項目・文字数制約を実装済み

### 未着手

- 優先度4以降: 学生向け検索・企業一覧など
- UI整備

## 次に実装する機能と順序

名称・パス移行、メッセージ機能、統合ログイン / 登録、求人掲載・閲覧は実装済み。旧API、旧画面リダイレクト、旧トークンキーの読込互換は移行期間中のみ残している。求人の目視確認後、UI整備と追加機能のどちらを優先するか決める。

メッセージは一方通行の送信だけでなく、双方向の会話として実装する方針。

- `Conversation`: 企業と学生の組み合わせごとに1件。最初の送信時に作成する
- `Message`: `Conversation`に属し、送信者種別と本文を持つ
- 企業側: 一覧から学生詳細へ進み、会話を開始・返信できるようにする
- 学生側: 会話一覧とスレッドを見て返信できるようにする

メッセージ機能の実装順は、最小限の呼称・パス移行 → Railsのモデル・マイグレーション → 認可を含むAPIとリクエストテスト → フロントエンドの企業側送信画面 → 学生側閲覧・返信画面として完了した。

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
- 2026-09-15時点の最新コミットは `9439f72 Unify student and company authentication pages`。求人機能は目視確認前の未コミット変更。
- 呼称変更: `Student` モデル、`students` テーブル、`/students` API、`studentApiToken` に統一済み。過去のDB migrationは履歴として維持する。
- 画面遷移・設計方針と実装差分（これからやること）は `docs/SCREEN_FLOW.md` にまとめている。
