# インターン生スカウトサービス

インターン生と企業をマッチングするスカウトサービスのプロトタイプ。

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
docker compose exec backend bin/rails db:create db:migrate
docker compose down
```

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
