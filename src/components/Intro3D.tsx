import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Opening WebGL moment (desktop only, mounted by App).
 * Theme: "Architecture × AI × Digital Fabrication".
 *
 * Behaves as a looping SHOWCASE of history's most iconic buildings:
 *  - a drifting AI particle cloud (Points + round sprite, additive glow)
 *  - voxel blocks RAPIDLY assemble one famous building, hold a beat,
 *    then switch to the next (pyramid → Eiffel → skyscraper → temple →
 *    colosseum), forever — the "digital fabrication" metaphor.
 *  - a static ground grid + the structured massing read as architecture.
 *  - the current building's name is captioned.
 * The overlay STAYS until the visitor clicks anywhere to ENTER the site.
 *
 * Built with plain three.js primitives (NO drei). App-level ErrorBoundary
 * + WebGL capability check guarantee the page can never blank-screen.
 */

const BH = 1.0; // block height
const YOFF = -3.0; // shifts the tower so it sits centered on the camera
const ASSEMBLE_DUR = 1.15; // seconds per block
const FLOOR_STAGGER = 0.16; // bottom-up fabrication delay per floor unit
const SPACING = 1.15;
const CYCLE_MS = 2300; // assemble (~1.15s) + brief hold, then switch

interface Target {
  target: [number, number, number];
  accent: boolean;
}

/* ---- iconic building massing generators (blocky voxel silhouettes) ---- */

function genPyramid(): Target[] {
  const out: Target[] = [];
  const layers = 4; // 4x4 → 1x1 stepped pyramid
  for (let L = 0; L < layers; L++) {
    const side = layers - L;
    const half = (side - 1) / 2;
    for (let x = -half; x <= half; x++)
      for (let z = -half; z <= half; z++)
        out.push({ target: [x * SPACING, L * BH + YOFF, z * SPACING], accent: L === layers - 1 });
  }
  return out;
}

function genEiffel(): Target[] {
  const out: Target[] = [];
  const floors = 11;
  for (let f = 0; f < floors; f++) {
    const a = Math.max(0.45, 1.7 - f * 0.135);
    const corners: [number, number][] = [
      [a, a],
      [a, -a],
      [-a, a],
      [-a, -a],
    ];
    for (const [x, z] of corners) out.push({ target: [x * SPACING, f * 0.55 + YOFF, z * SPACING], accent: false });
    // lattice cross-braces on the lower section
    if (f < 4) {
      out.push({ target: [0, f * 0.55 + YOFF, a * SPACING], accent: false });
      out.push({ target: [a * SPACING, f * 0.55 + YOFF, 0], accent: false });
      out.push({ target: [0, f * 0.55 + YOFF, -a * SPACING], accent: false });
      out.push({ target: [-a * SPACING, f * 0.55 + YOFF, 0], accent: false });
    }
  }
  out.push({ target: [0, floors * 0.55 + YOFF, 0], accent: true }); // spire
  return out;
}

function genSkyscraper(): Target[] {
  const out: Target[] = [];
  const floors = 7; // tapers to a 1x1 crown
  for (let f = 0; f < floors; f++) {
    const footprint = f < floors - 1 ? 2 : 1;
    const half = footprint - 1;
    for (let x = -half; x <= half; x++)
      for (let z = -half; z <= half; z++)
        out.push({ target: [x * SPACING, f * BH + YOFF, z * SPACING], accent: f === floors - 1 });
  }
  return out;
}

function genTemple(): Target[] {
  const out: Target[] = [];
  const cols = [-1, 0, 1];
  const floors = 3;
  for (let f = 0; f < floors; f++)
    for (const x of cols)
      for (const z of cols) {
        const edge = x !== 0 || z !== 0;
        if (edge) out.push({ target: [x * SPACING, f * BH + YOFF, z * SPACING], accent: false });
      }
  out.push({ target: [0, floors * BH + YOFF, 0], accent: true }); // pediment peak
  return out;
}

function genColosseum(): Target[] {
  const out: Target[] = [];
  const rings = 3;
  const N = 16;
  for (let f = 0; f < rings; f++)
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2;
      out.push({
        target: [Math.cos(ang) * 2.2 * SPACING * 0.5, f * BH + YOFF, Math.sin(ang) * 1.5 * SPACING * 0.5],
        accent: false,
      });
    }
  return out;
}

const BUILDINGS: { name: string; gen: () => Target[] }[] = [
  { name: 'Pyramid of Giza · 吉萨金字塔', gen: genPyramid },
  { name: 'Eiffel Tower · 埃菲尔铁塔', gen: genEiffel },
  { name: 'Empire State · 帝国大厦', gen: genSkyscraper },
  { name: 'Parthenon · 帕特农神庙', gen: genTemple },
  { name: 'Colosseum · 罗马斗兽场', gen: genColosseum },
];

