/* 生活應用：每則情境專屬的會動 SVG（key → svg 字串對照表） */
(function () {
  "use strict";

  window.APPLY_ANIMS = {

    /* 加油站：以公升計量 */
    fuel: '<svg viewBox="0 0 320 210" role="img" aria-label="加油機動畫：油從油槍流入油箱，油量表以公升計量，油面持續上升">' +
      '<defs><clipPath id="clipFuelTank"><rect x="196" y="96" width="92" height="92" rx="6"/></clipPath></defs>' +
      '<rect x="24" y="40" width="90" height="148" rx="8" fill="#dc2626"/>' +
      '<rect x="36" y="54" width="66" height="34" rx="4" fill="#0b3954"/>' +
      '<text x="69" y="76" font-size="14" fill="#7fe3ff" text-anchor="middle" font-family="Consolas,monospace">32.5 L</text>' +
      '<text x="69" y="106" font-size="12" fill="#fff" text-anchor="middle">汽油 (公升)</text>' +
      '<rect x="24" y="188" width="90" height="10" fill="#475569"/>' +
      '<path d="M114 70 C 160 70 150 60 168 92" fill="none" stroke="#334155" stroke-width="6" stroke-linecap="round"/>' +
      '<line class="fuel-stream" x1="172" y1="96" x2="196" y2="118" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>' +
      '<rect x="196" y="96" width="92" height="92" rx="6" fill="#e2e8f0" stroke="#475569" stroke-width="3"/>' +
      '<g clip-path="url(#clipFuelTank)"><rect class="fuel-level" x="196" y="154" width="92" height="80" fill="#fbbf24"/></g>' +
      '<text x="242" y="204" font-size="12" fill="#4a6076" text-anchor="middle">油箱（剖面）</text>' +
      '<path d="M300 150 L300 120" stroke="#15803d" stroke-width="3" marker-end="none"/>' +
      '<polygon points="300,114 295,124 305,124" fill="#15803d"/>' +
      '<text x="304" y="170 " font-size="11" fill="#15803d" text-anchor="middle" transform="rotate(-90 304 150)">油面上升</text>' +
      '</svg>',

    /* 熱氣球：熱空氣密度小 */
    balloon: '<svg viewBox="0 0 320 210" role="img" aria-label="熱氣球動畫：燃燒器加熱球內空氣，熱空氣密度變小，氣球上升">' +
      '<rect x="0" y="196" width="320" height="14" fill="#86efac"/>' +
      '<g class="balloon-rising">' +
      '<path d="M160 20 C 110 20 92 62 100 92 C 106 116 138 128 146 140 L 174 140 C 182 128 214 116 220 92 C 228 62 210 20 160 20 Z" fill="#f97316" stroke="#c2410c" stroke-width="2.5"/>' +
      '<path d="M132 24 C 118 44 116 84 134 128" fill="none" stroke="#c2410c" stroke-width="1.5" opacity="0.6"/>' +
      '<path d="M188 24 C 202 44 204 84 186 128" fill="none" stroke="#c2410c" stroke-width="1.5" opacity="0.6"/>' +
      '<line x1="146" y1="140" x2="150" y2="162" stroke="#78350f" stroke-width="2"/>' +
      '<line x1="174" y1="140" x2="170" y2="162" stroke="#78350f" stroke-width="2"/>' +
      '<path class="balloon-flame" d="M160 148 C 154 156 155 162 160 164 C 165 162 166 156 160 148 Z" fill="#fbbf24" stroke="#d97706"/>' +
      '<rect x="148" y="162" width="24" height="18" rx="3" fill="#92400e"/>' +
      '</g>' +
      '<g stroke="#dc2626" stroke-width="2.5" fill="none">' +
      '<path class="heat-arrow" d="M255 150 q4 -8 0 -16 M251 140 l4 -8 4 8"/>' +
      '<path class="heat-arrow d2" d="M272 155 q4 -8 0 -16 M268 145 l4 -8 4 8"/>' +
      '<path class="heat-arrow d3" d="M289 150 q4 -8 0 -16 M285 140 l4 -8 4 8"/>' +
      '</g>' +
      '<text x="272" y="176" font-size="11" fill="#dc2626" text-anchor="middle">熱空氣上升</text>' +
      '<text x="272" y="190" font-size="11" fill="#4a6076" text-anchor="middle">密度變小！</text>' +
      '</svg>',

    /* 死海漂浮：鹽水密度大 */
    deadsea: '<svg viewBox="0 0 320 210" role="img" aria-label="死海漂浮動畫：人輕鬆仰躺浮在高密度鹽水面上，水面有波浪">' +
      '<rect x="0" y="0" width="320" height="100" fill="#e0f2fe"/>' +
      '<circle cx="278" cy="34" r="18" fill="#fde047"/>' +
      '<rect x="0" y="100" width="320" height="110" fill="#0ea5e9" opacity="0.75"/>' +
      '<path class="sea-wave" d="M-46 100 q 23 -8 46 0 t 46 0 t 46 0 t 46 0 t 46 0 t 46 0 t 46 0 t 46 0" fill="none" stroke="#0369a1" stroke-width="3"/>' +
      '<g class="floating-person">' +
      '<circle cx="106" cy="90" r="13" fill="#fcd7b6" stroke="#b45309" stroke-width="1.5"/>' +
      '<rect x="118" y="84" width="64" height="15" rx="7" fill="#ef4444"/>' +
      '<rect x="180" y="86" width="34" height="11" rx="5" fill="#1d4ed8"/>' +
      '<line x1="214" y1="91" x2="232" y2="88" stroke="#fcd7b6" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="128" y1="86" x2="140" y2="70" stroke="#fcd7b6" stroke-width="7" stroke-linecap="round"/>' +
      '<rect x="136" y="56" width="20" height="16" rx="2" fill="#fff" stroke="#475569"/>' +
      '</g>' +
      '<text x="160" y="146" font-size="12" fill="#fff" text-anchor="middle">死海鹽水密度約 1.24 g/cm³ ＞ 人體約 0.98 g/cm³</text>' +
      '<path d="M60 170 L60 140" stroke="#fef08a" stroke-width="3"/>' +
      '<polygon points="60,132 54,144 66,144" fill="#fef08a"/>' +
      '<text x="60" y="188" font-size="11" fill="#fef08a" text-anchor="middle">浮力足夠</text>' +
      '</svg>',

    /* 王冠排水法 */
    crown: '<svg viewBox="0 0 320 210" role="img" aria-label="阿基米德王冠動畫：王冠沉入量筒，水位上升，用排水法測體積辨別真假黃金">' +
      '<defs><clipPath id="clipCrownCyl"><rect x="120" y="24" width="90" height="170" rx="6"/></clipPath></defs>' +
      '<rect x="120" y="24" width="90" height="170" rx="6" fill="#f0f9ff" stroke="#0369a1" stroke-width="3"/>' +
      '<g clip-path="url(#clipCrownCyl)">' +
      '<rect class="crown-water" x="120" y="108" width="90" height="90" fill="#7dd3fc" opacity="0.8"/>' +
      '<g class="crown-dip">' +
      '<line x1="165" y1="-20" x2="165" y2="46" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>' +
      '<path d="M143 66 L143 46 L152 58 L165 40 L178 58 L187 46 L187 66 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>' +
      '<circle cx="150" cy="62" r="2.5" fill="#dc2626"/><circle cx="165" cy="62" r="2.5" fill="#16a34a"/><circle cx="180" cy="62" r="2.5" fill="#2563eb"/>' +
      '</g></g>' +
      '<g stroke="#0369a1" stroke-width="2">' +
      '<line x1="120" y1="60" x2="132" y2="60"/><line x1="120" y1="108" x2="132" y2="108"/><line x1="120" y1="156" x2="132" y2="156"/>' +
      '</g>' +
      '<path d="M236 120 L236 96" stroke="#15803d" stroke-width="3"/>' +
      '<polygon points="236,88 230,100 242,100" fill="#15803d"/>' +
      '<text x="262" y="112" font-size="12" fill="#15803d" text-anchor="middle">水位上升</text>' +
      '<text x="262" y="128" font-size="12" fill="#15803d" text-anchor="middle">＝王冠體積</text>' +
      '<text x="262" y="156" font-size="11" fill="#4a6076" text-anchor="middle">密度＝質量÷體積</text>' +
      '<text x="262" y="172" font-size="11" fill="#4a6076" text-anchor="middle">≠19.3 就摻假！</text>' +
      '</svg>',

    /* 烘焙量杯 */
    baking: '<svg viewBox="0 0 320 210" role="img" aria-label="烘焙量杯動畫：麵粉倒入量杯到刻度線，再用刮刀刮平表面">' +
      '<path d="M60 190 L74 70 L206 70 L220 190 Z" fill="#fff" stroke="#475569" stroke-width="3"/>' +
      '<g stroke="#64748b" stroke-width="2">' +
      '<line x1="78" y1="100" x2="98" y2="100"/><line x1="80" y1="130" x2="100" y2="130"/><line x1="83" y1="160" x2="103" y2="160"/>' +
      '</g>' +
      '<text x="112" y="104" font-size="11" fill="#64748b">250 mL</text>' +
      '<text x="114" y="134" font-size="11" fill="#64748b">150 mL</text>' +
      '<text x="117" y="164" font-size="11" fill="#64748b">50 mL</text>' +
      '<path d="M79 130 L82 186 L198 186 L201 130 Z" fill="#fde68a" stroke="#eab308" stroke-width="1.5"/>' +
      '<line class="flour-stream" x1="150" y1="30" x2="145" y2="122" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M118 24 L158 14 L162 30 L124 40 Z" fill="#fecaca" stroke="#b91c1c" stroke-width="2"/>' +
      '<g class="scraper">' +
      '<rect x="196" y="118" width="52" height="9" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>' +
      '<rect x="244" y="112" width="24" height="20" rx="4" fill="#78350f"/>' +
      '</g>' +
      '<path d="M262 168 L232 148" stroke="#dc2626" stroke-width="2.5"/>' +
      '<polygon points="226,144 238,146 231,156" fill="#dc2626"/>' +
      '<text x="268" y="184" font-size="11" fill="#dc2626" text-anchor="middle">刮平＋平視刻度</text>' +
      '<text x="268" y="198" font-size="11" fill="#dc2626" text-anchor="middle">體積才準確</text>' +
      '</svg>',

    /* 馬拉松計時晶片 */
    marathon: '<svg viewBox="0 0 320 210" role="img" aria-label="馬拉松計時動畫：跑者通過感應地墊，鞋上晶片發出訊號，時間精確到百分之一秒">' +
      '<rect x="0" y="176" width="320" height="12" fill="#9ca3af"/>' +
      '<rect x="200" y="170" width="84" height="18" rx="4" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>' +
      '<text x="242" y="204" font-size="11" fill="#4a6076" text-anchor="middle">終點感應地墊</text>' +
      '<rect x="40" y="20" width="130" height="34" rx="6" fill="#0b3954"/>' +
      '<text x="105" y="43" font-size="16" fill="#7fe3ff" text-anchor="middle" font-family="Consolas,monospace">1:23:45.67</text>' +
      '<text x="105" y="66" font-size="11" fill="#4a6076" text-anchor="middle">精確到 0.01 秒</text>' +
      '<g class="runner">' +
      '<circle cx="60" cy="102" r="11" fill="#fcd7b6" stroke="#b45309" stroke-width="1.5"/>' +
      '<line x1="60" y1="113" x2="56" y2="146" stroke="#1d4ed8" stroke-width="8" stroke-linecap="round"/>' +
      '<line x1="58" y1="122" x2="76" y2="112" stroke="#fcd7b6" stroke-width="6" stroke-linecap="round"/>' +
      '<line x1="58" y1="122" x2="42" y2="134" stroke="#fcd7b6" stroke-width="6" stroke-linecap="round"/>' +
      '<line x1="56" y1="146" x2="72" y2="162" stroke="#1d4ed8" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="56" y1="146" x2="40" y2="170" stroke="#1d4ed8" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="41" cy="172" r="5" fill="#dc2626"/>' +
      '<circle class="chip-signal" cx="41" cy="172" r="12" fill="none" stroke="#dc2626" stroke-width="2.5"/>' +
      '</g>' +
      '<text x="105" y="90" font-size="11" fill="#dc2626" text-anchor="middle">鞋上的晶片通過地墊 → 自動記錄時間</text>' +
      '</svg>'
  };
})();
