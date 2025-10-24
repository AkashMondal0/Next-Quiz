'use client';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Copy, Check, Trophy } from 'lucide-react';

export default function RoomInfoCard({
  isDark,
  roomCode,
  copied,
  handleCopyCode,
  readyCount,
  totalPlayers,
}: {
  isDark: boolean;
  roomCode: string;
  copied: boolean;
  handleCopyCode: () => void;
  readyCount: number;
  totalPlayers: number;
}) {
  return (
    <Card className={`${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-purple-200'} border-2 backdrop-blur-xl shadow-2xl`}>
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-spin-slow">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Lobby</CardTitle>
            <CardDescription className={isDark ? 'text-slate-300' : 'text-gray-600'}>Waiting for players</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Room Code</p>
          <div className={`flex items-center gap-2 p-4 rounded-xl ${isDark ? 'bg-slate-800/80' : 'bg-purple-50'}`}>
            <span className={`text-3xl font-bold tracking-wider flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{roomCode}</span>
            <motion.button onClick={handleCopyCode} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-purple-100'}`} whileTap={{ scale: 0.9 }}>
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-purple-600'}`} />}
            </motion.button>
          </div>
        </div>

        <div className={`p-4 rounded-xl flex items-center gap-3 ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
          <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{totalPlayers}/8 Players</p>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{readyCount} ready</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
