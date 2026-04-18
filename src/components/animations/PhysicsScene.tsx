"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const Canvas3D = dynamic(
  () => import("./Canvas3D").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-full h-96 bg-gray-800 rounded-lg animate-pulse" />,
  }
);

interface PhysicsSceneProps {
  type?: "containers" | "cluster" | "flow";
  height?: string;
  className?: string;
}

export default function PhysicsScene({
  type = "containers",
  height = "h-96",
  className = "",
}: PhysicsSceneProps) {
  return (
    <Suspense
      fallback={<div className={`${height} bg-gray-800 rounded-lg animate-pulse`} />}
    >
      <div className={`relative w-full ${height} rounded-lg overflow-hidden border border-gray-800/50 bg-gradient-to-b from-gray-900 to-gray-800 ${className}`}>
        <Canvas3D type={type} />
      </div>
    </Suspense>
  );
}
