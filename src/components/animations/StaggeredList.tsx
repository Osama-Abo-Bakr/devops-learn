"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredListProps {
  children: ReactNode[];
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
}

export default function StaggeredList({
  children,
  staggerDelay = 0.1,
  delayChildren = 0.2,
  className = "",
}: StaggeredListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <motion.ul
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children.map((child, idx) => (
        <motion.li key={idx} variants={itemVariants}>
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}
