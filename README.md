# Next.js 終端機風格個人網站

這是一個使用 [Next.js](https://nextjs.org) 和 `create-next-app` 建立的專案，打造成一個復古風格的終端機介面個人網站。

## ✨ 功能特色

*   **互動式終端機介面**：使用者可以像在真實的終端機中一樣輸入指令來瀏覽網站內容。
*   **AI 聊天模式**：整合 Vercel AI SDK，提供一個可以與 AI 進行對話的聊天模式。
*   **指令導航**：透過 `about`, `skills`, `projects`, `contact` 等指令來顯示不同區塊的資訊。
*   **響應式設計**：使用 Tailwind CSS 確保在各種裝置上都有良好的顯示效果。

## 🚀 開始使用

首先，請執行開發伺服器：

```bash
# 建議使用 pnpm
pnpm install
pnpm dev
```

在您的瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 來查看結果。

您可以透過修改 `src/app/page.tsx` 來編輯頁面。當您編輯檔案時，頁面會自動更新。

## ⌨️ 可用指令

| 指令      | 描述                             |
| :-------- | :------------------------------- |
| `about`   | 關於我                           |
| `skills`  | 我的專業技能                     |
| `projects`| 精選專案                         |
| `contact` | 聯絡我的方式                     |
| `help`    | 顯示所有可用的指令               |
| `command` | 顯示指令面板 (隱藏彩蛋) |
| `clear`   | 清除終端機的歷史紀錄             |
| `chat`    | 進入 AI 聊天模式                 |
| `exit`    | (在聊天模式中) 退出聊天模式      |


## 🛠️ 技術棧

*   **框架**: [Next.js](https://nextjs.org/)
*   **語言**: [TypeScript](https://www.typescriptlang.org/)
*   **UI**: [React](https://react.dev/)
*   **樣式**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
*   **字體**: 使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自動優化並載入 [Geist](https://vercel.com/font)。

## 部署到 Vercel

部署您的 Next.js 應用程式最簡單的方式是使用由 Next.js 創作者提供的 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

更多詳細資訊請參考我們的 [Next.js 部署文件](https://nextjs.org/docs/app/building-your-application/deploying)。
