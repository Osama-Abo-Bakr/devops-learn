"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhysicsScene from "@/components/animations/PhysicsScene";

interface LessonWithVisualizerProps {
  title: string;
  description?: string;
  visualType?: "containers" | "cluster" | "flow";
  children?: React.ReactNode;
}

export default function LessonWithVisualizer({
  title,
  description,
  visualType = "containers",
  children,
}: LessonWithVisualizerProps) {
  const [showVisualizer, setShowVisualizer] = useState(true);

  return (
    <div className="space-y-8">
      {/* Visualizer Toggle */}
      <motion.div
        className="flex items-center justify-between rounded-lg border border-gray-800/50 bg-gray-900/50 p-4 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h3 className="font-semibold text-white">Interactive Visualization</h3>
          <p className="text-sm text-gray-400">
            {visualType === "containers" &&
              "Watch Docker containers fall and stack with physics simulation"}
            {visualType === "cluster" && "Explore Kubernetes cluster dynamics"}
            {visualType === "flow" && "See data flow through the system"}
          </p>
        </div>
        <motion.button
          onClick={() => setShowVisualizer(!showVisualizer)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showVisualizer ? "Hide" : "Show"}
        </motion.button>
      </motion.div>

      {/* 3D Physics Scene */}
      <AnimatePresence>
        {showVisualizer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PhysicsScene type={visualType} height="h-96" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {children && <div className="space-y-6">{children}</div>}
    </div>
  );
}
