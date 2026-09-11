# インターン生スカウトサービス

インターン生と企業をマッチングするスカウトサービスのプロトタイプ。

## 技術スタック

- バックエンド: Rails 8 (APIモード) + PostgreSQL
- フロントエンド: Next.js (App Router, TypeScript)
- 実行環境: Docker Compose

## 起動方法

前提: Docker Desktop がインストール済みであること。

```bash
docker compose build
docker compose up -d
docker compose exec backend bin/rails db:create db:migrate
```

- フロントエンド: http://localhost:3001
- バックエンドAPI: http://localhost:3000

停止する場合:

```bash
docker compose down
```

## ディレクトリ構成

```
backend/   Rails API
frontend/  Next.js
```
