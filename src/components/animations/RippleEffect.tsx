"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface RippleProps {
  x: number;
  y: number;
  size: number;
  color?: string;
}

interface RippleEffectProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export default function RippleEffect({
  children,
  color = "rgba(59, 130, 246, 0.6)",
  className = "",
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<RippleProps[]>([]);

  const addRipple = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    const newRipple: RippleProps = { x, y, size, color };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r !== newRipple));
    }, 600);
  };

  return (
    <div
      onClick={addRipple}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {ripples.map((ripple, idx) => (
        <motion.span
          key={idx}
          className="absolute rounded-full pointer-events-none"
          initial={{
            width: 0,
            height: 0,
            x: ripple.x,
            y: ripple.y,
            opacity: 1,
          }}
          animate={{
            width: ripple.size,
            height: ripple.size,
            x: ripple.x - ripple.size / 2,
            y: ripple.y - ripple.size / 2,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          style={{
            backgroundColor: ripple.color,
          }}
        />
      ))}
    </div>
  );
}
