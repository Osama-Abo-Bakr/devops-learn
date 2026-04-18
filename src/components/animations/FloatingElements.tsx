"use client";

import { motion } from "framer-motion";

interface FloatingElement {
  id: string;
  icon: string;
  size: number;
  delay: number;
  duration: number;
  x: number;
  y: number;
  rotation: number;
}

interface FloatingElementsProps {
  elements?: FloatingElement[];
  count?: number;
  className?: string;
}

const defaultElements: FloatingElement[] = [
  { id: "docker", icon: "🐳", size: 64, delay: 0, duration: 6, x: 10, y: 20, rotation: 0 },
  { id: "k8s", icon: "☸️", size: 56, delay: 1, duration: 7, x: 80, y: 30, rotation: -20 },
  { id: "compose", icon: "📦", size: 48, delay: 2, duration: 5.5, x: 20, y: 70, rotation: 15 },
  { id: "devops", icon: "🚀", size: 60, delay: 3, duration: 8, x: 85, y: 75, rotation: -15 },
  { id: "terminal", icon: "💻", size: 52, delay: 0.5, duration: 6.5, x: 50, y: 15, rotation: 10 },
  { id: "cloud", icon: "☁️", size: 44, delay: 2.5, duration: 7.5, x: 70, y: 60, rotation: -25 },
];

export default function FloatingElements({
  elements = defaultElements,
  count = elements.length,
  className = "",
}: FloatingElementsProps) {
  const selectedElements = elements.slice(0, count);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ pointerEvents: "none" }}>
      {selectedElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute cursor-grab"
          initial={{
            x: `${element.x}%`,
            y: `${element.y}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${element.y}%`, `${element.y - 15}%`, `${element.y}%`],
            opacity: [0, 0.7, 0.7, 0],
            rotate: [element.rotation, element.rotation + 360],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            fontSize: element.size,
            filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
            transform: "translate(-50%, -50%)",
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
}
