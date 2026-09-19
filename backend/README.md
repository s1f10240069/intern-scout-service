# Backend

学生スカウトサービスのRails APIです。Docker Composeによるデータベース準備を含む起動方法、テスト用アカウント、設計上の判断は[ルートREADME](../README.md)を参照してください。

## テスト

リポジトリのルートでコンテナを起動した状態で実行します。

```bash
docker compose exec backend bin/rails test
```

APIの画面・ルート・認可設計の詳細は[画面遷移・実装差分](../docs/SCREEN_FLOW.md)に記載しています。
