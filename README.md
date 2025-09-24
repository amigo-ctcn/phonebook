# 校內分機表 PWA

這是一個可安裝在手機上的 **校內分機表 Progressive Web App (PWA)**。

## 📂 專案結構
```
pwa-phonebook/
 ├── index.html          ← 主頁（fetch phone_data.json）
 ├── phone_data.json     ← 分機表資料（249 筆完整資料）
 ├── manifest.json       ← PWA 設定
 ├── service-worker.js   ← 離線快取
 └── icons/
      ├── icon-192.png
      └── icon-512.png
```

## 🚀 部署到 GitHub Pages

1. 登入 [GitHub](https://github.com)，建立一個新的公開 repository，例如：`pwa-phonebook`。
2. 解壓縮 `pwa-phonebook-final.zip`，將裡面的所有檔案上傳到 repository。
   - 進入 repo → 點 **Add file → Upload files**。
   - 把檔案（包含 `index.html`, `phone_data.json`, `manifest.json`, `service-worker.js`, `icons/`）全部拖曳到 GitHub 上傳。
   - 下方 **Commit changes** 按鈕按下即可（不用更改訊息）。
3. 啟用 GitHub Pages：
   - 進入 repo → 點 **Settings** → 左側選單 **Pages**。
   - 在 **Source** 區域選擇：Branch → `main`，資料夾選 `/root`，然後 Save。
   - 等 1-2 分鐘，GitHub Pages 就會生成網址，例如：
     ```
     https://你的帳號.github.io/pwa-phonebook/
     ```
4. 用手機打開這個網址：
   - iPhone Safari → 點選 **分享** → **加入主畫面**。
   - Android Chrome → 會跳出「安裝 App」提示。

## 📱 使用方式
- 搜尋：輸入姓名/職稱或分機號碼，按 Enter 或點「🔍 搜尋」。
- 排序：可依分機升冪/降冪排序。
- 「顯示全部」可恢復顯示完整清單。
- 支援離線：第一次載入後，即使沒有網路也能使用。

---
✨ 現在你就可以把這個分機表安裝到手機上，像原生 App 一樣使用！
