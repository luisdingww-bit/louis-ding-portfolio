import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Opening WebGL moment (desktop only, mounted by App).
 * Phase 1 (0–1.6s): an abstract "LD" badge forms in — scales up + settles rotation.
 * Phase 2: architectural blocks drift and float around it.
 * Phase 3 (~4.2s): the overlay fades; at ~5s onDone() hands control back to the site.
 *
 * Built with plain three.js primitives (NO drei) to keep the runtime failure
 * surface minimal. The App-level ErrorBoundary + the WebGL capability check
 * below guarantee the page can never blank-screen from a 3D failure.
 */

function LDBadge() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    const k = Math.min(t / 1.6, 1);
    const ease = 1 - Math.pow(1 - k, 3); // easeOutCubic
    g.scale.setScalar(0.6 + 0.4 * ease);
    g.rotation.y = (1 - ease) * 0.9;
    g.rotation.x = Math.sin(t * 0.4) * 0.05;
  });
  return (
    <group ref={group}>
      {/* L */}
      <mesh position={[-0.75, 0, 0]}>
        <boxGeometry args={[0.26, 1.4, 0.26]} />
        <meshStandardMaterial color="#f4f4f2" />
      </mesh>
      <mesh position={[-0.5, -0.7, 0]}>
        <boxGeometry args={[0.85, 0.26, 0.26]} />
        <meshStandardMaterial color="#f4f4f2" />
      </mesh>
      {/* D */}
      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[0.26, 1.4, 0.26]} />
        <meshStandardMaterial color="#f4f4f2" />
      </mesh>
      <mesh position={[0.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.5, 0.18, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#f4f4f2" />
      </mesh>
    </group>
  );
}

interface BlockData {
  pos: [number, number, number];
  size: [number, number, number];
  rot: number;
  accent: boolean;
}

function Block({ pos, size, rot, accent }: BlockData) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useRef(Math.random() * Math.PI * 2);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.position.y = pos[1] + Math.sin(t * 0.8 + phase.current) * 0.25;
    m.rotation.x = rot + t * 0.15;
    m.rotation.y = rot + t * 0.2;
  });
  return (
    <mesh ref={ref} position={pos} rotation={[rot, rot, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={accent ? '#E8B04B' : '#cdd6dc'}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

function Blocks() {
  const data = useRef<BlockData[]>(
    Array.from({ length: 14 }, () => ({
      pos: [
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4 - 1,
      ],
      size: [
        0.4 + Math.random() * 0.7,
        0.4 + Math.random() * 0.7,
        0.4 + Math.random() * 0.7,
      ],
      rot: Math.random() * Math.PI,
      accent: Math.random() > 0.72,
    })),
  ).current;

  return (
    <>
      {data.map((b, i) => (
        <Block key={i} {...b} />
      ))}
    </>
  );
}

export default function Intro3D({ onDone }: { onDone: () => void }) {
  const [hide, setHide] = useState(false);

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
    const t1 = setTimeout(() => setHide(true), 4200);
    const t2 = setTimeout(() => onDone(), 5000);
    return () => {
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
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 3]} intensity={1.1} />
        <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#E8B04B" />
        <LDBadge />
        <Blocks />
      </Canvas>
      {!hide && (
        <span className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em] text-white/60">
          点击任意位置跳过 · Click to skip
        </span>
      )}
    </div>
  );
}
