import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Opening WebGL moment (desktop only, mounted by App).
 * Phase 1 (0–1.6s): an abstract "LD" badge forms in — scales up + settles rotation.
 * Phase 2: architectural blocks drift in and float around it.
 * Phase 3 (~4.2s): the overlay fades; at ~5s onDone() hands control back to the site.
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
      <RoundedBox args={[0.26, 1.4, 0.26]} radius={0.05} smoothness={4} position={[-0.75, 0, 0]}>
        <meshStandardMaterial color="#f4f4f2" />
      </RoundedBox>
      <RoundedBox args={[0.85, 0.26, 0.26]} radius={0.05} smoothness={4} position={[-0.5, -0.7, 0]}>
        <meshStandardMaterial color="#f4f4f2" />
      </RoundedBox>
      {/* D */}
      <RoundedBox args={[0.26, 1.4, 0.26]} radius={0.05} smoothness={4} position={[0.5, 0, 0]}>
        <meshStandardMaterial color="#f4f4f2" />
      </RoundedBox>
      <mesh position={[0.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.5, 0.18, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#f4f4f2" />
      </mesh>
    </group>
  );
}

function Blocks() {
  const data = useRef(
    Array.from({ length: 14 }, () => ({
      pos: [
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4 - 1,
      ] as [number, number, number],
      size: [
        0.4 + Math.random() * 0.7,
        0.4 + Math.random() * 0.7,
        0.4 + Math.random() * 0.7,
      ] as [number, number, number],
      rot: Math.random() * Math.PI,
      accent: Math.random() > 0.72,
    })),
  ).current;

  return (
    <>
      {data.map((b, i) => (
        <Float key={i} speed={1.2 + Math.random()} rotationIntensity={0.8} floatIntensity={1.1}>
          <RoundedBox args={b.size} radius={0.04} smoothness={3} position={b.pos} rotation={[b.rot, b.rot, 0]}>
            <meshStandardMaterial
              color={b.accent ? '#E8B04B' : '#cdd6dc'}
              roughness={0.6}
              metalness={0.1}
            />
          </RoundedBox>
        </Float>
      ))}
    </>
  );
}

export default function Intro3D({ onDone }: { onDone: () => void }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHide(true), 4200);
    const t2 = setTimeout(() => onDone(), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#051A24] transition-opacity duration-700 ${
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
    </div>
  );
}
