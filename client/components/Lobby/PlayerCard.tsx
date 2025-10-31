'use client';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types';
import { LogIn } from 'lucide-react';
// import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/hooks';
// import useSocket from '@/hooks/socketHook';
import { useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { leaveUserFromRoom } from '@/store/features/account/AccountSlice';
import { randomColor } from '@/lib/utils';

export default function PlayerCard({ player, isHost, isDark, variants, textPrimaryClass, roomCode }: { player: Player; isHost: boolean; isDark: boolean; variants: any; textPrimaryClass: string; roomCode: string }) {
  const color = randomColor()
  const dispatch = useAppDispatch();
  // const socket = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleKickPlayer = async () => {
    setIsLoading(true);
    // socket.connectSocket();
    try {
      await api.post("/quiz/room/kick", {
        player: player,
        roomCode: roomCode,
      });
      dispatch(leaveUserFromRoom(player.id));
    } catch (error) {
      toast.error("Error leaving room. Please try again.");
      // setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }
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
            {player.isHost ? <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">Host</Badge> :
              <Badge className={`text-xs ${player.isReady ? 'bg-green-500 text-white' : (isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-600')}`}>{player.isReady ? 'Ready' : 'Not Ready'}</Badge>}
          </div>
        </div>

        {/* Kick button shown to the lobby host for other players */}
        {isHost && !player.isHost && (
          <div className="ml-2">
            <button
              type="button"
              aria-label={`Kick ${player.username}`}
              title={`Kick ${player.username}`}
              onClick={handleKickPlayer}
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
