import { useMemo } from "react";

// ============= UTILITY HOOKS =============
const BLOBS: any[] = [
  { id: 'blob1', size: 384, left: '5%', top: '5%', duration: 20 },
  { id: 'blob2', size: 384, right: '5%', top: '18%', duration: 16 },
  { id: 'blob3', size: 384, left: '45%', bottom: '8%', duration: 18 },
];

function useParticles(count = 12) {
  return useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: `p-${i}`,
      left: `${Math.round(Math.random() * 100)}%`,
      top: `${Math.round(Math.random() * 100)}%`,
      delay: +(Math.random() * 2).toFixed(2),
      duration: 3 + Math.random() * 3,
      scale: 0.7 + Math.random() * 0.6,
      opacity: 0.08 + Math.random() * 0.25,
    }));
  }, [count]);
}

// ============= ANIMATION VARIANTS =============
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

const itemVariants: any = {
  hidden: { y: 18, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 18 }
  }
};

const cardMotionProps: any = {
  initial: 'hidden',
  animate: 'visible',
  whileHover: { scale: 1.02, y: -6 },
  whileTap: { scale: 0.98 },
  variants: {
    hidden: { scale: 0.98, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 140, damping: 18 } }
  }
};

export { useParticles, containerVariants, itemVariants, cardMotionProps, BLOBS };