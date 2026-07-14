/* 基本測量頁互動：直尺讀數、量筒視線、排水法、上皿天平 */
(function () {
  "use strict";
  const SVGNS = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(name, attrs, text) {
    const node = document.createElementNS(SVGNS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ─────────── 互動①：直尺讀數 ─────────── */
  const RULER_QUESTIONS = [
    { len: 6.47, opts: [
      { t: "6.47 cm", ok: true,  why: "6.4 cm 是刻度可直接讀出的準確值，最後的 0.07 cm 是估計值——記錄到最小刻度（0.1 cm）的下一位，正確！" },
      { t: "6.4 cm",  ok: false, why: "只讀到最小刻度，少了一位「估計值」。科學紀錄要多估一位喔！" },
      { t: "6.5 cm",  ok: false, why: "鉛筆末端還沒到 6.5，直接進位會失去測量的細節。" },
      { t: "6.472 cm", ok: false, why: "估計值只能有一位！直尺無法估計到 0.001 cm 這麼精細。" }
    ]},
    { len: 3.82, opts: [
      { t: "3.82 cm", ok: true,  why: "準確值 3.8 cm ＋ 估計值 0.02 cm，記錄到 0.01 cm 位，正確！" },
      { t: "3.8 cm",  ok: false, why: "少了估計值。末端在 3.8 和 3.9 之間，要再估一位。" },
      { t: "3.9 cm",  ok: false, why: "末端還不到 3.9 cm，這樣讀就偏大了。" },
      { t: "38.2 cm", ok: false, why: "單位換算錯囉！刻度上的數字是公分（cm），3.82 cm = 38.2 mm。" }
    ]},
    { len: 5.20, opts: [
      { t: "5.20 cm", ok: true,  why: "末端剛好對齊 5.2 的刻度線，估計值是 0——這個 0 要寫出來！5.20 表示我們有估計到 0.01 cm 位。" },
      { t: "5.2 cm",  ok: false, why: "意思不一樣喔！5.2 cm 表示只讀到 0.1 cm 位；寫 5.20 cm 才表示有估計到 0.01 cm 位、估計值為 0。" },
      { t: "5 cm",    ok: false, why: "太粗略了，連最小刻度都沒讀到。" },
      { t: "5.21 cm", ok: false, why: "末端就在刻度線上，估計值應該是 0 才對。" }
    ]},
    { len: 8.15, opts: [
      { t: "8.15 cm", ok: true,  why: "準確值 8.1 cm ＋ 估計值 0.05 cm（末端約在 8.1 和 8.2 的正中間），正確！" },
      { t: "8.1 cm",  ok: false, why: "少了估計值，要記錄到最小刻度的下一位。" },
      { t: "8.2 cm",  ok: false, why: "末端在 8.1 與 8.2 中間，讀 8.2 偏大且沒有估計位。" },
      { t: "8.150 cm", ok: false, why: "估計值只能有一位，不能寫到 0.001 cm 位。" }
    ]},
    { len: 2.73, opts: [
      { t: "2.73 cm", ok: true,  why: "準確值 2.7 cm ＋ 估計值 0.03 cm，正確！" },
      { t: "2.7 cm",  ok: false, why: "少了估計值。" },
      { t: "2.8 cm",  ok: false, why: "末端還不到 2.8 cm。" },
      { t: "27.3 cm", ok: false, why: "刻度單位是公分。2.73 cm = 27.3 mm，別把 mm 和 cm 搞混了。" }
    ]}
  ];

  const rulerSvg = document.getElementById("rulerSvg");
  const rulerOptions = document.getElementById("rulerOptions");
  const rulerFeedback = document.getElementById("rulerFeedback");
  let rulerIdx = 0;

  function drawRuler(lenCm) {
    rulerSvg.innerHTML = "";
    const x0 = 40, scale = 58, yTop = 78;
    // 鉛筆（左端 = 0 刻度，右端 = 測量端）
    const endX = x0 + lenCm * scale;
    const pen = el("g", {});
    pen.appendChild(el("rect", { x: x0, y: 30, width: 14, height: 26, rx: 3, fill: "#f9a8d4", stroke: "#be185d", "stroke-width": 1.5 })); // 橡皮擦
    pen.appendChild(el("rect", { x: x0 + 14, y: 30, width: Math.max(endX - x0 - 40, 10), height: 26, fill: "#fbbf24", stroke: "#b45309", "stroke-width": 1.5 }));
    pen.appendChild(el("polygon", { points: (endX - 26) + ",30 " + endX + ",43 " + (endX - 26) + ",56", fill: "#fde68a", stroke: "#b45309", "stroke-width": 1.5 }));
    pen.appendChild(el("polygon", { points: (endX - 8) + ",39 " + endX + ",43 " + (endX - 8) + ",47", fill: "#334155" }));
    rulerSvg.appendChild(pen);
    // 末端指示虛線
    rulerSvg.appendChild(el("line", { x1: endX, y1: 26, x2: endX, y2: yTop, stroke: "#dc2626", "stroke-width": 1.5, "stroke-dasharray": "4 3" }));
    // 直尺
    rulerSvg.appendChild(el("rect", { x: x0 - 14, y: yTop, width: 10 * scale + 28, height: 62, rx: 4, fill: "#fef3c7", stroke: "#b45309", "stroke-width": 2 }));
    for (let mm = 0; mm <= 100; mm++) {
      const x = x0 + mm * scale / 10;
      let tickLen = 10, w = 1;
      if (mm % 10 === 0) { tickLen = 24; w = 1.8; }
      else if (mm % 5 === 0) { tickLen = 16; w = 1.3; }
      rulerSvg.appendChild(el("line", { x1: x, y1: yTop, x2: x, y2: yTop + tickLen, stroke: "#78350f", "stroke-width": w }));
      if (mm % 10 === 0) {
        rulerSvg.appendChild(el("text", { x: x, y: yTop + 42, "font-size": 14, fill: "#78350f", "text-anchor": "middle" }, String(mm / 10)));
      }
    }
    rulerSvg.appendChild(el("text", { x: x0 + 10 * scale, y: yTop + 58, "font-size": 12, fill: "#78350f", "text-anchor": "end" }, "單位：cm（最小刻度 1 mm）"));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function renderRulerQuestion() {
    const q = RULER_QUESTIONS[rulerIdx];
    drawRuler(q.len);
    rulerOptions.innerHTML = "";
    rulerFeedback.className = "feedback";
    rulerFeedback.textContent = "";
    shuffle(q.opts).forEach(function (o) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = o.t;
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(rulerOptions.children, function (b) { b.disabled = true; });
        btn.classList.add(o.ok ? "correct" : "wrong");
        if (!o.ok) {
          Array.prototype.forEach.call(rulerOptions.children, function (b) {
            const match = q.opts.find(function (x) { return x.t === b.textContent; });
            if (match && match.ok) b.classList.add("correct");
          });
        }
        rulerFeedback.className = "feedback show " + (o.ok ? "good" : "bad");
        rulerFeedback.textContent = (o.ok ? "✅ 答對了！" : "❌ 再想想～") + o.why;
      });
      rulerOptions.appendChild(btn);
    });
  }

  document.getElementById("rulerNextBtn").addEventListener("click", function () {
    rulerIdx = (rulerIdx + 1) % RULER_QUESTIONS.length;
    renderRulerQuestion();
  });
  renderRulerQuestion();

  /* ─────────── 互動②A：量筒視線 ─────────── */
  const cylSvg = document.getElementById("cylViewSvg");
  const cylFeedback = document.getElementById("cylViewFeedback");
  const CYL = { left: 200, right: 300, waterY: 150, mlToPx: 4 };

  function drawCylView(view) {
    cylSvg.innerHTML = "";
    // 量筒本體
    cylSvg.appendChild(el("rect", { x: CYL.left, y: 60, width: 100, height: 210, rx: 5, fill: "#f0f9ff", stroke: "#0369a1", "stroke-width": 3 }));
    // 水（凹液面）
    const w = el("path", {
      d: "M" + (CYL.left + 3) + " " + (CYL.waterY + 6) +
         " Q " + (CYL.left + 50) + " " + (CYL.waterY + 14) + " " + (CYL.right - 3) + " " + (CYL.waterY + 6) +
         " L " + (CYL.right - 3) + " 267 L " + (CYL.left + 3) + " 267 Z",
      fill: "#7dd3fc", opacity: 0.85
    });
    cylSvg.appendChild(w);
    cylSvg.appendChild(el("path", {
      d: "M" + (CYL.left + 3) + " " + (CYL.waterY + 6) + " Q " + (CYL.left + 50) + " " + (CYL.waterY + 14) + " " + (CYL.right - 3) + " " + (CYL.waterY + 6),
      fill: "none", stroke: "#0284c7", "stroke-width": 2.5
    }));
    // 凹液面最低點
    cylSvg.appendChild(el("circle", { cx: CYL.left + 50, cy: CYL.waterY + 10, r: 3.5, fill: "#dc2626" }));
    // 刻度（20–45 mL，每 5 mL 一格）
    for (let ml = 20; ml <= 45; ml += 5) {
      const y = CYL.waterY - (ml - 32) * CYL.mlToPx - 2; // 32 mL 對齊凹液面底
      cylSvg.appendChild(el("line", { x1: CYL.left, y1: y, x2: CYL.left + 16, y2: y, stroke: "#0369a1", "stroke-width": 2 }));
      cylSvg.appendChild(el("text", { x: CYL.left + 20, y: y + 5, "font-size": 12, fill: "#0369a1" }, ml + "" ));
    }
    cylSvg.appendChild(el("text", { x: CYL.left + 50, y: 52, "font-size": 12, fill: "#4a6076", "text-anchor": "middle" }, "量筒（mL）"));

    if (!view) {
      cylSvg.appendChild(el("text", { x: 90, y: 160, "font-size": 14, fill: "#4a6076", "text-anchor": "middle" }, "選一個視線角度 →"));
      return;
    }
    const eyeY = view === "down" ? 80 : view === "up" ? 224 : CYL.waterY + 10;
    const eyeX = 70;
    const mx = CYL.left + 50, my = CYL.waterY + 10; // 凹液面最低點
    // 視線（延伸到量筒後壁）
    const t = (CYL.right - eyeX) / (mx - eyeX);
    const backY = eyeY + (my - eyeY) * t;
    cylSvg.appendChild(el("line", { x1: eyeX, y1: eyeY, x2: CYL.right, y2: backY, stroke: "#dc2626", "stroke-width": 2, "stroke-dasharray": "6 4" }));
    // 眼睛
    const eye = el("g", {});
    eye.appendChild(el("ellipse", { cx: eyeX - 14, cy: eyeY, rx: 20, ry: 12, fill: "#fff", stroke: "#334155", "stroke-width": 2 }));
    eye.appendChild(el("circle", { cx: eyeX - 10, cy: eyeY, r: 5.5, fill: "#334155" }));
    cylSvg.appendChild(eye);
    // 視線與前壁（刻度面）交點 → 表觀讀數
    const t2 = (CYL.left - eyeX) / (mx - eyeX);
    const frontY = eyeY + (my - eyeY) * t2;
    cylSvg.appendChild(el("circle", { cx: CYL.left, cy: frontY, r: 5, fill: "none", stroke: "#dc2626", "stroke-width": 2.5 }));
    const reading = view === "down" ? "33.5" : view === "up" ? "30.5" : "32.0";
    cylSvg.appendChild(el("text", { x: CYL.left - 6, y: frontY - 8, "font-size": 14, "font-weight": "bold", fill: "#dc2626", "text-anchor": "end" }, "讀到 " + reading));
  }

  const cylMsgs = {
    down: { cls: "bad",  msg: "❌ 俯視時，視線斜穿過液面，會把刻度「讀得偏高」（33.5 mL > 實際 32.0 mL）。" },
    level: { cls: "good", msg: "✅ 正確！視線與凹液面最低處水平，讀數 32.0 mL 才是準確的。" },
    up: { cls: "bad",  msg: "❌ 仰視時讀數會「偏低」（30.5 mL < 實際 32.0 mL）。記得蹲下來讓視線平視！" }
  };
  document.querySelectorAll("[data-view]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const v = btn.dataset.view;
      drawCylView(v);
      cylFeedback.className = "feedback show " + cylMsgs[v].cls;
      cylFeedback.textContent = cylMsgs[v].msg;
    });
  });
  drawCylView(null);

  /* ─────────── 互動②B：排水法 ─────────── */
  const dispSvg = document.getElementById("dispSvg");
  const dispFeedback = document.getElementById("dispFeedback");
  const D = { left: 130, right: 230, bottom: 258, mlToPx: 2 }; // 100 mL 量筒
  let stoneState = "up"; // up | dropping | down
  let waterLevel = 32;   // mL
  let stoneG, waterRect, waterLine, dispLabel;

  function yOfMl(ml) { return D.bottom - ml * D.mlToPx; }

  function drawDisp() {
    dispSvg.innerHTML = "";
    dispSvg.appendChild(el("rect", { x: D.left, y: 40, width: 100, height: 224, rx: 5, fill: "#f0f9ff", stroke: "#0369a1", "stroke-width": 3 }));
    waterRect = el("rect", { x: D.left + 3, y: yOfMl(waterLevel), width: 94, height: D.bottom - yOfMl(waterLevel) + 3, fill: "#7dd3fc", opacity: 0.85 });
    dispSvg.appendChild(waterRect);
    waterLine = el("line", { x1: D.left + 3, y1: yOfMl(waterLevel), x2: D.right - 3, y2: yOfMl(waterLevel), stroke: "#0284c7", "stroke-width": 2.5 });
    dispSvg.appendChild(waterLine);
    for (let ml = 0; ml <= 100; ml += 20) {
      const y = yOfMl(ml);
      dispSvg.appendChild(el("line", { x1: D.left, y1: y, x2: D.left + 16, y2: y, stroke: "#0369a1", "stroke-width": 2 }));
      dispSvg.appendChild(el("text", { x: D.left + 20, y: y + 5, "font-size": 12, fill: "#0369a1" }, String(ml)));
    }
    // 石塊（不規則多邊形）
    stoneG = el("g", {});
    const stone = el("polygon", {
      points: "-16,-6 -8,-16 6,-18 17,-8 15,6 4,15 -10,12",
      fill: "#9ca3af", stroke: "#4b5563", "stroke-width": 2
    });
    stoneG.appendChild(stone);
    stoneG.appendChild(el("circle", { cx: -4, cy: -4, r: 2.5, fill: "#6b7280" }));
    stoneG.appendChild(el("circle", { cx: 7, cy: 4, r: 2, fill: "#6b7280" }));
    stoneG.setAttribute("transform", "translate(180, 72)");
    dispSvg.appendChild(stoneG);
    dispLabel = el("text", { x: D.right + 8, y: yOfMl(waterLevel) + 4, "font-size": 14, "font-weight": "bold", fill: "#0369a1" }, "V₁ = 32 mL");
    dispSvg.appendChild(dispLabel);
  }

  function animateDrop() {
    if (stoneState !== "up") return;
    stoneState = "dropping";
    const startY = 72, endY = 232, waterFrom = 32, waterTo = 46;
    const dur = reduceMotion ? 1 : 1200;
    const t0 = performance.now();
    function frame(now) {
      let p = Math.min((now - t0) / dur, 1);
      const ease = p * p * (3 - 2 * p);
      const sy = startY + (endY - startY) * ease;
      stoneG.setAttribute("transform", "translate(180, " + sy + ")");
      const wl = waterFrom + (waterTo - waterFrom) * (p < 0.55 ? 0 : (p - 0.55) / 0.45);
      const y = yOfMl(wl);
      waterRect.setAttribute("y", y);
      waterRect.setAttribute("height", D.bottom - y + 3);
      waterLine.setAttribute("y1", y); waterLine.setAttribute("y2", y);
      dispLabel.setAttribute("y", y + 4);
      if (p >= 1) {
        stoneState = "down";
        dispLabel.textContent = "V₂ = 46 mL";
        dispFeedback.className = "feedback show good";
        dispFeedback.innerHTML = "💧 水位從 32 mL 上升到 46 mL。<br>石塊體積 = V₂ − V₁ = 46 − 32 = <strong>14 mL = 14 cm³</strong>！（1 mL = 1 cm³）";
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.getElementById("dropStoneBtn").addEventListener("click", animateDrop);
  document.getElementById("resetStoneBtn").addEventListener("click", function () {
    stoneState = "up"; waterLevel = 32; drawDisp();
    dispFeedback.className = "feedback neutral show";
    dispFeedback.textContent = "目前水位 V₁ = 32 mL。按「放入石塊」觀察水位變化。";
  });
  drawDisp();

  /* ─────────── 天平四階段動畫 ─────────── */
  const BAL_STAGES = [
    { name: "① 歸零校平", angle: 0, obj: false, weights: 0,
      cap: "把天平放在水平桌面上，游碼歸零，再調整兩端的「平衡螺絲」，讓指針靜止在刻度板中央。" },
    { name: "② 放待測物", angle: -6, obj: true, weights: 0,
      cap: "把待測的石塊放在「左盤」。左邊變重，指針偏向一側——現在還不能讀數！" },
    { name: "③ 加砝碼", angle: -2, obj: true, weights: 2,
      cap: "用鑷子把砝碼放到「右盤」，由大到小依序嘗試：先放 50 g，再放 10 g……接近平衡了！" },
    { name: "④ 平衡讀數", angle: 0, obj: true, weights: 3, wobble: true,
      cap: "再加 5 g 後指針回到中央，天平平衡！石塊質量 = 50 + 10 + 5 = 65 g。" }
  ];
  const balSvg = document.getElementById("balanceSvg");
  const balFlow = document.getElementById("balanceFlow");
  const balCaption = document.getElementById("balanceCaption");
  let balStage = 0;
  let beamG, leftPanG, rightPanG, objG, weightGs, sumLabel, screwL, screwR;

  function buildBalance() {
    balSvg.innerHTML = "";
    // 底座與支柱
    balSvg.appendChild(el("rect", { x: 150, y: 252, width: 180, height: 14, rx: 5, fill: "#475569" }));
    balSvg.appendChild(el("rect", { x: 234, y: 130, width: 12, height: 124, fill: "#64748b" }));
    // 刻度板
    balSvg.appendChild(el("path", { d: "M214 176 a26 26 0 0 1 52 0", fill: "#fff", stroke: "#94a3b8", "stroke-width": 2 }));
    balSvg.appendChild(el("line", { x1: 240, y1: 150, x2: 240, y2: 160, stroke: "#334155", "stroke-width": 2 }));
    // 橫梁組（含指針），以 (240,124) 為軸旋轉
    beamG = el("g", {});
    beamG.appendChild(el("rect", { x: 128, y: 118, width: 224, height: 10, rx: 4, fill: "#334155" }));
    beamG.appendChild(el("line", { x1: 240, y1: 128, x2: 240, y2: 172, stroke: "#dc2626", "stroke-width": 3 })); // 指針
    // 平衡螺絲
    screwL = el("rect", { x: 116, y: 118, width: 12, height: 10, rx: 2, fill: "#f59e0b", stroke: "#b45309" });
    screwR = el("rect", { x: 352, y: 118, width: 12, height: 10, rx: 2, fill: "#f59e0b", stroke: "#b45309" });
    beamG.appendChild(screwL); beamG.appendChild(screwR);
    balSvg.appendChild(beamG);
    // 左右秤盤（支架＋盤面）
    leftPanG = el("g", {});
    leftPanG.appendChild(el("line", { x1: 160, y1: 120, x2: 160, y2: 100, stroke: "#64748b", "stroke-width": 3 }));
    leftPanG.appendChild(el("ellipse", { cx: 160, cy: 98, rx: 44, ry: 9, fill: "#cbd5e1", stroke: "#64748b", "stroke-width": 2 }));
    balSvg.appendChild(leftPanG);
    rightPanG = el("g", {});
    rightPanG.appendChild(el("line", { x1: 320, y1: 120, x2: 320, y2: 100, stroke: "#64748b", "stroke-width": 3 }));
    rightPanG.appendChild(el("ellipse", { cx: 320, cy: 98, rx: 44, ry: 9, fill: "#cbd5e1", stroke: "#64748b", "stroke-width": 2 }));
    balSvg.appendChild(rightPanG);
    // 待測物（石塊）
    objG = el("g", {});
    const s = el("polygon", { points: "146,92 152,78 168,74 178,84 174,94 158,97", fill: "#9ca3af", stroke: "#4b5563", "stroke-width": 2 });
    objG.appendChild(s);
    objG.appendChild(el("text", { x: 162, y: 66, "font-size": 12, fill: "#4a6076", "text-anchor": "middle" }, "待測物"));
    balSvg.appendChild(objG);
    // 砝碼（50、10、5 g）
    weightGs = [];
    const wDefs = [
      { x: 296, w: 24, h: 22, label: "50" },
      { x: 324, w: 16, h: 15, label: "10" },
      { x: 344, w: 12, h: 11, label: "5" }
    ];
    wDefs.forEach(function (d) {
      const g = el("g", {});
      g.appendChild(el("rect", { x: d.x, y: 96 - d.h, width: d.w, height: d.h, rx: 2, fill: "#fbbf24", stroke: "#92400e", "stroke-width": 1.5 }));
      g.appendChild(el("text", { x: d.x + d.w / 2, y: 96 - d.h - 4, "font-size": 10, fill: "#92400e", "text-anchor": "middle" }, d.label + "g"));
      balSvg.appendChild(g);
      weightGs.push(g);
    });
    sumLabel = el("text", { x: 240, y: 292, "font-size": 16, "font-weight": "bold", fill: "#15803d", "text-anchor": "middle" }, "質量 = 50 + 10 + 5 = 65 g");
    balSvg.appendChild(sumLabel);
    // 左右盤文字
    balSvg.appendChild(el("text", { x: 160, y: 236, "font-size": 13, fill: "#4a6076", "text-anchor": "middle" }, "左盤：待測物"));
    balSvg.appendChild(el("text", { x: 320, y: 236, "font-size": 13, fill: "#4a6076", "text-anchor": "middle" }, "右盤：砝碼"));
  }

  function setBalStage(i) {
    balStage = i;
    const st = BAL_STAGES[i];
    const rad = st.angle * Math.PI / 180;
    const dy = Math.sin(rad) * 80; // 盤到支點約 80px
    beamG.classList.remove("beam-balancing");
    beamG.setAttribute("transform", "rotate(" + st.angle + " 240 123)");
    if (st.wobble && !reduceMotion) {
      void beamG.getBoundingClientRect();
      beamG.classList.add("beam-balancing");
    }
    leftPanG.setAttribute("transform", "translate(0," + (-dy) + ")");
    rightPanG.setAttribute("transform", "translate(0," + dy + ")");
    objG.setAttribute("transform", "translate(0," + (-dy) + ")");
    objG.setAttribute("visibility", st.obj ? "visible" : "hidden");
    weightGs.forEach(function (g, k) {
      g.setAttribute("visibility", k < st.weights ? "visible" : "hidden");
      g.setAttribute("transform", "translate(0," + dy + ")");
    });
    sumLabel.setAttribute("visibility", i === 3 ? "visible" : "hidden");
    // 螺絲提示（僅第一步醒目）
    screwL.setAttribute("stroke-width", i === 0 ? 3 : 1);
    screwR.setAttribute("stroke-width", i === 0 ? 3 : 1);
    balCaption.textContent = st.cap;
    Array.prototype.forEach.call(balFlow.querySelectorAll(".stage-step"), function (node) {
      node.setAttribute("aria-pressed", String(Number(node.dataset.idx) === i));
    });
    document.getElementById("balancePrevBtn").disabled = i === 0;
    document.getElementById("balanceNextBtn").disabled = i === BAL_STAGES.length - 1;
  }

  BAL_STAGES.forEach(function (st, i) {
    if (i > 0) {
      const arrow = document.createElement("span");
      arrow.className = "arrow"; arrow.textContent = "→"; arrow.setAttribute("aria-hidden", "true");
      balFlow.appendChild(arrow);
    }
    const b = document.createElement("button");
    b.type = "button"; b.className = "stage-step"; b.textContent = st.name;
    b.dataset.idx = i;
    b.addEventListener("click", function () { setBalStage(i); });
    balFlow.appendChild(b);
  });
  document.getElementById("balancePrevBtn").addEventListener("click", function () { if (balStage > 0) setBalStage(balStage - 1); });
  document.getElementById("balanceNextBtn").addEventListener("click", function () { if (balStage < BAL_STAGES.length - 1) setBalStage(balStage + 1); });

  buildBalance();
  setBalStage(0);
})();
