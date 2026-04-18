"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  count?: number;
  colors?: string[];
  speed?: number;
  gravity?: number;
  className?: string;
}

export default function ParticleSystem({
  count = 50,
  colors = ["#3b82f6", "#06b6d4", "#8b5cf6", "#ec4899"],
  speed = 2,
  gravity = 0.1,
  className = "",
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initializeParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: 1,
      }));
    };

    initializeParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + gravity,
          life: particle.life - 0.005,
        }))
        .filter((particle) => particle.life > 0);

      // Respawn dead particles
      while (particlesRef.current.length < count) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * speed * 2,
          vy: Math.random() * speed + 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          maxLife: 1,
        });
      }

      // Draw particles
      particlesRef.current.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity * particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [count, colors, speed, gravity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
}
