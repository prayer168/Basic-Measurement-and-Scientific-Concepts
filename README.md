# 基本測量與科學概念｜互動數位教材

Basic Measurement and Scientific Concepts — an interactive digital lesson for junior high science.

🌐 **線上使用**：https://prayer168.github.io/Basic-Measurement-and-Scientific-Concepts/

## 教材簡介

適用**國中八年級 自然科學（理化）**的互動式數位教材，涵蓋理化第一章的三大主題：

1. **長度、質量、時間與體積**——國際單位制、直尺估計值、量筒凹液面讀數、排水法、上皿天平操作
2. **密度與圖表判讀**——密度是物質的特性、M–V 圖斜率、浮沉條件
3. **實驗誤差與有效數字**——準確度與精密度、系統誤差與隨機誤差、有效數字規則

## 教材特色

- 📏 **直尺讀數練習**：五組題目練習「準確值＋估計值」的紀錄方式
- 🧪 **量筒互動**：俯視／平視／仰視的視差示意＋排水法動畫
- ⚖️ **上皿天平四階段動畫**：歸零 → 放待測物 → 加砝碼 → 平衡讀數，圖文逐階段同步
- 🔬 **密度實驗室**：自選物質與體積、讀電子秤、把數據點畫上 M–V 圖，發現「斜率＝密度」
- 🌊 **浮沉預測站**：先預測再驗證，浮體依真實密度比例沉入水中（冰塊 92% 在水下！）
- 🎯 **準確度 vs 精密度靶圖**、多次測量取平均、有效數字快問快答
- 🏡 **六則生活應用**：每則配專屬會動的 SVG 動畫（加油站、熱氣球、死海、王冠、烘焙、馬拉松晶片）
- 🏆 **10 道素養導向闖關題**：即時回饋、解說、回看教材連結、成績與學習建議
- 📱 支援電腦、平板、手機，支援鍵盤操作與 `prefers-reduced-motion`

## 頁面架構（多頁式）

| 頁面 | 檔案 | 內容 |
|---|---|---|
| 🏠 學習任務 | `index.html` | 學習目標、學習地圖、進度追蹤 |
| 📏 基本測量 | `measure.html` | 單位、直尺、量筒、天平、時間 |
| ⚖️ 密度與圖表 | `density.html` | 密度實驗室、圖表判讀、浮沉預測 |
| 🎯 誤差與有效數字 | `error.html` | 靶圖、誤差類型、有效數字 |
| 🏡 生活應用 | `apply.html` | 六則情境動畫 |
| 🏆 闖關大挑戰 | `quiz.html` | 10 題測驗 |
| 🔗 自主學習 | `resources.html` | 七個精選外部資源 |

## 使用方式

直接開啟網站即可，無須安裝。本機預覽：

```bash
python -m http.server 8000
# 瀏覽 http://localhost:8000
```

## 使用技術

HTML5、CSS3、SVG、原生 JavaScript（無框架、無建置工具）。學習進度以 `localStorage` 跨頁保存。

## 課綱對應（108 課綱 自然科學領域）

- 學習內容：Ab-IV-1 物質的質量與體積、Ab-IV-2 密度（實際代碼請教師依正式課綱手冊確認）
- 探究能力：觀察與定題、計畫與執行（測量與紀錄）、分析與發現（圖表判讀）
- 核心素養：自-J-A2 探究能力、自-J-B2 運用科學資訊

> 課綱代碼標示為參考，正式教學請依教育部公告之課程手冊確認。

## 專案結構

```
├─ index.html / measure.html / density.html / error.html
├─ apply.html / quiz.html / resources.html
├─ css/   style.css, animation.css, responsive.css
├─ js/    chrome.js, measure.js, density.js, error.js,
│         applyAnim.js, apply.js, quiz-data.js, quiz.js
├─ assets/images/og-cover.png
└─ docs/  references.md, test-report.md
```

## 授權與引用

教材內容由黑熊老師（prayer168）製作，供教育用途自由使用。物性數值參考來源見 `docs/references.md`。
