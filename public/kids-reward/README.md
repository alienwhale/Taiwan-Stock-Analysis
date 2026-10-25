# 好棒棒集點卡

小朋友表現好時蓋一個「好棒棒」印章（有動畫和音效），集滿 30 個可以轉獎品輪盤，或存起來累積換更大的獎。

## 檔案

- `stamp-card.html`：主程式（也是發佈到 claude.ai Artifact 的版本）
- `index.html`：由 `build.sh` 產生的完整網頁，可安裝成手機 App（PWA）
- `manifest.webmanifest`、`icon-*.png`、`sw.js`：App 名稱、圖示、離線支援

修改 `stamp-card.html` 後執行 `./build.sh` 重新產生 `index.html`。

## 安裝到 Android 手機

這個資料夾在 `public/` 底下，Vercel 部署後網址是 `https://<你的網站>/kids-reward/`。

1. 用 Android 的 Chrome 打開上面的網址
2. 點右上角「⋮」→「安裝應用程式」（或「加到主畫面」）
3. 主畫面會出現「好棒棒」圖示，點開是全螢幕 App，沒有網路也能用

紀錄存在手機本身，和 claude.ai 上的版本不互通。
