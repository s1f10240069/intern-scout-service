# 学生スカウトサービス

学生が企業・求人を探し、企業が学生へアプローチできるスカウトサービスのプロトタイプです。学生と企業の双方に必要な最小導線を、認証・求人・メッセージまで一貫して実装しています。

## できること

- 学生・企業それぞれの登録とログイン
- 学生による企業・求人の閲覧
- 企業による学生の閲覧と求人の作成・編集・削除
- 企業から学生へのメッセージ開始と、双方のスレッドでの返信

## このプロジェクトで重視したこと

機能を増やす前に、利用者が価値を感じる一連の体験を小さく完成させることを優先しました。

1. 学生が登録・ログインできる
2. 企業が学生へアプローチでき、学生が返信できる
3. 企業が求人を掲載し、学生が閲覧できる

優先順位の理由、AIを用いた開発での進め方、設計・実装・UIの工夫は、[開発の判断と工夫](docs/PRINCIPLES.md) にまとめています。

## 技術スタック

- バックエンド: Rails 8（APIモード）+ PostgreSQL
- フロントエンド: Next.js（App Router）+ TypeScript
- 実行環境: Docker Compose
- フロントエンド品質チェック: ESLint / Prettier / GitHub Actions

## 起動方法

前提: Docker Desktop が起動していること。

初回のみ、イメージの作成とデータベースの準備を行います。

```bash
docker compose build
docker compose up -d
docker compose exec backend bin/rails db:create db:migrate db:seed
docker compose down
```

以降は次のコマンドで起動します。フォアグラウンドで実行され、`Ctrl+C` で停止します。

```bash
npm run dev
```

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001

`db:seed` 実行後はテスト用アカウントで確認できます。メールアドレスは [進捗・設計メモ](docs/PROGRESS.md)、パスワードはすべて `password123` です。

## 検証

フロントエンドは次のコマンドで整形チェック、静的解析、ビルドを実行できます。GitHub Actionsでも同じ品質チェックを行います。

```bash
cd frontend
npm ci
npm run format:check
npm run lint
npm run build
```

バックエンドには、認証・認可、会話の一意性、求人の所有者制御などを確認する結合テストがあります。

```bash
docker compose exec backend bin/rails test
```

## 構成

```text
backend/   Rails API
frontend/  Next.js
docs/      開発資料
```

## 関連資料

- [開発の判断と工夫](docs/PRINCIPLES.md): 優先順位、AI活用、設計・実装・UIの意図
- [要件定義](docs/REQUIREMENTS.md): 要件と制約の正本
- [画面遷移・実装差分](docs/SCREEN_FLOW.md): 画面・APIの詳細
- [進捗・設計メモ](docs/PROGRESS.md): 現在の実装状況とテスト用アカウント

> 本プロジェクトは学習・検証用のプロトタイプです。本番運用では、認証情報の保管方式、セキュリティレビュー、監視・障害対応などを別途整備する必要があります。
