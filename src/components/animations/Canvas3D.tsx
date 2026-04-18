"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

interface Canvas3DProps {
  type?: "containers" | "cluster" | "flow";
}

function InteractiveContainer() {
  return (
    <RigidBody type="dynamic" position={[0, 1, 0]} mass={1.5}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1e40af"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
}

function FloatingContainer() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1} floatingRange={[1, 4]}>
      <mesh castShadow position={[2, 3, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

function FallingContainers() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* Ground */}
      <RigidBody type="fixed" position={[0, -5, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[20, 1]} rotation-x={0} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <CuboidCollider args={[10, 0.5, 10]} />
      </RigidBody>

      {/* Falling containers */}
      {Array.from({ length: 5 }).map((_, i) => (
        <RigidBody
          key={i}
          position={[
            (i % 3) * 3 - 3,
            5 + i * 2,
            Math.sin(i) * 2,
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
              emissive={i % 2 === 0 ? "#1e40af" : "#6d28d9"}
              emissiveIntensity={0.2}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <CuboidCollider args={[0.3, 0.3, 0.3]} />
        </RigidBody>
      ))}
    </Physics>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#06b6d4" />
    </>
  );
}

export default function Canvas3D({ type = "containers" }: Canvas3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Lights />
      <OrbitControls autoRotate autoRotateSpeed={4} />

      {type === "containers" && <FallingContainers />}
      {type === "cluster" && (
        <Physics gravity={[0, 0, 0]}>
          <InteractiveContainer />
          <FloatingContainer />
          {Array.from({ length: 4 }).map((_, i) => (
            <RigidBody
              key={i}
              position={[Math.sin(i) * 3, Math.cos(i) * 3, 0]}
              type="dynamic"
            >
              <mesh castShadow>
                <sphereGeometry args={[0.4]} />
                <meshStandardMaterial
                  color={["#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899"][i]}
                  emissive={["#1e40af", "#0891b2", "#6d28d9", "#be185d"][i]}
                  emissiveIntensity={0.3}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            </RigidBody>
          ))}
        </Physics>
      )}
      {type === "flow" && (
        <Physics>
          {Array.from({ length: 8 }).map((_, i) => (
            <RigidBody
              key={i}
              position={[i * 2 - 7, Math.sin(i) * 3, 0]}
              linearVelocity={[0.5, 0, 0]}
            >
              <mesh castShadow>
                <octahedronGeometry args={[0.35]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? "#3b82f6" : "#06b6d4"}
                  emissive={i % 2 === 0 ? "#1e40af" : "#0891b2"}
                  emissiveIntensity={0.4}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            </RigidBody>
          ))}
        </Physics>
      )}
    </Canvas>
  );
}
