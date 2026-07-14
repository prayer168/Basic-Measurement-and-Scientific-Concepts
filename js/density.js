/* 密度頁互動：密度實驗室、M-V 圖判讀、浮沉預測 */
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

  /* ─────────── 互動①：密度實驗室 ─────────── */
  const MATERIALS = [
    { id: "wood",    name: "松木", d: 0.5,  color: "#ca8a04", fill: "#fde68a" },
    { id: "water",   name: "純水", d: 1.0,  color: "#0284c7", fill: "#bae6fd" },
    { id: "alu",     name: "鋁",   d: 2.7,  color: "#64748b", fill: "#e2e8f0" },
    { id: "iron",    name: "鐵",   d: 7.87, color: "#374151", fill: "#9ca3af" },
    { id: "copper",  name: "銅",   d: 8.96, color: "#b45309", fill: "#fdba74" }
  ];
  let currentMat = MATERIALS[2]; // 預設鋁
  let points = []; // {matId, v, m}

  const matButtons = document.getElementById("matButtons");
  const volSlider = document.getElementById("volSlider");
  const volReadout = document.getElementById("volReadout");
  const massReadout = document.getElementById("massReadout");
  const densReadout = document.getElementById("densReadout");
  const blockSvg = document.getElementById("blockSvg");
  const chartSvg = document.getElementById("chartSvg");
  const labFeedback = document.getElementById("labFeedback");

  MATERIALS.forEach(function (m) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn secondary";
    b.textContent = m.name;
    b.style.borderColor = m.color;
    b.setAttribute("aria-pressed", String(m === currentMat));
    b.addEventListener("click", function () {
      currentMat = m;
      Array.prototype.forEach.call(matButtons.children, function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      updateLab();
    });
    matButtons.appendChild(b);
  });

  function updateLab() {
    const v = Number(volSlider.value);
    const m = currentMat.d * v;
    volReadout.textContent = v + " cm³";
    massReadout.textContent = m.toFixed(1) + " g";
    densReadout.textContent = (m / v).toFixed(2) + " g/cm³";
    // 方塊視覺：邊長 ∝ 體積的立方根
    blockSvg.innerHTML = "";
    const side = Math.cbrt(v) * 16; // 10→34px, 80→69px
    const bx = 80 - side / 2, by = 140 - side;
    blockSvg.appendChild(el("rect", { x: 20, y: 140, width: 120, height: 16, rx: 4, fill: "#475569" })); // 秤台
    blockSvg.appendChild(el("rect", { x: 40, y: 156, width: 80, height: 26, rx: 4, fill: "#334155" }));
    blockSvg.appendChild(el("rect", { x: bx, y: by, width: side, height: side, rx: 4, fill: currentMat.fill, stroke: currentMat.color, "stroke-width": 2.5 }));
    blockSvg.appendChild(el("text", { x: 80, y: by - 8, "font-size": 13, "text-anchor": "middle", fill: "#4a6076" }, currentMat.name + " " + v + " cm³"));
    // 顯示屏
    blockSvg.appendChild(el("rect", { x: 170, y: 150, width: 110, height: 36, rx: 6, fill: "#0b3954" }));
    blockSvg.appendChild(el("text", { x: 225, y: 175, "font-size": 18, "text-anchor": "middle", fill: "#7fe3ff", "font-family": "Consolas, monospace" }, m.toFixed(1) + " g"));
    blockSvg.appendChild(el("text", { x: 225, y: 144, "font-size": 12, "text-anchor": "middle", fill: "#4a6076" }, "電子秤顯示"));
  }
  volSlider.addEventListener("input", updateLab);

  // M-V 圖
  const CH = { x0: 58, y0: 300, x1: 440, y1: 24, vMax: 100, mMax: 800 };
  function px(v) { return CH.x0 + (v / CH.vMax) * (CH.x1 - CH.x0); }
  function py(m) { return CH.y0 - (m / CH.mMax) * (CH.y0 - CH.y1); }

  function drawChart() {
    chartSvg.innerHTML = "";
    // 座標軸
    chartSvg.appendChild(el("line", { x1: CH.x0, y1: CH.y0, x2: CH.x1 + 6, y2: CH.y0, stroke: "#334155", "stroke-width": 2 }));
    chartSvg.appendChild(el("line", { x1: CH.x0, y1: CH.y0, x2: CH.x0, y2: CH.y1 - 6, stroke: "#334155", "stroke-width": 2 }));
    chartSvg.appendChild(el("polygon", { points: (CH.x1 + 12) + "," + CH.y0 + " " + (CH.x1 + 2) + "," + (CH.y0 - 4) + " " + (CH.x1 + 2) + "," + (CH.y0 + 4), fill: "#334155" }));
    chartSvg.appendChild(el("polygon", { points: CH.x0 + "," + (CH.y1 - 12) + " " + (CH.x0 - 4) + "," + (CH.y1 - 2) + " " + (CH.x0 + 4) + "," + (CH.y1 - 2), fill: "#334155" }));
    chartSvg.appendChild(el("text", { x: CH.x1, y: CH.y0 + 30, "font-size": 13, fill: "#334155", "text-anchor": "end" }, "體積 V (cm³)"));
    chartSvg.appendChild(el("text", { x: CH.x0 - 44, y: CH.y1 + 4, "font-size": 13, fill: "#334155" }, "質量 M (g)"));
    // 格線與刻度
    for (let v = 20; v <= 100; v += 20) {
      chartSvg.appendChild(el("line", { x1: px(v), y1: CH.y0, x2: px(v), y2: CH.y1, stroke: "#e2e8f0", "stroke-width": 1 }));
      chartSvg.appendChild(el("text", { x: px(v), y: CH.y0 + 18, "font-size": 12, fill: "#4a6076", "text-anchor": "middle" }, String(v)));
    }
    for (let m = 200; m <= 800; m += 200) {
      chartSvg.appendChild(el("line", { x1: CH.x0, y1: py(m), x2: CH.x1, y2: py(m), stroke: "#e2e8f0", "stroke-width": 1 }));
      chartSvg.appendChild(el("text", { x: CH.x0 - 8, y: py(m) + 4, "font-size": 12, fill: "#4a6076", "text-anchor": "end" }, String(m)));
    }
    chartSvg.appendChild(el("text", { x: CH.x0 - 8, y: CH.y0 + 4, "font-size": 12, fill: "#4a6076", "text-anchor": "end" }, "0"));
    // 每種已有 ≥2 點的物質畫輔助直線（過原點）
    MATERIALS.forEach(function (mat) {
      const matPts = points.filter(function (p) { return p.matId === mat.id; });
      if (matPts.length >= 2) {
        const vEnd = Math.min(CH.vMax, CH.mMax / mat.d);
        chartSvg.appendChild(el("line", {
          x1: px(0), y1: py(0), x2: px(vEnd), y2: py(vEnd * mat.d),
          stroke: mat.color, "stroke-width": 1.5, "stroke-dasharray": "6 4", opacity: 0.7
        }));
      }
    });
    // 數據點
    points.forEach(function (p) {
      const mat = MATERIALS.find(function (m) { return m.id === p.matId; });
      chartSvg.appendChild(el("circle", { cx: px(p.v), cy: py(p.m), r: 6, fill: mat.fill, stroke: mat.color, "stroke-width": 2.5 }));
    });
    // 圖例
    let lx = CH.x0 + 14;
    MATERIALS.forEach(function (mat) {
      if (points.some(function (p) { return p.matId === mat.id; })) {
        chartSvg.appendChild(el("circle", { cx: lx, cy: CH.y1 + 12, r: 5, fill: mat.fill, stroke: mat.color, "stroke-width": 2 }));
        chartSvg.appendChild(el("text", { x: lx + 10, y: CH.y1 + 17, "font-size": 12, fill: "#334155" }, mat.name));
        lx += 58;
      }
    });
  }

  document.getElementById("plotBtn").addEventListener("click", function () {
    const v = Number(volSlider.value);
    const m = currentMat.d * v;
    const dup = points.some(function (p) { return p.matId === currentMat.id && p.v === v; });
    if (!dup) points.push({ matId: currentMat.id, v: v, m: m });
    drawChart();
    const matPts = points.filter(function (p) { return p.matId === currentMat.id; });
    if (matPts.length >= 3) {
      labFeedback.className = "feedback show good";
      labFeedback.innerHTML = "🎉 你發現了嗎？同一種物質的點會排成一條<strong>通過原點的直線</strong>！直線的<strong>斜率（M÷V）就是密度</strong>：" +
        currentMat.name + " 的密度 = " + currentMat.d.toFixed(2) + " g/cm³，不論體積多大都一樣——所以密度是物質的特性！";
    } else {
      labFeedback.className = "feedback neutral show";
      labFeedback.textContent = "已記錄 " + currentMat.name + "：V = " + v + " cm³、M = " + m.toFixed(1) + " g。再換不同體積多記幾點！";
    }
  });
  document.getElementById("clearPlotBtn").addEventListener("click", function () {
    points = [];
    drawChart();
    labFeedback.className = "feedback neutral show";
    labFeedback.textContent = "圖表已清空。選物質、調體積，重新收集數據！";
  });

  updateLab();
  drawChart();

  /* ─────────── 互動②：圖表判讀 ─────────── */
  const READ_LINES = [
    { id: "jia",  name: "甲", d: 8.0, color: "#dc2626" },
    { id: "yi",   name: "乙", d: 2.7, color: "#2563eb" },
    { id: "bing", name: "丙", d: 0.9, color: "#059669" }
  ];
  const readSvg = document.getElementById("readChartSvg");
  const lineInfo = document.getElementById("lineInfo");
  let selectedLine = null;

  function drawReadChart() {
    readSvg.innerHTML = "";
    readSvg.appendChild(el("line", { x1: CH.x0, y1: CH.y0, x2: CH.x1 + 6, y2: CH.y0, stroke: "#334155", "stroke-width": 2 }));
    readSvg.appendChild(el("line", { x1: CH.x0, y1: CH.y0, x2: CH.x0, y2: CH.y1 - 6, stroke: "#334155", "stroke-width": 2 }));
    readSvg.appendChild(el("text", { x: CH.x1, y: CH.y0 + 30, "font-size": 13, fill: "#334155", "text-anchor": "end" }, "體積 V (cm³)"));
    readSvg.appendChild(el("text", { x: CH.x0 - 44, y: CH.y1 + 4, "font-size": 13, fill: "#334155" }, "質量 M (g)"));
    for (let v = 20; v <= 100; v += 20) {
      readSvg.appendChild(el("line", { x1: px(v), y1: CH.y0, x2: px(v), y2: CH.y1, stroke: "#e2e8f0" }));
      readSvg.appendChild(el("text", { x: px(v), y: CH.y0 + 18, "font-size": 12, fill: "#4a6076", "text-anchor": "middle" }, String(v)));
    }
    for (let m = 200; m <= 800; m += 200) {
      readSvg.appendChild(el("line", { x1: CH.x0, y1: py(m), x2: CH.x1, y2: py(m), stroke: "#e2e8f0" }));
      readSvg.appendChild(el("text", { x: CH.x0 - 8, y: py(m) + 4, "font-size": 12, fill: "#4a6076", "text-anchor": "end" }, String(m)));
    }
    readSvg.appendChild(el("text", { x: CH.x0 - 8, y: CH.y0 + 4, "font-size": 12, fill: "#4a6076", "text-anchor": "end" }, "0"));
    READ_LINES.forEach(function (L) {
      const vEnd = Math.min(CH.vMax, CH.mMax / L.d);
      const g = el("g", { class: "svg-clickable", tabindex: 0, role: "button",
        "aria-label": "物質" + L.name + "的質量體積關係線，點選查看密度" });
      // 加粗透明命中區
      g.appendChild(el("line", { x1: px(0), y1: py(0), x2: px(vEnd), y2: py(vEnd * L.d), stroke: "transparent", "stroke-width": 18 }));
      const isSel = selectedLine === L.id;
      g.appendChild(el("line", { x1: px(0), y1: py(0), x2: px(vEnd), y2: py(vEnd * L.d), stroke: L.color, "stroke-width": isSel ? 5 : 2.5 }));
      const lv = Math.min(90, vEnd * 0.92);
      g.appendChild(el("text", { x: px(lv) + 6, y: py(lv * L.d) - 6, "font-size": 15, "font-weight": "bold", fill: L.color }, L.name));
      if (isSel) {
        // 標示取點 V=40（丙、乙）或 V=80（超出者調整）
        const vp = Math.min(40, vEnd * 0.5);
        g.appendChild(el("circle", { cx: px(vp), cy: py(vp * L.d), r: 6, fill: "#fff", stroke: L.color, "stroke-width": 3 }));
        g.appendChild(el("line", { x1: px(vp), y1: py(vp * L.d), x2: px(vp), y2: CH.y0, stroke: L.color, "stroke-dasharray": "4 4" }));
        g.appendChild(el("line", { x1: px(vp), y1: py(vp * L.d), x2: CH.x0, y2: py(vp * L.d), stroke: L.color, "stroke-dasharray": "4 4" }));
      }
      function select() {
        selectedLine = L.id;
        drawReadChart();
        const vp = Math.min(40, Math.min(CH.vMax, CH.mMax / L.d) * 0.5);
        const mp = vp * L.d;
        lineInfo.className = "feedback neutral show";
        lineInfo.innerHTML = "<strong>" + L.name + "</strong>：從圖上取一點 V = " + vp + " cm³ 時 M = " + mp.toFixed(0) +
          " g。<br>密度 = M ÷ V = " + mp.toFixed(0) + " ÷ " + vp + " = <strong>" + L.d.toFixed(1) + " g/cm³</strong>（線愈陡，密度愈大）";
      }
      g.addEventListener("click", select);
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); }
      });
      readSvg.appendChild(g);
    });
  }
  drawReadChart();

  document.querySelectorAll("#slopeOptions .option-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const fb = document.getElementById("slopeFeedback");
      document.querySelectorAll("#slopeOptions .option-btn").forEach(function (b) { b.disabled = true; });
      if (btn.dataset.ans === "甲") {
        btn.classList.add("correct");
        fb.className = "feedback show good";
        fb.textContent = "✅ 答對了！M–V 圖上，直線愈陡表示相同體積下質量愈大，密度愈大。甲的斜率 8.0 g/cm³ 最大。";
      } else {
        btn.classList.add("wrong");
        document.querySelector('#slopeOptions [data-ans="甲"]').classList.add("correct");
        fb.className = "feedback show bad";
        fb.textContent = "❌ 再想想：相同體積（例如 V = 40 cm³）時，哪條線的質量最大？線愈陡、密度愈大，答案是甲。";
      }
    });
  });

  /* ─────────── 互動③：浮沉預測 ─────────── */
  const FLOAT_MATS = [
    { name: "冰塊",   d: 0.92, fill: "#dbeafe", stroke: "#3b82f6" },
    { name: "松木塊", d: 0.5,  fill: "#fde68a", stroke: "#ca8a04" },
    { name: "石蠟",   d: 0.90, fill: "#fef9c3", stroke: "#a16207" },
    { name: "鐵塊",   d: 7.87, fill: "#9ca3af", stroke: "#374151" },
    { name: "橡皮擦", d: 1.3,  fill: "#fbcfe8", stroke: "#be185d" }
  ];
  let floatMat = null, prediction = null, floatBusy = false;
  const floatSvg = document.getElementById("floatSvg");
  const floatFeedback = document.getElementById("floatFeedback");
  const floatButtons = document.getElementById("floatMatButtons");
  const WATER_Y = 130, TANK_BOTTOM = 280, BLOCK = 44;
  let blockG;

  FLOAT_MATS.forEach(function (m) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn secondary";
    b.textContent = m.name + "（" + m.d.toFixed(2) + "）";
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () {
      if (floatBusy) return;
      floatMat = m; prediction = null;
      Array.prototype.forEach.call(floatButtons.children, function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      floatFeedback.className = "feedback";
      floatFeedback.textContent = "";
      drawTank(true);
    });
    floatButtons.appendChild(b);
  });

  function drawTank(withBlock) {
    floatSvg.innerHTML = "";
    // 水槽
    floatSvg.appendChild(el("path", { d: "M40 90 L40 " + TANK_BOTTOM + " L300 " + TANK_BOTTOM + " L300 90", fill: "none", stroke: "#334155", "stroke-width": 4 }));
    floatSvg.appendChild(el("rect", { x: 42, y: WATER_Y, width: 256, height: TANK_BOTTOM - WATER_Y - 2, fill: "#7dd3fc", opacity: 0.7 }));
    floatSvg.appendChild(el("line", { x1: 42, y1: WATER_Y, x2: 298, y2: WATER_Y, stroke: "#0284c7", "stroke-width": 2.5 }));
    floatSvg.appendChild(el("text", { x: 290, y: WATER_Y - 8, "font-size": 12, fill: "#0369a1", "text-anchor": "end" }, "水 1.00 g/cm³"));
    if (withBlock && floatMat) {
      blockG = el("g", {});
      blockG.appendChild(el("rect", { x: -BLOCK / 2, y: -BLOCK, width: BLOCK, height: BLOCK, rx: 5, fill: floatMat.fill, stroke: floatMat.stroke, "stroke-width": 2.5 }));
      blockG.appendChild(el("text", { x: 0, y: -BLOCK / 2 + 5, "font-size": 12, "text-anchor": "middle", fill: "#334155" }, floatMat.name));
      blockG.setAttribute("transform", "translate(170, 60)"); // 塊底位於 y=60
      floatSvg.appendChild(blockG);
    } else {
      floatSvg.appendChild(el("text", { x: 170, y: 50, "font-size": 14, fill: "#4a6076", "text-anchor": "middle" }, "← 先選一個物體"));
    }
  }

  function runFloat() {
    if (!floatMat || floatBusy) return;
    floatBusy = true;
    const floats = floatMat.d < 1.0;
    // 目標：塊底 y。浮 → 沉入深度 = 密度比例 × 塊高；沉 → 到槽底
    const targetBottomY = floats ? WATER_Y + BLOCK * floatMat.d : TANK_BOTTOM - 4;
    const startY = 60;
    const dur = reduceMotion ? 1 : 1500;
    const t0 = performance.now();
    function frame(now) {
      let p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const y = startY + (targetBottomY - startY) * ease;
      blockG.setAttribute("transform", "translate(170, " + y + ")");
      if (p >= 1) {
        floatBusy = false;
        const correct = (prediction === "float") === floats;
        floatFeedback.className = "feedback show " + (correct ? "good" : "bad");
        floatFeedback.innerHTML = (correct ? "✅ 預測正確！" : "❌ 和你預測的不一樣～") +
          floatMat.name + "的密度 " + floatMat.d.toFixed(2) + " g/cm³ " +
          (floats
            ? "< 水的 1.00 g/cm³，所以<strong>浮</strong>在水面（約 " + Math.round(floatMat.d * 100) + "% 體積沉在水下）。"
            : "> 水的 1.00 g/cm³，所以<strong>沉</strong>到底。");
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.getElementById("predictFloatBtn").addEventListener("click", function () {
    if (!floatMat) { floatFeedback.className = "feedback show bad"; floatFeedback.textContent = "先選一個物體再預測喔！"; return; }
    prediction = "float"; runFloat();
  });
  document.getElementById("predictSinkBtn").addEventListener("click", function () {
    if (!floatMat) { floatFeedback.className = "feedback show bad"; floatFeedback.textContent = "先選一個物體再預測喔！"; return; }
    prediction = "sink"; runFloat();
  });
  document.getElementById("floatResetBtn").addEventListener("click", function () {
    if (floatBusy) return;
    prediction = null;
    floatFeedback.className = "feedback";
    floatFeedback.textContent = "";
    drawTank(true);
  });

  drawTank(false);
})();
