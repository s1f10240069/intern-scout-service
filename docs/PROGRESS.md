# 進捗・設計メモ

## 用語の定義

要件定義書(`docs/REQUIREMENTS.md`)の言葉遣いに合わせつつ、このサービス内での意味を明確にしておく。

- **学生**: このサービス上で企業を探している/スカウトされたいユーザーのこと。実際にどこかでインターンをしている・した経験があるかは問わない(「就活生」に近い意味で使っている)。2026-09-11 に旧称「インターン生」から「学生」へ改称した。
- **企業**: 学生を探し、メッセージを送る側のアカウント。
- **マイページ**: ログインした学生本人が、自分の登録情報を確認する画面(`/mypage`)。他の学生の情報は見えない。
- **学生一覧**: ログインした企業が、学生一覧を確認する画面(`/company/students`)。旧称「ダッシュボード」(`/companies/dashboard`)から改称済みで、旧URLは一時的にリダイレクトする。企業ログインが必須で、学生からはアクセスできない。
- **APIトークン**: ログイン成功時にサーバーが発行するランダムな文字列。ブラウザの`localStorage`に保存し、以降のAPIリクエストで「自分は誰か」を証明するために使う(Cookieセッションではなくトークン方式)。

## 実行環境

- Docker Compose で `backend`(Rails APIモード) / `frontend`(Next.js) / `db`(PostgreSQL) を起動
- `npm run dev` で `docker compose up --build` を実行(フォアグラウンド、Ctrl+Cで停止 = コンテナも停止)
- ポート: フロントエンド http://localhost:3000 / バックエンド http://localhost:3001

## テスト用ダミーアカウント(`db/seeds.rb`)

`docker compose exec backend bin/rails db:seed` で作成される。パスワードは全て `password123`。

| 種別 | メールアドレス | 名前 |
|---|---|---|
| 学生 | intern1@example.com | 山田太郎 |
| 学生 | intern2@example.com | 佐藤花子 |
| 企業 | company1@example.com | 株式会社サンプル |
| 企業 | company2@example.com | テスト商事株式会社 |

## できていること

### 学生側

- `Student` モデル(name, email, university, graduation_year, skills)
- 登録API: `POST /students`、ログインAPI: `POST /login`、本人確認API: `GET /me`
- 旧 `/interns` APIは移行期間中の互換ルートとして維持
- 認証方式: `has_secure_password` でパスワードをハッシュ化して保存 + ログインごとにAPIトークンを再発行
- 画面: `/interns/new`(登録、登録後は自動ログインしてマイページへ) / `/login` / `/mypage`

### 企業側

- `Company` モデル(name, email)。認証方式は学生と同じパターン
- 登録API: `POST /companies`、ログインAPI: `POST /company_login`、本人確認API: `GET /company_me`
- 画面: `/companies/new`(登録) / `/companies/login` / `/company/students`(学生一覧)
- 旧 `/companies/dashboard` は `/company/students` へリダイレクト
- `GET /students`・`GET /students/:id` は企業ログイン必須(学生のトークンではアクセスできない)

## フロントエンドの構成方針(決定事項)

- 各ページ(`page.tsx`)には画面固有のUIだけを書き、共通処理は別ファイルに切り出す
  - `lib/api.ts`: `apiFetch()` — fetch + JSONパース + Authorizationヘッダー付与 + エラー時は`ApiError`をthrow、という共通処理
  - `lib/auth.ts`: `localStorage`へのトークン保存・取得・削除(`student`/`company`で保存先を分離。旧キーは初回読込時に移行)
  - `lib/types.ts`: `Student`/`Company`など複数ページで使う型
  - `hooks/useAuthenticatedResource.ts`: 「トークン確認→APIから自分専用のデータ取得→失敗ならログイン画面へ」という`/mypage`と`/company/students`で共通のロジックをまとめたカスタムフック
- 入力欄(`<label><input/></label>`)そのものの共通コンポーネント化はまだしていない。フォームごとに項目が異なり、今の規模では無理に共通化すると複雑になるため

## 次の設計:会話(メッセージ)機能

要件2「企業が学生にメッセージを送れる」は、一方通行の送信ではなく**双方向のやり取り(会話)**として設計する。

メッセージ機能へ着手する前の `Intern` → `Student` と `/companies/dashboard` → `/company/students` の最小限の移行は完了した。統合ログイン / 登録はメッセージ完成後に回す。移行中は新旧ルートを一時併存させる。

- `Conversation`: 企業と学生の1対1の組み合わせで1つ。最初のメッセージ送信時に自動作成
- `Message`: `Conversation`に属し、どちらが送ったか(`sender_type`)と本文を持つ
- `(company_id, student_id)` はDBの複合ユニーク制約で重複を防ぐ
- `sender_type` はクライアント入力を信用せず、認証済みアカウントからサーバー側で決定する
- 会話の当事者だけが一覧・閲覧・送信できるように認可する

画面遷移(案):

```
[企業側]
/company/students(学生一覧)
 └─ 学生をクリック → /company/students/:id
      (プロフィール + その学生との会話スレッド + 返信フォーム。
       まだ会話がなければ最初のメッセージ送信で会話が始まる)

/company/messages(会話一覧)
 └─ クリック → /company/messages/:conversation_id(スレッド)

[学生側]
/mypage
 └─ 「メッセージ」リンク → /messages(会話一覧)
      → クリック → /messages/:conversation_id(スレッド、返信フォームあり)
```

## 未着手（優先度順）

- 企業→学生への会話(メッセージ)機能 ← 次に着手
- 統合ログイン / 登録
- 企業の募集掲載機能
- 学生向けの検索・企業一覧などの機能（将来的に）

## 技術的な決定・メモ

- Rubyローカル未導入のため、Docker Compose上で開発(レビュアーが `docker compose up` だけで動かせるようにする狙い)
- `json` gemを`~> 2.7`に固定(Rails最新版が入れた3.0系だとJSONボディのパースでエラーになったため)
- `Student#as_json` / `Company#as_json` で `password_digest` / `api_token` をレスポンスから除外(漏洩防止)
- 学生一覧・詳細は企業専用。ログイン中の学生本人には見せない(自分の情報は`/mypage`のみ)
- 呼称変更: `Student` モデル、`students` テーブル、`/students` API、`studentApiToken` への移行済み。旧 `/interns` API・旧画面リダイレクト・旧トークンキー読込は互換用に一時維持。
- 画面遷移・設計方針と「決定済み方針」と「現実装」の差分は `docs/SCREEN_FLOW.md` にまとめている。
