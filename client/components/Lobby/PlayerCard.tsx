'use client';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types';
import { LogIn } from 'lucide-react';

const gradients = [
  'from-purple-500 to-pink-500',
  'from-green-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-yellow-400 to-orange-500',
  'from-red-400 to-pink-600',
  'from-cyan-400 to-blue-400',
  'from-emerald-400 to-green-600',
  'from-violet-400 to-fuchsia-500',
  'from-fuchsia-500 to-pink-400',
  'from-rose-400 to-amber-400',
  'from-lime-400 to-emerald-500',
  'from-sky-400 to-cyan-500',
  'from-indigo-600 to-purple-600',
  'from-amber-400 to-yellow-500',
  'from-rose-500 to-red-500',
  'from-teal-400 to-cyan-600'
];

export default function PlayerCard({ player, isHost, isDark, variants, textPrimaryClass }: { player: Player; isHost: boolean; isDark: boolean; variants: any; textPrimaryClass: string }) {
  const color = gradients[Math.floor(Math.random() * gradients.length)];
  return (
    <motion.div key={player.id} variants={variants} layout className={`p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm ${player.isReady ? (isDark ? 'border-green-500/50 bg-green-500/10' : 'border-green-400 bg-green-50') : (isDark ? 'border-slate-700 bg-slate-800/60' : 'border-purple-200 bg-white')}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative z-10 flex items-center gap-4">
      <Avatar className="w-16 h-16 border-4 border-white/20">
        <AvatarFallback className={`bg-gradient-to-br ${color} text-white text-lg font-bold`}>
        {(player.username ?? player.username ?? '').slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-lg truncate ${textPrimaryClass}`}>{player.username}</h3>
        <div className="flex items-center gap-2 mt-1">
        {player.isHost && (<Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">Host</Badge>)}
        <Badge className={`text-xs ${player.isReady ? 'bg-green-500 text-white' : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-600')}`}>{player.isReady ? 'Ready' : 'Not Ready'}</Badge>
        </div>
      </div>

      {/* Kick button shown to the lobby host for other players */}
      {isHost && !player.isHost && (
        <div className="ml-2">
        <button
          type="button"
          aria-label={`Kick ${player.username}`}
          title={`Kick ${player.username}`}
          onClick={() => { console.log('Kick player', player.id); /* TODO: wire up kick action */ }}
          className="inline-flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-2xl shadow-sm transition"
        >
          <LogIn />
          Kick
        </button>
        </div>
      )}
      </div>
    </motion.div>
  );
}
