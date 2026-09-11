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

## フロントエンドの構成方針(決定事項)

- 各ページ(`page.tsx`)には画面固有のUIだけを書き、共通処理は別ファイルに切り出す
  - `lib/api.ts`: `apiFetch()` — fetch + JSONパース + Authorizationヘッダー付与 + エラー時は`ApiError`をthrow、という共通処理
  - `lib/auth.ts`: `localStorage`へのトークン保存・取得・削除(`intern`/`company`で保存先を分離)
  - `lib/types.ts`: `Intern`/`Company`など複数ページで使う型
  - `hooks/useAuthenticatedResource.ts`: 「トークン確認→APIから自分専用のデータ取得→失敗ならログイン画面へ」という`/mypage`と`/companies/dashboard`で共通のロジックをまとめたカスタムフック
- 入力欄(`<label><input/></label>`)そのものの共通コンポーネント化はまだしていない。フォームごとに項目が異なり、今の規模では無理に共通化すると複雑になるため

## 次の設計:会話(メッセージ)機能

要件2「企業がインターン生にメッセージを送れる」は、一方通行の送信ではなく**双方向のやり取り(会話)**として設計する。

- `Conversation`: 企業とインターン生の1対1の組み合わせで1つ。最初のメッセージ送信時に自動作成
- `Message`: `Conversation`に属し、どちらが送ったか(`sender_type`)と本文を持つ

画面遷移(案):

```
[企業側]
/companies/dashboard(一覧)
 └─ インターン生をクリック → /companies/interns/:id
      (プロフィール + そのインターン生との会話スレッド + 返信フォーム。
       まだ会話がなければ最初のメッセージ送信で会話が始まる)

/companies/messages(会話一覧)
 └─ クリック → /companies/messages/:conversation_id(スレッド)

[インターン生側]
/mypage
 └─ 「メッセージ」リンク → /messages(会話一覧)
      → クリック → /messages/:conversation_id(スレッド、返信フォームあり)
```

## 未着手(要件2以降)

- 企業→インターン生への会話(メッセージ)機能 ← 次に着手
- (余裕があれば)企業の募集掲載機能
- インターン生向けの検索・企業一覧などの機能(将来的に)

## 技術的な決定・メモ

- Rubyローカル未導入のため、Docker Compose上で開発(レビュアーが `docker compose up` だけで動かせるようにする狙い)
- `json` gemを`~> 2.7`に固定(Rails最新版が入れた3.0系だとJSONボディのパースでエラーになったため)
- `Intern#as_json` / `Company#as_json` で `password_digest` / `api_token` をレスポンスから除外(漏洩防止)
- インターン生一覧・詳細は企業専用。ログイン中のインターン生本人には見せない(自分の情報は`/mypage`のみ)
