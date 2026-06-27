# HoloTeam 從零開始

一套自主運營虛擬團隊 AI 系統「HoloTeam」的開發全紀錄與線上課程。從最早的純 Markdown 規則，一路演化到能獨立安裝的桌面軟體。

共 28 個單元，分為四個部分：

- 序章：認識 HoloTeam
- 第一部・SKILL 版：寄生在 Claude Code 裡的純文字虛擬團隊（2.0 到 MCP 保護版）
- 轉折：為什麼放棄 SKILL 版改做單機版
- 第二部・單機版：用 Electron 做成桌面 App 的 21 個功能模組

## 線上閱讀

本站部署於 GitHub Pages，公開網址見本 repo 的 Settings → Pages。

## 本機預覽

在本資料夾執行任一靜態伺服器即可，例如：

    python -m http.server 8099

然後用瀏覽器開啟 http://localhost:8099/

## 技術說明

純靜態網站，無建置流程。內容以單一資料檔（assets/content.js）載入，前端用 marked 渲染 Markdown、DOMPurify 消毒，皆本地化引用，離線可跑。

## 內容定位

這套文件同時是三種東西：給新手的課程教材、HoloTeam 的詳細使用說明書，以及一份記錄「這套系統是怎麼做出來的、走過哪些彎路」的開發筆記。

製作者：黃政文
