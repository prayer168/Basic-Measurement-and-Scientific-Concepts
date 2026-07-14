/* 共用版面：頁首、頁籤導覽、上下頁、頁尾、跨頁進度（localStorage） */
(function () {
  "use strict";

  const PAGES = [
    { id: "home",      file: "index.html",     icon: "🏠", title: "學習任務" },
    { id: "measure",   file: "measure.html",   icon: "📏", title: "基本測量" },
    { id: "density",   file: "density.html",   icon: "⚖️", title: "密度與圖表" },
    { id: "error",     file: "error.html",     icon: "🎯", title: "誤差與有效數字" },
    { id: "apply",     file: "apply.html",     icon: "🏡", title: "生活應用" },
    { id: "quiz",      file: "quiz.html",      icon: "🏆", title: "闖關大挑戰" },
    { id: "resources", file: "resources.html", icon: "🔗", title: "自主學習" }
  ];

  const STORE_KEY = "bmsc-progress-v1";

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || { visited: {}, quizBest: null };
    } catch (e) {
      return { visited: {}, quizBest: null };
    }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* 私密模式忽略 */ }
  }

  const pageId = document.body.dataset.page || "home";
  const idx = PAGES.findIndex(function (p) { return p.id === pageId; });

  // 記錄本頁已造訪
  const progress = loadProgress();
  progress.visited[pageId] = true;
  saveProgress(progress);

  // 頁首
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<h1>🔬 基本測量與科學概念</h1>' +
    '<p class="subtitle">長度・質量・時間・體積｜密度與圖表判讀｜實驗誤差與有效數字｜國中八年級 自然科學</p>';

  // 頁籤導覽（真實連結）
  const nav = document.createElement("nav");
  nav.className = "tab-nav";
  nav.setAttribute("aria-label", "教材單元導覽");
  nav.innerHTML = PAGES.map(function (p) {
    const current = p.id === pageId ? ' aria-current="page"' : "";
    const done = progress.visited[p.id] && p.id !== pageId ? ' <span class="done-mark" aria-label="已造訪">✓</span>' : "";
    return '<a href="' + p.file + '"' + current + ">" + p.icon + " " + p.title + done + "</a>";
  }).join("");

  const skip = document.createElement("a");
  skip.href = "#main";
  skip.className = "skip-link";
  skip.textContent = "跳到主要內容";

  document.body.insertBefore(nav, document.body.firstChild);
  document.body.insertBefore(header, nav);
  document.body.insertBefore(skip, header);

  // 上一頁／下一頁
  const main = document.getElementById("main");
  if (main && idx >= 0) {
    const pager = document.createElement("div");
    pager.className = "pager";
    let html = "";
    if (idx > 0) {
      const prev = PAGES[idx - 1];
      html += '<a href="' + prev.file + '">← ' + prev.icon + " " + prev.title + "</a>";
    }
    html += '<span class="spacer"></span>';
    if (idx < PAGES.length - 1) {
      const next = PAGES[idx + 1];
      html += '<a href="' + next.file + '">' + next.icon + " " + next.title + " →</a>";
    }
    pager.innerHTML = html;
    main.appendChild(pager);
  }

  // 頁尾
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML =
    "黑熊老師自然科學數位教材｜基本測量與科學概念｜適用國中八年級（自然科學／理化）<br>" +
    "本教材以 HTML／SVG／JavaScript 製作，支援電腦、平板與手機。";
  document.body.appendChild(footer);

  // 鍵盤左右鍵切換頁籤（不干擾輸入元件）
  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea, select, [contenteditable]")) return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "ArrowLeft" && idx > 0) location.href = PAGES[idx - 1].file;
    if (e.key === "ArrowRight" && idx >= 0 && idx < PAGES.length - 1) location.href = PAGES[idx + 1].file;
  });

  // 對外提供進度 API
  window.BMSC = {
    PAGES: PAGES,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    resetProgress: function () { localStorage.removeItem(STORE_KEY); }
  };
})();
