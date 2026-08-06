import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Opening WebGL moment (desktop only, mounted by App).
 * Theme: "Architecture × AI × Digital Fabrication".
 *
 * Three converging layers:
 *  1. AI  — a drifting particle data-cloud (Points + round sprite, additive glow).
 *  2. Fab — voxel blocks assemble BOTTOM-UP into a stepped architectural tower
 *          (3D-printing / layer-by-layer fabrication metaphor).
 *  3. Arch — a static ground grid + the structured massing read as a blueprint.
 *
 * A theme title card fades in near the end, then the whole overlay lifts.
 *
 * Built with plain three.js primitives (NO drei) to keep the runtime failure
 * surface minimal. The App-level ErrorBoundary + the WebGL capability check
 * below guarantee the page can never blank-screen from a 3D failure.
 */

const BH = 1.0; // block height
const YOFF = -3.0; // shifts the tower so it sits centered on the camera
const ASSEMBLE_DUR = 1.1; // seconds per block
const FLOOR_STAGGER = 0.22; // bottom-up fabrication delay per floor
const SPACING = 1.15;

interface BlockSpec {
  target: [number, number, number];
  start: [number, number, number];
  delay: number;
  accent: boolean;
}

function generateMassing(): BlockSpec[] {
  const out: BlockSpec[] = [];
  const cols = [-1, 0, 1];
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  for (let f = 0; f < 8; f++) {
    for (const x of cols) {
      for (const z of cols) {
        const corner = Math.abs(x) === 1 && Math.abs(z) === 1;
        // stepped setback: drop corners on mid floors, keep only center on top
        if (f >= 3 && f < 6 && corner) continue;
        if (f >= 6 && !(x === 0 && z === 0)) continue;
        const target: [number, number, number] = [x * SPACING, f * BH + YOFF, z * SPACING];
        // scattered start (in a loose sphere around the structure)
        const r = rand(4, 8);
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        const start: [number, number, number] = [
          r * Math.sin(ph) * Math.cos(th),
          rand(-3, 5),
          r * Math.sin(ph) * Math.sin(th),
        ];
        const accent = f === 7 || (f >= 4 && Math.random() < 0.18);
        out.push({ target, start, delay: f * FLOOR_STAGGER, accent });
      }
    }
  }
  return out;
}

function Block({ target, start, delay, accent }: BlockSpec) {
  const ref = useRef<THREE.Mesh>(null);
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
    // gentle float once settled
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

function Scene() {
  const group = useRef<THREE.Group>(null);
  const blocks = useMemo(() => generateMassing(), []);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = state.clock.elapsedTime * 0.12; // slow turntable orbit
  });
  return (
    <group ref={group}>
      <Particles />
      {blocks.map((b, i) => (
        <Block key={i} {...b} />
      ))}
    </group>
  );
}

export default function Intro3D({ onDone }: { onDone: () => void }) {
  const [hide, setHide] = useState(false);
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
    const t0 = setTimeout(() => setTitleIn(true), 2200);
    const t1 = setTimeout(() => setHide(true), 4300);
    const t2 = setTimeout(() => onDone(), 5000);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      onClick={() => {
        setHide(true);
        window.setTimeout(onDone, 320);
      }}
      className={`fixed inset-0 z-[10000] flex cursor-pointer items-center justify-center bg-[#051A24] transition-opacity duration-700 ${
        hide ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <Canvas camera={{ position: [0, 0.5, 11], fov: 42 }} dpr={[1, 2]}>
        <fog attach="fog" args={['#051A24', 9, 22]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#E8B04B" />
        <Scene />
        <gridHelper args={[18, 18, '#1d4254', '#0e2433']} position={[0, YOFF - 0.05, 0]} />
      </Canvas>

      {/* Theme title card — fades in near the end */}
      <span
        className={`pointer-events-none absolute bottom-[16%] left-1/2 -translate-x-1/2 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-[#E8B04B] transition-opacity duration-1000 sm:text-xs ${
          titleIn && !hide ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Architecture × AI × Digital Fabrication
      </span>

      {!hide && (
        <span className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em] text-white/60">
          点击任意位置跳过 · Click to skip
        </span>
      )}
    </div>
  );
}
