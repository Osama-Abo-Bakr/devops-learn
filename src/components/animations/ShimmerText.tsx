"use client";

import { motion } from "framer-motion";

interface ShimmerTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function ShimmerText({
  text,
  className = "",
  delay = 0,
}: ShimmerTextProps) {
  const characters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, idx) => (
        <motion.span
          key={idx}
          variants={characterVariants}
          className="inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse"
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}
