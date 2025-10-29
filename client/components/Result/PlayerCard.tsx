import React from 'react';
import { Trophy, Medal, Award, Target, CheckCircle2, XCircle, Clock, Zap, Flame } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { RankUser } from '@/types';
const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Trophy className="w-8 h-8 text-yellow-400" />;
    case 2: return <Medal className="w-8 h-8 text-slate-400" />;
    case 3: return <Medal className="w-8 h-8 text-orange-400" />;
    default: return <Award className="w-7 h-7 text-blue-400" />;
  }
};

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1: return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    case 2: return 'bg-gradient-to-r from-slate-400 to-slate-500';
    case 3: return 'bg-gradient-to-r from-orange-500 to-red-500';
    default: return 'bg-gradient-to-r from-blue-500 to-purple-500';
  }
};

const PlayerCard = React.memo(function PlayerCard({ player, isDark }: { player: RankUser, isDark: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border-2 ${player.rank === 1
      ? 'border-yellow-400 bg-yellow-500/10'
      : player.rank === 2
        ? 'border-slate-400 bg-slate-500/10'
        : player.rank === 3
          ? 'border-orange-400 bg-orange-500/10'
          : isDark
            ? 'border-slate-700 bg-slate-800/60'
            : 'border-purple-200 bg-white'
      } backdrop-blur-sm relative overflow-hidden group transition-all duration-300`}>
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0">{getRankIcon(player.rank)}</div>

            <Avatar className="w-16 h-16 border-2 border-white/20 flex-shrink-0">
              <AvatarFallback className={`bg-gradient-to-br ${player.color} text-white text-xl font-bold`}>
                {player.username.charAt(0).toUpperCase()}{player.username.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-bold text-xl md:text-2xl truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.username}</p>
                {player.rank === 1 && <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">👑 Champion</Badge>}
                {player.rank === 2 && <Badge className="bg-gradient-to-r from-slate-400 to-slate-500 text-white">🥈 Runner Up</Badge>}
                {player.rank === 3 && <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">🥉 Third Place</Badge>}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Trophy className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.score}</span>
                <span className={`text-lg ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>points</span>
              </div>
            </div>
          </div>

          <div className={`w-16 h-16 rounded-2xl ${getRankBadge(player.rank)} flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0`}>
            #{player.rank}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-50'}`}>
            <div className="flex items-center gap-2 mb-2"><Target className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} /><span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Accuracy</span></div>
            <p className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.accuracy}%</p>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
            <div className="flex items-center gap-2 mb-2"><CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} /><span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Correct</span></div>
            <p className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.correctAnswers}/{player.totalQuestions}</p>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-2"><XCircle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} /><span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Wrong</span></div>
            <p className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.wrongAnswers}</p>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
            <div className="flex items-center gap-2 mb-2"><Clock className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /><span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Avg Time</span></div>
            <p className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.avgTime}s</p>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-50'}`}>
            <div className="flex items-center gap-2 mb-2"><Zap className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} /><span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Fastest</span></div>
            <p className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.fastestAnswer}s</p>
          </div>

          <div className={`p-4 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-50'}`}>
            <div className="flex items-center gap-2 mb-2"><Flame className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} /><span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Streak</span></div>
            <p className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.streak}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PlayerCard;