function Block({ target, accent }: { target: [number, number, number]; accent: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const start = useMemo<[number, number, number]>(() => {
    const r = 4 + Math.random() * 4;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    return [r * Math.sin(ph) * Math.cos(th), Math.random() * 8 - 3, r * Math.sin(ph) * Math.sin(th)];
  }, []);
  const delay = useMemo(() => Math.max(0, (target[1] - YOFF) / BH) * FLOOR_STAGGER, [target]);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const p = Math.min(Math.max((t - delay) / ASSEMBLE_DUR, 0), 1);
    const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
    m.position.set(
      start[0] + (target[0] - start[0]) * e,
      start[1] + (target[1] - start[1]) * e,
      start[2] + (target[2] - start[2]) * e,
    );
    m.scale.setScalar(0.04 + 0.96 * e);
    if (p >= 1) m.position.y = target[1] + Math.sin(t * 0.8 + delay * 3) * 0.05;
  });
  return (
    <mesh ref={ref} position={start}>
      <boxGeometry args={[0.92, 0.92, 0.92]} />
      <meshStandardMaterial
        color={accent ? '#E8B04B' : '#dfe6ea'}
        roughness={0.55}
        metalness={0.05}
        emissive={accent ? '#3a2606' : '#0a1419'}
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

function makeCircleTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const N = 900;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const cA = new THREE.Color('#E8B04B');
    const cB = new THREE.Color('#cfe3ef');
    for (let i = 0; i < N; i++) {
      const r = 3 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = Math.random() * 8 - 3;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      const c = Math.random() > 0.7 ? cA : cB;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);
  const tex = useMemo(() => makeCircleTexture(), []);
  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y = state.clock.elapsedTime * 0.05;
    p.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03);
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        map={tex}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ buildingIndex }: { buildingIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const targets = useMemo(() => BUILDINGS[buildingIndex].gen(), [buildingIndex]);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = state.clock.elapsedTime * 0.12; // slow turntable orbit
  });
  return (
    <group ref={group}>
      <Particles />
      {/* key forces a fresh assemble animation each time the building switches */}
      <Blocks key={buildingIndex} targets={targets} />
    </group>
  );
}

function Blocks({ targets }: { targets: Target[] }) {
  return (
    <>
      {targets.map((b, i) => (
        <Block key={i} target={b.target} accent={b.accent} />
      ))}
    </>
  );
}

export default function Intro3D({ onDone }: { onDone: () => void }) {
  const [hide, setHide] = useState(false);
  const [buildingIndex, setBuildingIndex] = useState(0);
  const [titleIn, setTitleIn] = useState(false);

  useEffect(() => {
    // Guard: if WebGL is unavailable, skip the intro entirely (no crash).
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) {
        onDone();
        return;
      }
    } catch {
      onDone();
      return;
    }
    setTitleIn(true);
    // Loop the building showcase; the page stays until the user clicks to enter.
    const id = window.setInterval(() => {
      setBuildingIndex((i) => (i + 1) % BUILDINGS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [onDone]);

  const enter = () => {
    setHide(true);
    window.setTimeout(onDone, 450);
  };

  return (
    <div
      onClick={enter}
      className={`fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center bg-[#051A24] transition-opacity duration-700 ${
        hide ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <style>{`@keyframes introFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <Canvas camera={{ position: [0, 0.5, 11], fov: 42 }} dpr={[1, 2]}>
        <fog attach="fog" args={['#051A24', 9, 22]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#E8B04B" />
        <Scene buildingIndex={buildingIndex} />
        <gridHelper args={[18, 18, '#1d4254', '#0e2433']} position={[0, YOFF - 0.05, 0]} />
      </Canvas>

      {/* Theme title */}
      <span
        className={`pointer-events-none absolute top-[12%] left-1/2 -translate-x-1/2 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-[#E8B04B] transition-opacity duration-1000 sm:text-xs ${
          titleIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Architecture × AI × Digital Fabrication
      </span>

      {/* Current building name — fades in on each switch */}
      <span
        key={buildingIndex}
        className="pointer-events-none absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center text-base font-medium tracking-wide text-white/90 sm:text-lg"
        style={{ animation: 'introFade .6s ease both' }}
      >
        {BUILDINGS[buildingIndex].name}
      </span>

      {/* Click to enter */}
      <span className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em] text-white/60">
        点击任意位置进入 · Click to enter
      </span>
    </div>
  );
}
