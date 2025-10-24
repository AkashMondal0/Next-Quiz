'use client';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function FloatingParticles({ isDark }: { isDark: boolean }) {
  const particles = useMemo(() => Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  })), []);

  return (
    <>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className={`absolute w-2 h-2 ${isDark ? 'bg-purple-400' : 'bg-purple-300'} rounded-full opacity-20`}
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  );
}
