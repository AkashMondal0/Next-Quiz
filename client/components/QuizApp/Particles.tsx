'use client';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

export default function Particles({ isDark }: { isDark: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        scale: 0.7 + Math.random() * 0.6,
        opacity: 0.08 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-300'}`}
          style={{
            left: p.left,
            top: p.top,
            width: 6 * p.scale,
            height: 6 * p.scale,
            opacity: p.opacity,
          }}
          animate={{ y: [0, -18 * p.scale, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}
