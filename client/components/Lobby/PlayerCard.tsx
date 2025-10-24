'use client';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function PlayerCard({ player, isDark, variants, textPrimaryClass }: { player: any; isDark: boolean; variants: any; textPrimaryClass: string }) {
  return (
    <motion.div key={player.id} variants={variants} layout className={`p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm ${player.isReady ? (isDark ? 'border-green-500/50 bg-green-500/10' : 'border-green-400 bg-green-50') : (isDark ? 'border-slate-700 bg-slate-800/60' : 'border-purple-200 bg-white')}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${player.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative z-10 flex items-center gap-4">
        <Avatar className="w-16 h-16 border-4 border-white/20">
          <AvatarFallback className={`bg-gradient-to-br ${player.color} text-white text-lg font-bold`}>{player.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg truncate ${textPrimaryClass}`}>{player.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {player.isHost && (<Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">Host</Badge>)}
            <Badge className={`text-xs ${player.isReady ? 'bg-green-500 text-white' : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-600')}`}>{player.isReady ? 'Ready' : 'Not Ready'}</Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
