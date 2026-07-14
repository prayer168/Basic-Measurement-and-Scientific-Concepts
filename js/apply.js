/* 生活應用卡片渲染 */
(function () {
  "use strict";

  const CASES = [
    {
      anim: "fuel", title: "⛽ 加油站的「公升」",
      desc: "加油機一邊出油、一邊即時計量，顯示幕上跳動的數字就是加了幾「公升」的油。",
      principle: "對應原理：體積的測量與單位（1 L = 1000 mL = 1000 cm³）。",
      think: "想一想：為什麼加油要用「體積」計價，而不是用「質量」呢？"
    },
    {
      anim: "balloon", title: "🎈 熱氣球為什麼會飛？",
      desc: "燃燒器把球皮內的空氣加熱，空氣受熱膨脹、變「稀」，同樣體積的質量變小。",
      principle: "對應原理：熱空氣密度小於外面的冷空氣，所以整顆氣球浮起來。",
      think: "想一想：熱氣球想下降時，駕駛員該怎麼做？"
    },
    {
      anim: "deadsea", title: "🌊 死海讓你自然漂浮",
      desc: "死海的含鹽量約為一般海水的十倍，湖水密度高達約 1.24 g/cm³，人一躺上去就浮起來，還能邊漂邊看書！",
      principle: "對應原理：液體密度＞人體平均密度（約 0.98 g/cm³），人自然上浮。",
      think: "想一想：在游泳池仰漂比較難，是因為淡水的密度和人體差多少？"
    },
    {
      anim: "crown", title: "👑 王冠是純金的嗎？",
      desc: "兩千多年前，阿基米德把王冠沉入水中，用「排水法」量出它的體積，再配合質量算出密度，成功揭穿工匠摻銀作假！",
      principle: "對應原理：排水法測不規則物體體積；密度是物質的特性（純金 19.3 g/cm³）。",
      think: "想一想：若王冠質量 965 g、排開水 60 cm³，它是純金的嗎？"
    },
    {
      anim: "baking", title: "🧁 烘焙的量杯與量匙",
      desc: "食譜寫「麵粉 150 mL」，就要把麵粉裝到量杯刻度線，再用刮刀刮平表面——多一匙少一匙，蛋糕口感就不一樣！",
      principle: "對應原理：體積測量要平視刻度線，讀數才準確。",
      think: "想一想：同樣 150 mL 的麵粉和水，質量一樣嗎？為什麼？"
    },
    {
      anim: "marathon", title: "🏃 馬拉松的計時晶片",
      desc: "選手鞋帶上綁著感應晶片，通過起點與終點地墊的瞬間自動記錄，成績可以精確到 0.01 秒。",
      principle: "對應原理：時間的測量與精密度——工具愈精密，能分辨的時間差愈小。",
      think: "想一想：如果用人工按碼錶幫上千位選手計時，會產生哪種誤差？"
    }
  ];

  const grid = document.getElementById("applyGrid");
  CASES.forEach(function (c) {
    const card = document.createElement("article");
    card.className = "apply-card";
    card.innerHTML =
      "<h3>" + c.title + "</h3>" +
      '<div class="svg-stage">' + (window.APPLY_ANIMS[c.anim] || "") + "</div>" +
      "<p>" + c.desc + "</p>" +
      '<p class="principle">🔗 ' + c.principle + "</p>" +
      '<p class="think">💭 ' + c.think + "</p>";
    grid.appendChild(card);
  });
})();
