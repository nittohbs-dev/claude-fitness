# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
npm run dev       # 開発サーバー起動（Vite HMR）
npm run build     # 型チェック + プロダクションビルド（tsc -b && vite build）
npm run lint      # ESLint 実行
npm run preview   # プロダクションビルドのプレビュー
```

テストフレームワークは未設定。

## アーキテクチャ

**ワークアウト記録＋ゲーミフィケーション**アプリ。トレーニングした部位に応じてカニのマスコット（Claude）が成長する仕組み。

### データフロー

```
ユーザーがワークアウトを記録 → workoutStore.addWorkout()
  → calcPoints(sets, reps, weight)    # sets * reps * (weight || 1)
  → checkGoalAchievements()           # 達成済みゴールを自動検出
  → localStorage に永続化
```

### 状態管理

すべての状態は [src/store/workoutStore.ts](src/store/workoutStore.ts) の単一 Zustand ストアで管理。すべてのミューテーション時に `localStorage` へ自動保存。ストアは算出セレクター（`getStats`、`getLogsByDate`、`getWorkoutDates`）とアクションを提供する。

### 型定義

ドメイン型はすべて [src/types/index.ts](src/types/index.ts) に集約。5つの部位（`arms`, `legs`, `back`, `chest`, `shoulders`）は `BodyPartId` として型定義され、カニの体の各部位（ハサミ・脚・甲羅・胴体・目柄）にマッピングされる。

### マスコット描画

[src/components/character/ClaudeMascot.tsx](src/components/character/ClaudeMascot.tsx) は `BodyPartStats` を受け取り、各部位を Framer Motion でアニメーションしながらスケールさせる純粋な SVG コンポーネント。各部位のスケールは `getLevelInfo(points).scale` で取得する。

### レベルシステム

[src/utils/characterLevel.ts](src/utils/characterLevel.ts) に6段階のレベル（ひよっこ → ルーキー → セミプロ → プロ → エリート → レジェンド）とポイント閾値・スケール倍率を定義。ポイント計算 `calcPoints` もここにある。

### ゴールのライフサイクル

ゴールには3つの状態がある：`achieved: false` → `achieved: true`（`checkGoalAchievements` が設定）→ `shipped: true`（`shipGoal` が設定）。`pendingShipment` フィールドが未シップの達成ゴールを1件保持し、お祝いUIのトリガーとなる。

### 現在の状態

`src/App.tsx` はまだ Vite デフォルトテンプレートのままで、ワークアウトストアやコンポーネントとは未接続。
