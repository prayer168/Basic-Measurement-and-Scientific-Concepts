/* 誤差頁互動：準確度/精密度靶圖、平均值計算、有效數字快答 */
(function () {
  "use strict";
  const SVGNS = "http://www.w3.org/2000/svg";

  function el(name, attrs, text) {
    const node = document.createElementNS(SVGNS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ─────────── 靶圖 ─────────── */
  // 鏢點座標（相對靶心）
  const TARGETS = [
    { id: "aa", title: "又準又精密", darts: [[-6, 4], [5, -5], [-2, -7], [6, 6], [0, 2]],
      why: "五鏢都集中在靶心附近：測量值彼此接近（精密度高），平均起來也接近真值（準確度高）。這是最理想的測量！" },
    { id: "pa", title: "精密但不準確", darts: [[38, -34], [45, -28], [40, -40], [48, -35], [43, -30]],
      why: "五鏢很集中（精密度高），卻整群偏離靶心（準確度低）——像天平沒歸零，每次都偏同一邊，是「系統誤差」的特徵。" },
    { id: "ap", title: "準確但不精密", darts: [[-40, 8], [35, -20], [-12, 42], [28, 30], [-15, -45]],
      why: "五鏢分散（精密度低），但平均位置剛好在靶心附近（準確度尚可）——分散主要來自「隨機誤差」，多測幾次取平均可以改善。" },
    { id: "nn", title: "不準也不精密", darts: [[20, -55], [58, -10], [30, 48], [65, 25], [45, -42]],
      why: "五鏢又散又偏：同時有明顯的系統誤差與隨機誤差，儀器和方法都需要檢討。" }
  ];

  const grid = document.getElementById("targetGrid");
  const targetFeedback = document.getElementById("targetFeedback");

  TARGETS.forEach(function (t) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "target-card";
    btn.setAttribute("aria-pressed", "false");
    const svg = el("svg", { viewBox: "-80 -80 160 160", width: 150, height: 150, role: "img",
      "aria-label": "飛鏢靶：" + t.title });
    [70, 52, 34, 16].forEach(function (r, i) {
      svg.appendChild(el("circle", { cx: 0, cy: 0, r: r, fill: i % 2 ? "#fff" : "#fecaca", stroke: "#b91c1c", "stroke-width": 1.5 }));
    });
    svg.appendChild(el("circle", { cx: 0, cy: 0, r: 5, fill: "#b91c1c" }));
    t.darts.forEach(function (d) {
      svg.appendChild(el("circle", { cx: d[0], cy: d[1], r: 4.5, fill: "#1d4ed8", stroke: "#fff", "stroke-width": 1.5 }));
    });
    btn.appendChild(svg);
    const h = document.createElement("h4");
    h.textContent = t.title;
    btn.appendChild(h);
    btn.addEventListener("click", function () {
      Array.prototype.forEach.call(grid.children, function (c) { c.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      targetFeedback.className = "feedback neutral show";
      targetFeedback.innerHTML = "<strong>" + t.title + "</strong>：" + t.why;
    });
    grid.appendChild(btn);
  });

  /* ─────────── 平均值 ─────────── */
  document.getElementById("avgBtn").addEventListener("click", function () {
    const fb = document.getElementById("avgFeedback");
    fb.className = "feedback show good";
    fb.innerHTML = "平均值 = (2.0 + 2.2 + 1.9 + 2.1 + 1.8) ÷ 5 = 10.0 ÷ 5 = <strong>2.0 秒</strong>。<br>" +
      "五次測量有快有慢（隨機誤差），取平均後互相抵消，結果比單獨一次更可靠！<br>" +
      "💡 更聰明的做法：直接測「來回 20 次」再除以 20，按錶的誤差只發生 2 次，影響更小。";
  });

  /* ─────────── 有效數字快答 ─────────── */
  const SIG_QUESTIONS = [
    { num: "6.47 cm",   ans: 3, why: "非零數字都有效：6、4、7 → 3 位。" },
    { num: "0.052 g",   ans: 2, why: "開頭的 0 只是定位用，無效；5、2 有效 → 2 位。" },
    { num: "5.20 cm",   ans: 3, why: "小數末尾的 0 是估計值，有效！5、2、0 → 3 位。" },
    { num: "6.07 g",    ans: 3, why: "夾在中間的 0 有效：6、0、7 → 3 位。" },
    { num: "0.00340 kg", ans: 3, why: "開頭的 0 無效、末尾的 0 有效：3、4、0 → 3 位。" },
    { num: "12.0 mL",   ans: 3, why: "1、2 加上末尾有效的 0 → 3 位。" },
    { num: "105 s",     ans: 3, why: "中間的 0 有效：1、0、5 → 3 位。" },
    { num: "0.8 m",     ans: 1, why: "開頭 0 無效，只有 8 有效 → 1 位。" }
  ];
  let sigIdx = -1;
  const sigNumber = document.getElementById("sigNumber");
  const sigButtons = document.getElementById("sigButtons");
  const sigFeedback = document.getElementById("sigFeedback");

  for (let n = 1; n <= 5; n++) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "sig-btn"; b.textContent = String(n);
    b.setAttribute("aria-label", n + " 位有效數字");
    b.addEventListener("click", function () {
      const q = SIG_QUESTIONS[sigIdx];
      Array.prototype.forEach.call(sigButtons.children, function (x) { x.disabled = true; });
      if (n === q.ans) {
        b.classList.add("correct");
        sigFeedback.className = "feedback show good";
        sigFeedback.textContent = "✅ 答對！" + q.why;
      } else {
        b.classList.add("wrong");
        sigButtons.children[q.ans - 1].classList.add("correct");
        sigFeedback.className = "feedback show bad";
        sigFeedback.textContent = "❌ 正確答案是 " + q.ans + " 位。" + q.why;
      }
    });
    sigButtons.appendChild(b);
  }

  function nextSig() {
    sigIdx = (sigIdx + 1) % SIG_QUESTIONS.length;
    sigNumber.textContent = SIG_QUESTIONS[sigIdx].num;
    sigFeedback.className = "feedback";
    sigFeedback.textContent = "";
    Array.prototype.forEach.call(sigButtons.children, function (x) {
      x.disabled = false;
      x.classList.remove("correct", "wrong");
    });
  }
  document.getElementById("sigNextBtn").addEventListener("click", nextSig);
  nextSig();
})();
