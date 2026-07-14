/* 闖關大挑戰：逐題作答、即時回饋、成績與學習建議 */
(function () {
  "use strict";
  const DATA = window.QUIZ_DATA;
  const body = document.getElementById("quizBody");
  const progressText = document.getElementById("quizProgress");
  const barFill = document.getElementById("quizBarFill");
  let idx = 0, score = 0, answered = false;

  function shuffleOptions(q) {
    const order = q.opts.map(function (_, i) { return i; });
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }
    return order;
  }

  function updateProgress() {
    progressText.textContent = "第 " + Math.min(idx + 1, DATA.length) + " 關 / 共 " + DATA.length + " 關｜目前得分：" + score;
    barFill.style.width = (idx / DATA.length * 100) + "%";
  }

  function renderQuestion() {
    answered = false;
    updateProgress();
    const q = DATA[idx];
    const order = shuffleOptions(q);
    body.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "quiz-question fade-in";
    const h = document.createElement("h3");
    h.textContent = "第 " + (idx + 1) + " 關：" + q.q;
    wrap.appendChild(h);
    order.forEach(function (optIdx) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = q.opts[optIdx];
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        const correct = optIdx === q.ans;
        if (correct) score++;
        Array.prototype.forEach.call(wrap.querySelectorAll(".option-btn"), function (b) {
          b.disabled = true;
          if (b.textContent === q.opts[q.ans]) b.classList.add("correct");
        });
        if (!correct) btn.classList.add("wrong");
        const fb = document.createElement("div");
        fb.className = "feedback show " + (correct ? "good" : "bad");
        fb.setAttribute("role", "status");
        fb.innerHTML = (correct ? "✅ 答對了！" : "❌ 答錯了～") + q.why +
          ' <a class="back-link" href="' + q.back.file + '">' + q.back.label + " →</a>";
        wrap.appendChild(fb);
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "btn";
        nextBtn.style.marginTop = "12px";
        nextBtn.textContent = idx + 1 < DATA.length ? "下一關 →" : "看成績 🏁";
        nextBtn.addEventListener("click", function () {
          idx++;
          if (idx < DATA.length) renderQuestion();
          else renderResult();
        });
        wrap.appendChild(nextBtn);
        nextBtn.focus();
        updateProgress();
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
  }

  function renderResult() {
    barFill.style.width = "100%";
    progressText.textContent = "挑戰完成！";
    // 更新最佳成績
    const p = window.BMSC.loadProgress();
    if (p.quizBest === null || p.quizBest === undefined || score > p.quizBest) {
      p.quizBest = score;
      window.BMSC.saveProgress(p);
    }
    let msg, advice;
    if (score === 10) {
      msg = "🎉 滿分！頒發「首席研究員」實驗室通行證！";
      advice = "你已經完全掌握基本測量的概念，到「自主學習」挑戰 PhET 密度模擬吧！";
    } else if (score >= 8) {
      msg = "🥇 太棒了，通過考核，實驗室通行證到手！";
      advice = "只差一點點就滿分，回頭看看答錯那幾題的解說，弄懂再挑戰一次！";
    } else if (score >= 6) {
      msg = "🥈 不錯的成績，再加把勁！";
      advice = "建議回「基本測量」和「密度與圖表」把互動實驗再玩一次，特別注意估計值與斜率的意義。";
    } else {
      msg = "💪 沒關係，科學家都是從錯誤中學習的！";
      advice = "先回「基本測量」重新練習直尺與量筒讀數，再到「誤差與有效數字」複習規則，然後再來挑戰！";
    }
    body.innerHTML = "";
    const div = document.createElement("div");
    div.className = "fade-in";
    div.innerHTML =
      '<p class="quiz-score">' + msg + "</p>" +
      '<p class="quiz-score">得分：' + score + " / " + DATA.length + "</p>" +
      '<div class="hint">📚 學習建議：' + advice + "</div>";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn accent";
    retry.textContent = "🔄 重新挑戰";
    retry.addEventListener("click", function () {
      idx = 0; score = 0;
      renderQuestion();
    });
    const row = document.createElement("div");
    row.className = "btn-row";
    row.style.justifyContent = "center";
    row.appendChild(retry);
    div.appendChild(row);
    body.appendChild(div);
  }

  renderQuestion();
})();
