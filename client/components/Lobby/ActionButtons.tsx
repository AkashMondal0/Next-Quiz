'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { Check, LogOut, Play, Zap } from 'lucide-react';

export default function ActionButtons({
  isDark,
  isHost,
  isReady,
  readyCount,
  setIsReady,
}: {
  isDark: boolean;
  isHost: boolean;
  isReady: boolean;
  readyCount: number;
  setIsReady: (v: boolean) => void;
}) {
  const itemVariants: any = useMemo(() => ({
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } },
  }), []);
  return (
    <motion.div variants={itemVariants} className="space-y-3">
      {isHost ? (
        <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl" disabled={readyCount < 2}>
          <Play className="w-5 h-5 mr-2" /> Start Game
        </Button>
      ) : (
        <Button onClick={() => setIsReady(!isReady)} className={`w-full h-14 text-lg font-bold shadow-xl ${isReady ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-pink-600'}`}>
          {isReady ? (<><Check className="w-5 h-5 mr-2" />Ready!</>) : (<><Zap className="w-5 h-5 mr-2" />Ready Up</>)}
        </Button>
      )}

      <Button variant="outline" className={`w-full h-12 font-semibold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'}`}>
        <LogOut className="w-4 h-4 mr-2" /> Leave Lobby
      </Button>
    </motion.div>
  );
}
