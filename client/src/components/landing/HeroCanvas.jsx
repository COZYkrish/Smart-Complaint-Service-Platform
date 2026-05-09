import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

function OrbCore() {
  const meshRef = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Breathing animation
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.04);
    // Mouse parallax on the orb
    meshRef.current.rotation.y = mouse.x * 0.3 + t * 0.05;
    meshRef.current.rotation.x = mouse.y * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[1.8, 128, 128]}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.35}
          speed={2.5}
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.85}
          envMapIntensity={2}
        />
      </Sphere>
    </mesh>
  );
}

function InnerGlow() {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.scale.setScalar(1.15 + Math.sin(t * 0.6) * 0.06);
    meshRef.current.material.opacity = 0.12 + Math.sin(t * 1.2) * 0.04;
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[1.82, 32, 32]}>
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </Sphere>
    </mesh>
  );
}

function OuterRing() {
  const ringRef = useRef();
  useFrame((state) => {
    ringRef.current.rotation.x = 1.2 + state.clock.elapsedTime * 0.1;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.5, 0.012, 16, 200]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
    </mesh>
  );
}

function OuterRing2() {
  const ringRef = useRef();
  useFrame((state) => {
    ringRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    ringRef.current.rotation.x = 0.5;
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[3.2, 0.008, 16, 200]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.15} />
    </mesh>
  );
}

function ParticleField() {
  const count = 180;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.5 + Math.random() * 3;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const pointsRef = useRef();
  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a855f7"
        size={0.025}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const { camera } = useThree();

  useFrame((state) => {
    // Camera subtle sway
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <Stars radius={80} depth={50} count={2000} factor={3} saturation={0.3} fade speed={0.5} />
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#6366f1" />
      <pointLight position={[-5, -3, -5]} intensity={2} color="#a855f7" />
      <pointLight position={[0, 0, 6]} intensity={1.5} color="#06b6d4" />
      <Float floatIntensity={0.3} rotationIntensity={0.2} speed={1.5}>
        <OrbCore />
        <InnerGlow />
      </Float>
      <OuterRing />
      <OuterRing2 />
      <ParticleField />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
