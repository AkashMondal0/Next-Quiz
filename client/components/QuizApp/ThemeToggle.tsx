import { motion } from "framer-motion";
import { memo } from "react";
import { Sun, Moon } from "lucide-react";

// ============= THEME TOGGLE COMPONENT =============
const ThemeToggle = memo(function ThemeToggle({ isDark, onToggle }: { isDark: boolean, onToggle: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.45 }}
      onClick={onToggle}
      className={`fixed top-6 right-6 z-50 p-3 rounded-2xl ${isDark ? 'bg-slate-800/80 hover:bg-slate-700/80' : 'bg-white/80 hover:bg-white/90'
        } backdrop-blur-lg shadow-lg border ${isDark ? 'border-slate-700' : 'border-purple-200'
        } transition-all duration-300`}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
    </motion.button>
  )
});

export default ThemeToggle;