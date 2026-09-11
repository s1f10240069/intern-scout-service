# 進捗・設計メモ

## 実行環境

- Docker Compose で `backend`(Rails APIモード) / `frontend`(Next.js) / `db`(PostgreSQL) を起動
- `npm run dev` で `docker compose up --build` を実行(フォアグラウンド、Ctrl+Cで停止 = コンテナも停止)
- ポート: フロントエンド http://localhost:3000 / バックエンド http://localhost:3001

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

## 画面・アクセス制御の方針(決定事項)

- インターン生一覧・詳細ページは**企業専用**。ログイン中のインターン生本人には見せない(自分の情報は`/mypage`のみ)
- 企業側もインターン生と同じ設計パターン(Companyモデル + パスワード認証 + APIトークン)でログイン機能を持つ
- `GET /interns`(一覧)・`GET /interns/:id`(詳細)は企業ログイン必須にする(現状は未保護なので対応が必要)

## 未着手(企業側・要件2以降)

- 企業アカウント(Company)モデル・登録・ログイン ← 次に着手
- 企業から見えるインターン生一覧ページ
- 企業→インターン生へのメッセージ機能
- (余裕があれば)企業の募集掲載機能
- インターン生向けの検索機能(将来的に。企業一覧など)

## 技術的な決定・メモ

- Rubyローカル未導入のため、Docker Compose上で開発(レビュアーが `docker compose up` だけで動かせるようにする狙い)
- `json` gemを`~> 2.7`に固定(Rails最新版が入れた3.0系だとJSONボディのパースでエラーになったため)
- `Intern#as_json` で `password_digest` / `api_token` をレスポンスから除外(漏洩防止)

## 次に着手する候補

1. Company(企業)モデル・登録・ログイン(インターン生と同じ認証パターン)
2. `GET /interns` を企業ログイン必須に変更 + 企業側インターン一覧ページ
3. 企業→インターン生へのメッセージ機能
