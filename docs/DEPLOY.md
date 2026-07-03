# GitHub Pages への公開手順

ローカルのGitリポジトリ(コミット済み)を GitHub Pages で公開する手順です。
所要時間は5分ほど。

## 1. GitHubでリポジトリを作る

1. https://github.com/new を開く(YuzuAtelierアカウントでログイン)
2. 次のように入力:
   - Repository name: `tabi-budget`
   - Public を選択(GitHub PagesはPublicで無料)
   - **「Add a README file」等のチェックは全部オフのまま**(ローカルに既にあるため)
3. **Create repository** をクリック

※個人データ(Excel・変換済みJSON・要件メモ等)は `.gitignore` で除外済みです。
公開されるのはアプリ本体と同期の導入手順だけです。

## 2. プッシュする

このフォルダでターミナル(またはClaude Code)から:

```
git remote add origin https://github.com/YuzuAtelier/tabi-budget.git
git push -u origin main
```

初回は GitHub へのログイン(ブラウザ認証)を求められるので指示に従ってください。

## 3. GitHub Pages を有効にする

1. リポジトリの **Settings → Pages** を開く
2. Source: **Deploy from a branch**
3. Branch: **main** / フォルダ: **/(root)** を選んで **Save**
4. 1〜2分待つと `https://yuzuatelier.github.io/tabi-budget/` で公開されます

## 4. スマホにインストールする

1. Android の Chrome で上のURLを開く
2. メニュー(⋮)→ **ホーム画面に追加**(または「アプリをインストール」)
3. ホーム画面の「旅財布」アイコンから起動

## 5. 過去データを取り込む

1. `data/past-trips-import.json` をスマホに送る(Google Drive経由が簡単)
2. アプリの **⚙️設定 → JSONエクスポート/インポート → 📂JSONファイルを選んで取り込む**
3. 確認ダイアログで件数(旅行8件など)を確認して取り込み

## 6. スプレッドシート同期を設定する

`docs/SYNC_SETUP.md` の手順で GAS を設置し、アプリの設定画面にURLと合言葉を入力してください。

## 更新するとき

アプリ(index.html等)を修正したら:

```
git add -A
git commit -m "変更内容"
git push
```

数分で公開ページに反映されます。`sw.js` の `CACHE_NAME` のバージョンを上げると、
インストール済みの端末にも次回起動時に新しいバージョンが行き渡ります。
