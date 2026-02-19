# Gym High Bar Challenge Cup

体操競技（鉄棒）リアルタイム採点・速報システム

**公開URL**: https://kaito-imadu.github.io/Gym-High-Bar-live-result/

---

## 現在の状態

モックデータ（ダミーデータ）でUI全体が動作する状態です。
実際のデータベースにはまだ接続していないため、ページを更新すると変更はリセットされます。

### 完成済み

| 画面 | パス | 説明 |
|------|------|------|
| トップページ | `/` | 大会一覧 |
| ライブリザルト | `/competition/{id}/results` | ランキング表・アコーディオン詳細 |
| 掲示板モード | `/competition/{id}/scoreboard` | 会場プロジェクター向け全画面表示 |
| 審判ログイン | `/competition/{id}/judge` | 役割選択・パスワード入力 |
| 審判スコア入力 | `/competition/{id}/judge/score` | D/E/ND 役割別の入力UI |
| 管理ダッシュボード | `/competition/{id}/admin` | 統計・メニュー |
| 選手管理 | `/competition/{id}/admin/athletes` | 選手の追加・削除 |
| 審判設定 | `/competition/{id}/admin/judges` | 審判名の設定 |
| 競技進行管理 | `/competition/{id}/admin/run` | 演技の開始・スコア確定 |

---

## 次にやること（ステップバイステップ）

### ステップ1: Supabase プロジェクトの作成

1. [supabase.com](https://supabase.com) にアクセスしてアカウント作成（GitHubログイン可）
2. 「New Project」でプロジェクト作成
   - Project name: `gym-high-bar` など
   - Database Password: 安全なパスワードを設定（メモしておく）
   - Region: `Northeast Asia (Tokyo)` を選択
3. プロジェクト作成後、以下の情報をメモ
   - **Project URL**: `https://xxxx.supabase.co`
   - **anon key**: Settings → API に記載

### ステップ2: データベーステーブルの作成

Supabase ダッシュボードの「SQL Editor」で以下のSQLを実行してテーブルを作成します。

```sql
-- 大会テーブル
CREATE TABLE competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  venue TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed')),
  admin_password TEXT,
  judge_password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 審判パネルテーブル
CREATE TABLE judge_panels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('D1', 'D2', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'ND')),
  judge_name TEXT NOT NULL,
  is_chief BOOLEAN DEFAULT FALSE
);

-- 選手テーブル
CREATE TABLE athletes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  affiliation TEXT DEFAULT '',
  grade TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  start_order INTEGER NOT NULL
);

-- 演技テーブル
CREATE TABLE performances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scoring', 'confirmed')),
  d_score NUMERIC(5,3),
  e_score NUMERIC(5,3),
  nd_score NUMERIC(5,3) DEFAULT 0,
  final_score NUMERIC(6,3),
  rank INTEGER,
  is_current BOOLEAN DEFAULT FALSE
);

-- 審判スコアテーブル
CREATE TABLE judge_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  performance_id UUID REFERENCES performances(id) ON DELETE CASCADE,
  judge_panel_id UUID REFERENCES judge_panels(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  score_value NUMERIC(5,3),
  submitted_at TIMESTAMPTZ
);

-- リアルタイム配信を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE performances;
ALTER PUBLICATION supabase_realtime ADD TABLE judge_scores;
```

### ステップ3: Supabase クライアントの設定

1. Supabase のクライアントライブラリをインストール

```bash
npm install @supabase/supabase-js
```

2. 環境変数ファイルを作成

`.env.local` を作成（gitにはコミットしない）:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxx
```

3. Supabase クライアント設定ファイルを作成

`src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### ステップ4: モックデータをDB接続に置き換え

各ページで `mock-data.ts` から読んでいる箇所を、Supabase からのデータ取得に書き換えます。

例（ライブリザルト画面）:
```typescript
// 変更前: import { getPerformancesWithDetails } from "@/lib/mock-data";
// 変更後:
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// コンポーネント内で
const [performances, setPerformances] = useState([]);

useEffect(() => {
  // 初回データ取得
  supabase
    .from("performances")
    .select("*, athlete:athletes(*), judge_scores(*)")
    .eq("competition_id", competitionId)
    .then(({ data }) => setPerformances(data ?? []));

  // リアルタイム購読
  const channel = supabase
    .channel("performances")
    .on("postgres_changes", { event: "*", schema: "public", table: "performances" }, (payload) => {
      // データを再取得して更新
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [competitionId]);
```

### ステップ5: GitHub Pages の環境変数設定

GitHub Pages（静的サイト）では `.env.local` が使えないため、ビルド時に環境変数を渡します。

1. GitHub リポジトリの Settings → Secrets and variables → Actions
2. 以下を「Repository secrets」に追加:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `.github/workflows/deploy.yml` の build ステップに追加:

```yaml
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### ステップ6: セキュリティ設定（RLS）

Supabase ダッシュボードの SQL Editor で実行:

```sql
-- RLS（行レベルセキュリティ）を有効化
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_panels ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能（公開ページ用）
CREATE POLICY "Public read" ON competitions FOR SELECT USING (true);
CREATE POLICY "Public read" ON athletes FOR SELECT USING (true);
CREATE POLICY "Public read" ON performances FOR SELECT USING (true);
CREATE POLICY "Public read" ON judge_scores FOR SELECT USING (true);
CREATE POLICY "Public read" ON judge_panels FOR SELECT USING (true);

-- 書き込みは認証済みユーザーのみ（後で細かく設定）
CREATE POLICY "Auth write" ON judge_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth write" ON performances FOR UPDATE USING (true);
```

---

## ローカル開発

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動（http://localhost:3000）
npm run dev

# 本番ビルド（静的エクスポート → out/ ディレクトリ）
npm run build
```

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router, Static Export)
- **スタイリング**: Tailwind CSS v4
- **アイコン**: Lucide React
- **デプロイ**: GitHub Pages + GitHub Actions
- **DB（予定）**: Supabase (PostgreSQL + Realtime)

## プロジェクト構成

```
src/
├── app/                  # ページ（App Router）
├── components/           # 共通UIコンポーネント
├── lib/
│   ├── mock-data.ts      # モックデータ（Supabase接続後に不要）
│   ├── scoring.ts        # Eスコア計算ロジック（トリム平均）
│   └── static-params.ts  # 静的パス生成
└── types/
    └── index.ts          # TypeScript型定義
```

## 採点計算ロジック

- **E審判 1〜3人**: 単純平均
- **E審判 4人以上**: 最高点・最低点をカットした後の平均（トリム平均）
- **最終得点** = Dスコア + Eスコア - ND（ニュートラルディダクション）
