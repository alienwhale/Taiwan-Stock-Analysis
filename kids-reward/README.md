# 好棒棒集點卡

小朋友表現好時蓋一個「好棒棒」印章（有動畫和音效），集滿 30 個會跳出獎品輪盤。

- `stamp-card.html`：主程式（發佈到 claude.ai Artifact 用的版本）
- `index.html`：同一份程式包成完整網頁，可放到任何靜態網站（例如 GitHub Pages），在 Android Chrome 選「加到主畫面」當成 App 使用
- 獎品、小朋友名字、收回印章、得獎紀錄都在右上角「設定」裡

修改 `stamp-card.html` 後，重新產生 `index.html`：

```bash
cd kids-reward && { sed -n '1,6p' index.html; cat stamp-card.html; printf '\n</body></html>\n'; } > index.new && mv index.new index.html
```
