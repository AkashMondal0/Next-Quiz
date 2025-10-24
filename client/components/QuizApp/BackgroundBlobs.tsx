import { BLOBS } from "@/utility/hooks";
import { motion } from "framer-motion";
import { memo } from "react";

// ============= BACKGROUND COMPONENT =============
const AnimatedBackground = memo(function AnimatedBackground({ isDark, particles }: { isDark: boolean, particles: any[] }) {
  return (
    <>
      {BLOBS.map((b, idx) => (
        <div
          key={b.id}
          className={`absolute rounded-full mix-blend-multiply filter blur-3xl ${isDark ? 'opacity-20' : 'opacity-30'}`}
          style={{
            width: b.size, height: b.size,
            left: b.left, right: b.right, top: b.top, bottom: b.bottom,
            background: isDark
              ? (idx === 0 ? '#7c3aed' : idx === 1 ? '#2563eb' : '#db2777')
              : (idx === 0 ? '#c4b5fd' : idx === 1 ? '#bfdbfe' : '#fbcfe8'),
            animation: `blobMove ${b.duration}s ease-in-out infinite ${idx % 2 === 0 ? '' : 'reverse'}`,
            willChange: 'transform'
          }}
        />
      ))}
      {/* {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-300'}`}
          style={{
            left: p.left, top: p.top,
            width: 6 * p.scale, height: 6 * p.scale,
            opacity: p.opacity, willChange: 'transform'
          }}
          animate={{ y: [0, -18 * p.scale, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))} */}
    </>
  )
});

export default AnimatedBackground;