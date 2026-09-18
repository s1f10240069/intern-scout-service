# 学生スカウトサービス

学生と企業をマッチングするスカウトサービスのプロトタイプ。

## 技術スタック

- バックエンド: Rails 8 (APIモード) + PostgreSQL
- フロントエンド: Next.js (App Router, TypeScript)
- 実行環境: Docker Compose

## 起動方法

前提: Docker Desktop がインストール済みであること。

初回のみDB作成が必要です。

```bash
docker compose build
docker compose up -d
docker compose exec backend bin/rails db:create db:migrate db:seed
docker compose down
```

`db:seed` でテスト用のダミーアカウントが作成されます(詳細は [docs/PROGRESS.md](docs/PROGRESS.md) 参照、パスワードは全て `password123`)。

以降は以下で起動・停止できます(フォアグラウンドで実行され、Ctrl+Cで停止すればコンテナも一緒に止まります)。

```bash
npm run dev
```

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001

## ディレクトリ構成

```
backend/   Rails API
frontend/  Next.js
```

## ドキュメント

- [要件定義](docs/REQUIREMENTS.md): 機能の優先順位とリポジトリの制約（正本）
- [設計方針・開発アプローチ](docs/PRINCIPLES.md): 実装時に立ち返る原則と現在の優先順位
- [画面遷移・実装差分](docs/SCREEN_FLOW.md): 将来の画面/API設計、メッセージの認可・DB制約、安全な移行手順
- [進捗・設計メモ](docs/PROGRESS.md): 現在できていることと設計経緯
- [AI引き継ぎメモ](docs/AI_HANDOFF.md): 作業を再開するための短い要約

学生名称・パスの移行、メッセージ機能、ログイン／登録ページの統合は完了済み。企業の求人掲載・学生の求人閲覧も実装済みで、目視確認後にUI整備と追加機能の優先順位を決める。詳しい状況は [画面遷移・実装差分](docs/SCREEN_FLOW.md) を参照。
