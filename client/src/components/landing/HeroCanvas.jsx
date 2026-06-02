import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Edges, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/* ── Central Distorted Sphere — very visible ─────────────── */
function GlowSphere({ scrollProgress = 0 }) {
  const meshRef = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.08 + mouse.x * 0.25;
    meshRef.current.rotation.x = mouse.y * 0.15;
    const s = (1 - scrollProgress * 0.3) * (1 + Math.sin(t * 0.7) * 0.025);
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[1.6, 128, 128]}>
        <MeshDistortMaterial
          color="#ffffff"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.0}
          transparent
          opacity={0.18}
          wireframe={false}
        />
      </Sphere>
    </mesh>
  );
}

/* ── Bright wireframe icosahedron shell ──────────────────── */
function WireframeShell({ scrollProgress = 0 }) {
  const ref = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.09 + mouse.y * 0.2;
    ref.current.rotation.y = t * 0.13 + mouse.x * 0.3;
    const s = (1 - scrollProgress * 0.35) * (1 + Math.sin(t * 0.9) * 0.02);
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.0, 1]} />
      <meshBasicMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

/* ── Secondary outer octahedron ─────────────────────────── */
function OuterOcta() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = -t * 0.04;
    ref.current.rotation.y =  t * 0.06;
    ref.current.rotation.z =  t * 0.02;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[3.0, 0]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

/* ── Pulsing torus rings ─────────────────────────────────── */
function OrbitRings({ scrollProgress = 0 }) {
  const r1 = useRef(), r2 = useRef(), r3 = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (r1.current) { r1.current.rotation.x = 1.2 + t * 0.14; r1.current.rotation.z = t * 0.06; }
    if (r2.current) { r2.current.rotation.y = t * 0.10; r2.current.rotation.x = 0.5 + t * 0.05; }
    if (r3.current) { r3.current.rotation.z = t * 0.08; r3.current.rotation.x = -0.3 + t * 0.04; }
  });
  return (
    <>
      <mesh ref={r1}>
        <torusGeometry args={[2.7, 0.012, 12, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[3.5, 0.008, 12, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[4.2, 0.005, 12, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </>
  );
}

/* ── Dense particle cloud ────────────────────────────────── */
function ParticleCloud({ count = 280 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3.8 + Math.random() * 3.5;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.04} transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Floating mini cubes ─────────────────────────────────── */
function FloatingCubes() {
  const data = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    pos: [(Math.random() - 0.5) * 9, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4],
    speed: 0.4 + Math.random() * 0.6,
    size: 0.07 + Math.random() * 0.14,
    offset: Math.random() * Math.PI * 2,
  })), []);

  const refs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      ref.rotation.x = t * data[i].speed;
      ref.rotation.y = t * data[i].speed * 0.7;
      ref.position.y = data[i].pos[1] + Math.sin(t * 0.5 + data[i].offset) * 0.6;
    });
  });

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={el => refs.current[i] = el} position={d.pos}>
          <boxGeometry args={[d.size, d.size, d.size]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.4} />
        </mesh>
      ))}
    </>
  );
}

/* ── Perspective grid plane ──────────────────────────────── */
function GridPlane() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.material.opacity = 0.10 + Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -6]}>
      <planeGeometry args={[40, 40, 24, 24]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.10} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Camera drift ────────────────────────────────────────── */
function Camera({ scrollProgress = 0 }) {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.12) * 0.5;
    camera.position.y = Math.cos(t * 0.09) * 0.3;
    camera.position.z = 7.5 + scrollProgress * 2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Exported canvas ─────────────────────────────────────── */
export default function HeroCanvas({ scrollProgress = 0 }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Camera scrollProgress={scrollProgress} />
        <Stars radius={90} depth={60} count={1800} factor={2.5} saturation={0} fade speed={0.4} />
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]}   intensity={3} color="#ffffff" />
        <pointLight position={[-5, -3, -5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[0, 4, 3]}   intensity={2} color="#ffffff" />

        {/* Core — float wrapper for organic movement */}
        <Float floatIntensity={0.3} rotationIntensity={0.1} speed={1.5}>
          <GlowSphere scrollProgress={scrollProgress} />
          <WireframeShell scrollProgress={scrollProgress} />
        </Float>

        <OuterOcta />
        <OrbitRings scrollProgress={scrollProgress} />
        <ParticleCloud count={280} />
        <FloatingCubes />
        <GridPlane />
      </Canvas>
    </div>
  );
}
