# 進捗・設計メモ

## 用語の定義

要件定義書(`docs/REQUIREMENTS.md`)の言葉遣いに合わせつつ、このサービス内での意味を明確にしておく。

- **インターン生**: このサービス上で企業を探している/スカウトされたい学生アカウントのこと。実際にどこかでインターンをしている・した経験があるかは問わない(「就活生」に近い意味で使っている)。要件定義書がこの呼称を採用しているため、コード上のモデル名やUI表記もこれに揃えている。
- **企業**: インターン生を探し、メッセージを送る側のアカウント。
- **マイページ**: ログインしたインターン生本人が、自分の登録情報を確認する画面(`/mypage`)。他のインターン生の情報は見えない。
- **ダッシュボード**: ログインした企業が、インターン生一覧を確認する画面(`/companies/dashboard`)。企業ログインが必須で、インターン生からはアクセスできない。
- **APIトークン**: ログイン成功時にサーバーが発行するランダムな文字列。ブラウザの`localStorage`に保存し、以降のAPIリクエストで「自分は誰か」を証明するために使う(Cookieセッションではなくトークン方式)。

## 実行環境

- Docker Compose で `backend`(Rails APIモード) / `frontend`(Next.js) / `db`(PostgreSQL) を起動
- `npm run dev` で `docker compose up --build` を実行(フォアグラウンド、Ctrl+Cで停止 = コンテナも停止)
- ポート: フロントエンド http://localhost:3000 / バックエンド http://localhost:3001

## テスト用ダミーアカウント(`db/seeds.rb`)

`docker compose exec backend bin/rails db:seed` で作成される。パスワードは全て `password123`。

| 種別 | メールアドレス | 名前 |
|---|---|---|
| インターン生 | intern1@example.com | 山田太郎 |
| インターン生 | intern2@example.com | 佐藤花子 |
| 企業 | company1@example.com | 株式会社サンプル |
| 企業 | company2@example.com | テスト商事株式会社 |

## できていること

### インターン生側

- `Intern` モデル(name, email, university, graduation_year, skills)
- 登録API: `POST /interns`、ログインAPI: `POST /login`、本人確認API: `GET /me`
- 認証方式: `has_secure_password` でパスワードをハッシュ化して保存 + ログインごとにAPIトークンを再発行
- 画面: `/interns/new`(登録、登録後は自動ログインしてマイページへ) / `/login` / `/mypage`

### 企業側

- `Company` モデル(name, email)。認証方式はインターン生と同じパターン
- 登録API: `POST /companies`、ログインAPI: `POST /company_login`、本人確認API: `GET /company_me`
- 画面: `/companies/new`(登録) / `/companies/login` / `/companies/dashboard`(インターン生一覧)
- `GET /interns`・`GET /interns/:id` は企業ログイン必須(インターン生のトークンではアクセスできない)

## 未着手(要件2以降)

- 企業→インターン生へのメッセージ機能 ← 次に着手
- (余裕があれば)企業の募集掲載機能
- インターン生向けの検索・企業一覧などの機能(将来的に)

## 技術的な決定・メモ

- Rubyローカル未導入のため、Docker Compose上で開発(レビュアーが `docker compose up` だけで動かせるようにする狙い)
- `json` gemを`~> 2.7`に固定(Rails最新版が入れた3.0系だとJSONボディのパースでエラーになったため)
- `Intern#as_json` / `Company#as_json` で `password_digest` / `api_token` をレスポンスから除外(漏洩防止)
- インターン生一覧・詳細は企業専用。ログイン中のインターン生本人には見せない(自分の情報は`/mypage`のみ)
