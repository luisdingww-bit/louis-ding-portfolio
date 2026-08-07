import React from 'react';

/**
 * Hand-drawn SVG landmark illustrations — "semi-realistic with light/shadow".
 * Each is a self-contained <svg> on a 600x420 canvas (horizon ~y=350).
 * Style: vector silhouettes with a lit face + shadow face, soft gradient
 * backdrop and a ground shadow, restrained teal/amber palette.
 * These replace the old 3D GLB models in the opening HUD.
 */

const VIEW_W = 600;
const VIEW_H = 420;

function Backdrop({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c3040" />
          <stop offset="0.62" stopColor="#08222e" />
          <stop offset="1" stopColor="#051A24" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="0.68" cy="0.20" r="0.8">
          <stop offset="0" stopColor="#E8B04B" stopOpacity="0.26" />
          <stop offset="1" stopColor="#E8B04B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`ground-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000000" stopOpacity="0.34" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={`url(#sky-${id})`} />
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={`url(#glow-${id})`} />
      <ellipse cx="300" cy="352" rx="248" ry="26" fill={`url(#ground-${id})`} />
    </>
  );
}

/* 1 · 故宫 Forbidden City — Beijing */
function ForbiddenCity() {
  const id = 'b1';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="故宫">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`stone-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6d8b4" /><stop offset="1" stopColor="#c2ad82" />
        </linearGradient>
        <linearGradient id={`wall-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c25047" /><stop offset="1" stopColor="#8c332c" />
        </linearGradient>
        <linearGradient id={`roof-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f8aa8" /><stop offset="1" stopColor="#20536b" />
        </linearGradient>
      </defs>
      {/* terraces */}
      <rect x="148" y="312" width="304" height="22" rx="2" fill={`url(#stone-${id})`} />
      <rect x="168" y="298" width="264" height="15" rx="2" fill={`url(#stone-${id})`} />
      {/* hall body */}
      <rect x="212" y="236" width="176" height="64" fill={`url(#wall-${id})`} />
      {[228, 250, 272, 350, 372].map((x) => (
        <rect key={x} x={x} y="240" width="3" height="56" fill="#ffffff" opacity="0.18" />
      ))}
      <rect x="288" y="262" width="24" height="38" rx="11" fill="#5e201c" />
      {/* lower roof (重檐) */}
      <path d="M176,238 L208,212 L300,208 L392,212 L424,238 L405,238 L378,221 L300,218 L222,221 L195,238 Z" fill={`url(#roof-${id})`} />
      <rect x="200" y="206" width="200" height="4" fill="#9fd0e0" opacity="0.7" />
      {/* upper roof */}
      <path d="M232,212 L258,184 L300,181 L342,184 L368,212 L352,212 L330,191 L300,189 L270,191 L248,212 Z" fill={`url(#roof-${id})`} />
      <rect x="256" y="183" width="88" height="3" fill="#9fd0e0" opacity="0.7" />
      <rect x="297" y="168" width="6" height="14" fill="#caa24a" />
    </svg>
  );
}

/* 2 · 天坛 Temple of Heaven — Beijing */
function TempleOfHeaven() {
  const id = 'b2';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="天坛">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`stone-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6d8b4" /><stop offset="1" stopColor="#bfa97e" />
        </linearGradient>
        <linearGradient id={`body-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e7d3a8" /><stop offset="1" stopColor="#b89a68" />
        </linearGradient>
        <linearGradient id={`roof-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a93b4" /><stop offset="1" stopColor="#235a73" />
        </linearGradient>
      </defs>
      <rect x="200" y="318" width="200" height="16" rx="8" fill={`url(#stone-${id})`} />
      <rect x="216" y="304" width="168" height="15" rx="7" fill={`url(#stone-${id})`} />
      <rect x="232" y="291" width="136" height="14" rx="6" fill={`url(#stone-${id})`} />
      <rect x="252" y="250" width="96" height="42" fill={`url(#body-${id})`} />
      {[266, 284, 300, 316, 334].map((x) => (
        <rect key={x} x={x} y="254" width="2" height="34" fill="#7c6233" opacity="0.5" />
      ))}
      <path d="M232,253 Q300,242 368,253 L300,216 Z" fill={`url(#roof-${id})`} />
      <path d="M248,234 Q300,226 352,234 L300,200 Z" fill={`url(#roof-${id})`} />
      <path d="M262,213 Q300,207 338,213 L300,182 Z" fill={`url(#roof-${id})`} />
      <circle cx="300" cy="178" r="4" fill="#caa24a" />
      <rect x="298" y="160" width="4" height="18" fill="#caa24a" />
    </svg>
  );
}

/* 3 · 中银大厦 Bank of China Tower — Hong Kong */
function BankOfChina() {
  const id = 'b3';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="中银大厦">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`steel-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#aebfc9" /><stop offset="1" stopColor="#5d7585" />
        </linearGradient>
      </defs>
      {/* main tapering body */}
      <polygon points="248,330 272,112 328,112 352,330" fill={`url(#steel-${id})`} />
      {/* split top prisms */}
      <polygon points="272,112 300,58 300,112" fill="#9fb1bd" />
      <polygon points="300,112 328,112 300,58" fill="#6f8794" />
      <rect x="298" y="30" width="4" height="30" fill="#cdd9e0" />
      {/* exposed truss diagonals */}
      <g stroke="#33505f" strokeWidth="2" opacity="0.65" fill="none">
        <line x1="248" y1="330" x2="300" y2="221" />
        <line x1="352" y1="330" x2="300" y2="221" />
        <line x1="272" y1="221" x2="328" y2="112" />
        <line x1="248" y1="276" x2="352" y2="276" />
        <line x1="260" y1="200" x2="340" y2="200" />
        <line x1="276" y1="160" x2="324" y2="160" />
      </g>
      {/* floor lines */}
      <g stroke="#e8f0f4" strokeWidth="1" opacity="0.35">
        <line x1="252" y1="300" x2="348" y2="300" />
        <line x1="258" y1="262" x2="342" y2="262" />
        <line x1="264" y1="224" x2="336" y2="224" />
      </g>
    </svg>
  );
}

/* 4 · 台北101 Taipei 101 — Taiwan, China */
function Taipei101() {
  const id = 'b4';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="台北101">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`steel-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b9c8d2" /><stop offset="1" stopColor="#637d8c" />
        </linearGradient>
      </defs>
      {/* podium */}
      <rect x="244" y="300" width="112" height="32" fill="#566f7d" />
      {/* stacked inverted-trapezoid segments */}
      <polygon points="252,302 348,302 340,266 260,266" fill={`url(#steel-${id})`} />
      <polygon points="262,268 338,268 331,234 269,234" fill={`url(#steel-${id})`} />
      <polygon points="271,236 329,236 323,204 277,204" fill={`url(#steel-${id})`} />
      <polygon points="279,206 321,206 316,176 284,176" fill={`url(#steel-${id})`} />
      <polygon points="286,178 314,178 310,150 290,150" fill={`url(#steel-${id})`} />
      <polygon points="292,152 308,152 305,126 295,126" fill={`url(#steel-${id})`} />
      {/* diamond crown */}
      <polygon points="300,124 312,108 300,92 288,108" fill="#9fb4c0" />
      {/* spire */}
      <rect x="298" y="58" width="4" height="34" fill="#cdd9e0" />
      <circle cx="300" cy="56" r="3" fill="#E8B04B" />
      {/* segment seams */}
      <g stroke="#33454f" strokeWidth="1.5" opacity="0.5">
        <line x1="260" y1="266" x2="340" y2="266" />
        <line x1="269" y1="234" x2="331" y2="234" />
        <line x1="277" y1="204" x2="323" y2="204" />
        <line x1="284" y1="176" x2="316" y2="176" />
        <line x1="290" y1="150" x2="310" y2="150" />
      </g>
    </svg>
  );
}

/* 5 · 帝国大厦 Empire State — New York */
function EmpireState() {
  const id = 'b5';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="帝国大厦">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`stone-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cdd6dc" /><stop offset="1" stopColor="#7d8e99" />
        </linearGradient>
      </defs>
      <rect x="232" y="300" width="136" height="32" fill={`url(#stone-${id})`} />
      <rect x="248" y="240" width="104" height="62" fill={`url(#stone-${id})`} />
      <rect x="262" y="190" width="76" height="52" fill={`url(#stone-${id})`} />
      <rect x="276" y="120" width="48" height="72" fill={`url(#stone-${id})`} />
      <rect x="293" y="74" width="14" height="48" fill="#9babb5" />
      <rect x="297" y="48" width="6" height="28" fill="#cdd9e0" />
      <g stroke="#33454f" strokeWidth="1" opacity="0.4">
        {[244, 256, 268, 332, 344, 356].map((x) => (
          <line key={x} x1={x} y1="302" x2={x} y2="330" />
        ))}
        {[254, 266, 334, 346].map((x) => (
          <line key={x} x1={x} y1="242" x2={x} y2="300" />
        ))}
        {[270, 282, 318, 330].map((x) => (
          <line key={x} x1={x} y1="192" x2={x} y2="240" />
        ))}
        {[282, 294, 306, 318].map((x) => (
          <line key={x} x1={x} y1="122" x2={x} y2="190" />
        ))}
      </g>
    </svg>
  );
}

/* 6 · 罗马斗兽场 Colosseum — Rome */
function Colosseum() {
  const id = 'b6';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="罗马斗兽场">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`stone-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3d3ad" /><stop offset="1" stopColor="#b29a6c" />
        </linearGradient>
      </defs>
      {/* outer ring (front arc only, broken on right) */}
      <path
        d="M150,300 A150,118 0 0 1 450,300 L450,300 L420,300 A120,92 0 0 0 180,300 Z"
        fill={`url(#stone-${id})`}
      />
      {/* arches row 1 */}
      <g fill="#7c6a44" opacity="0.85">
        {[170, 200, 230, 260, 290, 320, 350, 380, 410].map((x) => (
          <rect key={x} x={x} y="250" width="20" height="34" rx="9" />
        ))}
      </g>
      {/* arches row 2 */}
      <g fill="#6b5a38" opacity="0.8">
        {[185, 215, 245, 275, 305, 335, 365, 395].map((x) => (
          <rect key={x} x={x} y="214" width="18" height="30" rx="8" />
        ))}
      </g>
      {/* broken top-right ruin */}
      <path d="M412,196 L450,200 L450,300 L420,300 Z" fill="#9c875c" opacity="0.7" />
      <rect x="150" y="300" width="300" height="10" fill="#8a7448" />
    </svg>
  );
}

/* 7 · 埃菲尔铁塔 Eiffel Tower — Paris */
function EiffelTower() {
  const id = 'b7';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="埃菲尔铁塔">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`steel-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9aa9b3" /><stop offset="1" stopColor="#566873" />
        </linearGradient>
      </defs>
      {/* silhouette */}
      <polygon points="232,330 268,330 296,70 304,70 332,330 368,330 304,60 296,60" fill={`url(#steel-${id})`} />
      {/* base arch */}
      <path d="M250,330 Q300,250 350,330" fill="none" stroke="#3f515c" strokeWidth="5" />
      {/* platforms */}
      <rect x="258" y="250" width="84" height="7" fill="#445865" />
      <rect x="272" y="170" width="56" height="6" fill="#445865" />
      {/* lattice */}
      <g stroke="#2f3f49" strokeWidth="1.4" opacity="0.7" fill="none">
        <line x1="240" y1="320" x2="296" y2="240" />
        <line x1="360" y1="320" x2="304" y2="240" />
        <line x1="262" y1="244" x2="296" y2="176" />
        <line x1="338" y1="244" x2="304" y2="176" />
        <line x1="252" y1="330" x2="348" y2="330" />
        <line x1="276" y1="250" x2="324" y2="250" />
        <line x1="288" y1="174" x2="312" y2="174" />
      </g>
      {/* spire */}
      <rect x="298" y="40" width="4" height="22" fill="#cdd9e0" />
    </svg>
  );
}

/* 8 · 吉萨金字塔 Pyramids — Giza */
function Pyramids() {
  const id = 'b8';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="吉萨金字塔">
      <Backdrop id={id} />
      <defs>
        <radialGradient id={`sun-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f4d58a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f4d58a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`lit-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8c98a" /><stop offset="1" stopColor="#c89a55" />
        </linearGradient>
        <linearGradient id={`shd-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9854a" /><stop offset="1" stopColor="#7e562b" />
        </linearGradient>
      </defs>
      <circle cx="450" cy="110" r="70" fill={`url(#sun-${id})`} />
      <circle cx="450" cy="110" r="26" fill="#f6dd97" />
      {/* big pyramid */}
      <polygon points="200,330 320,160 320,330" fill={`url(#lit-${id})`} />
      <polygon points="320,160 440,330 320,330" fill={`url(#shd-${id})`} />
      {/* medium */}
      <polygon points="388,330 470,210 470,330" fill={`url(#lit-${id})`} />
      <polygon points="470,210 540,330 470,330" fill={`url(#shd-${id})`} />
      {/* small */}
      <polygon points="120,330 175,240 175,330" fill={`url(#lit-${id})`} />
      <polygon points="175,240 225,330 175,330" fill={`url(#shd-${id})`} />
      {/* sand line */}
      <rect x="0" y="328" width="600" height="6" fill="#caa466" opacity="0.5" />
    </svg>
  );
}

/* 9 · 悉尼歌剧院 Sydney Opera House */
function SydneyOperaHouse() {
  const id = 'b9';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="悉尼歌剧院">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`shell-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#c4d2da" />
        </linearGradient>
        <linearGradient id={`pod-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef2f4" /><stop offset="1" stopColor="#9fb0ba" />
        </linearGradient>
      </defs>
      {/* podium */}
      <path d="M150,330 L450,330 L470,352 L130,352 Z" fill={`url(#pod-${id})`} />
      {/* shells */}
      <path d="M210,330 Q235,210 300,330 Z" fill={`url(#shell-${id})`} />
      <path d="M250,330 Q285,180 350,330 Z" fill={`url(#shell-${id})`} />
      <path d="M300,330 Q340,200 405,330 Z" fill={`url(#shell-${id})`} />
      <path d="M180,330 Q205,250 255,330 Z" fill={`url(#shell-${id})`} />
      <path d="M345,330 Q380,235 430,330 Z" fill={`url(#shell-${id})`} />
      {/* shell shadow edges */}
      <g stroke="#aebec8" strokeWidth="1.4" opacity="0.7" fill="none">
        <path d="M210,330 Q235,210 300,330" />
        <path d="M250,330 Q285,180 350,330" />
        <path d="M300,330 Q340,200 405,330" />
        <path d="M180,330 Q205,250 255,330" />
        <path d="M345,330 Q380,235 430,330" />
      </g>
    </svg>
  );
}

/* 10 · 泰姬陵 Taj Mahal — Agra */
function TajMahal() {
  const id = 'b10';
  return (
    <svg viewBox="0 0 600 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="泰姬陵">
      <Backdrop id={id} />
      <defs>
        <linearGradient id={`marble-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#c9d4da" />
        </linearGradient>
        <radialGradient id={`dome-${id}`} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#bcc8cf" />
        </radialGradient>
      </defs>
      {/* platform */}
      <rect x="170" y="312" width="260" height="18" fill="#d6dee2" />
      {/* minarets */}
      {[196, 404].map((x) => (
        <g key={x}>
          <rect x={x - 7} y="232" width="14" height="82" fill={`url(#marble-${id})`} />
          <path d={`M${x - 9},232 Q${x},212 ${x + 9},232 Z`} fill="#cdd6db" />
          <rect x={x - 2} y="206" width="4" height="10" fill="#cdd6db" />
        </g>
      ))}
      {/* main hall */}
      <rect x="248" y="246" width="104" height="68" fill={`url(#marble-${id})`} />
      <path d="M280,246 Q300,206 320,246 Z" fill="#cdd6db" />
      {/* iwan (central arch) */}
      <path d="M286,314 L286,280 Q300,262 314,280 L314,314 Z" fill="#8b99a1" />
      {/* main onion dome */}
      <path d="M252,250 Q252,150 300,132 Q348,150 348,250 Z" fill={`url(#dome-${id})`} />
      <rect x="294" y="120" width="12" height="14" fill="#cdd6db" />
      <path d="M296,120 Q300,96 304,120 Z" fill="#cdd6db" />
      <rect x="299" y="84" width="2" height="16" fill="#E8B04B" />
    </svg>
  );
}

export type Landmark = {
  id: string;
  name: string;
  en: string;
  location: string;
  lat: string;
  lon: string;
  Illustration: React.FC;
};

export const LANDMARKS: Landmark[] = [
  { id: 'forbidden', name: '故宫', en: 'Forbidden City', location: '北京 · Beijing', lat: '39.916', lon: '116.397', Illustration: ForbiddenCity },
  { id: 'tiantan', name: '天坛', en: 'Temple of Heaven', location: '北京 · Beijing', lat: '39.882', lon: '116.406', Illustration: TempleOfHeaven },
  { id: 'boc', name: '中银大厦', en: 'Bank of China Tower', location: '香港 · Hong Kong', lat: '22.279', lon: '114.161', Illustration: BankOfChina },
  { id: 'taipei101', name: '台北101', en: 'Taipei 101', location: '中国台湾 · Taipei', lat: '25.034', lon: '121.564', Illustration: Taipei101 },
  { id: 'empire', name: '帝国大厦', en: 'Empire State', location: '纽约 · New York', lat: '40.748', lon: '-73.986', Illustration: EmpireState },
  { id: 'colosseum', name: '罗马斗兽场', en: 'Colosseum', location: '罗马 · Rome', lat: '41.890', lon: '12.492', Illustration: Colosseum },
  { id: 'eiffel', name: '埃菲尔铁塔', en: 'Eiffel Tower', location: '巴黎 · Paris', lat: '48.858', lon: '2.294', Illustration: EiffelTower },
  { id: 'pyramids', name: '吉萨金字塔', en: 'Pyramids of Giza', location: '吉萨 · Giza', lat: '29.979', lon: '31.134', Illustration: Pyramids },
  { id: 'sydney', name: '悉尼歌剧院', en: 'Sydney Opera House', location: '悉尼 · Sydney', lat: '-33.857', lon: '151.215', Illustration: SydneyOperaHouse },
  { id: 'taj', name: '泰姬陵', en: 'Taj Mahal', location: '阿格拉 · Agra', lat: '27.175', lon: '78.042', Illustration: TajMahal },
];
