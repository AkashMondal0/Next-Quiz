import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";


export default function QuizGenerationLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-6 min-h-screen", className)}>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-2"
      >
        <Sparkles className="h-6 w-6 text-stone-400 animate-pulse" />
        <p className="text-xl font-semibold tracking-wide relative overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-stone-400 via-white to-stone-400 animate-shine">
          Generating Your Quiz...
        </p>
      </motion.div>

      <motion.div
        className="flex gap-1 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-stone-400"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}