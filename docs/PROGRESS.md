# 進捗・設計メモ

## 実行環境

- Docker Compose で `backend`(Rails APIモード) / `frontend`(Next.js) / `db`(PostgreSQL) を起動
- `npm run dev` で `docker compose up --build` を実行(フォアグラウンド、Ctrl+Cで停止 = コンテナも停止)
- ポート: バックエンド http://localhost:3000 / フロントエンド http://localhost:3001(バックエンドが3000を使っているためフロントは3001にずらしている)

## できていること(インターン生側)

- `Intern` モデル(name, email, university, graduation_year, skills)
- 登録API: `POST /interns`
- ログインAPI: `POST /login`(email/password → APIトークン発行)
- 認証確認API: `GET /me`(Authorizationヘッダーのトークンから本人確認)
- 認証方式: `has_secure_password` でパスワードをハッシュ化して保存 + ランダムなトークンをログインごとに再発行し、フロントは`localStorage`に保存してAuthorizationヘッダーで送る(セッションクッキー方式ではなくトークン方式)
- フロントエンド画面
  - `/interns/new`: 登録フォーム(登録後は自動ログインしてマイページへ)
  - `/login`: ログインフォーム
  - `/mypage`: ログイン中のインターン生情報を表示、ログアウト機能

## 未着手(企業側・要件2以降)

- 企業アカウント(Company)モデル・登録・ログイン
- 企業→インターン生へのメッセージ機能
- (余裕があれば)企業の募集掲載機能
- インターン生一覧・検索(企業がインターン生を探す機能)

## 技術的な決定・メモ

- Rubyローカル未導入のため、Docker Compose上で開発(レビュアーが `docker compose up` だけで動かせるようにする狙い)
- `json` gemを`~> 2.7`に固定(Rails最新版が入れた3.0系だとJSONボディのパースでエラーになったため)
- `Intern#as_json` で `password_digest` / `api_token` をレスポンスから除外(漏洩防止)

## 次に着手する候補

1. インターン生一覧ページ(企業側機能の土台にもなる)
2. Company(企業)モデル・登録・ログイン
3. 企業→インターン生へのメッセージ機能
