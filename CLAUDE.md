# CLAUDE.md

旧 salmicat（ZINE）の共通アセット置き場。2015-12 作成、最終コミットは 2016-11。Claude Code / Codex 共通の入口（`AGENTS.md` はこのファイルへのシンボリックリンク）。

## 中身

- `src/css/` — WordPress 用（`wp.css`・`wp-article.css`）、はてなブログ用（`hb.css`）
- `src/js/` — `wp.js`・`social.js`（SNS シェア）・`autopager.js`
- `src/salmicons/` — 独自アイコンフォント
- `src/img/` — ロゴ・SNS アイコン
- `src/vendor/` — woothee.js・off-screen-nav.css
- `Rakefile` / `wercker.yml` — `src/` を S3 の `assets/` へ上げる旧デプロイ。wercker はサービス終了済み、Ruby の `aws` gem も古く、そのままでは動かない

## 現状（2026-10-28 確認）

- 配信先 `cdn.salmicat.com` は DNS が引けない。README の CDN 参照は今は使えない
- 本体の新リポは [salmicat](https://github.com/zine-inc/salmicat)（ローカル `~/Documents/Coding/salmicat`）

## 運用区分

- **Project S2**（自動運用枠、2026-10-28 本人指定）。Claude が commit → push → PR 作成 → auto-merge enable まで自律で進めてよい（`project-s2-auto-push`）。PR は `pr-issue-format`、Project S2 (#2) に紐付ける
- 開始時に `git status --short --branch`。write 作業は worktree へ分離する。既定ブランチは `master`
- デプロイ用の AWS 認証は環境変数で渡す設計。`credentials.csv` は gitignore 済みで、作らない・コミットしない。Secret は 1Password だけ
- 公開する CSS / JS にコメントを足さない（`public-no-comments`）
