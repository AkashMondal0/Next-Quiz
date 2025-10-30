import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { MatchRanking } from '@/types';
import { randomColor } from '@/lib/utils';


interface PlayerCardProps {
    player: MatchRanking;
    index: number;
    isDark: boolean;
    textPrimaryClass: string;
    textSecondaryClass: string;
    isYou: boolean;
    score?: number;
    answered: number;
}

// ============= PLAYER CARD =============
const PlayerCard: React.FC<PlayerCardProps> = React.memo(({ player, index, isDark, textPrimaryClass, textSecondaryClass, isYou,
    score = 0, answered = 0
 }) => {
    const color = useMemo(() => randomColor(), []);
    return (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`p-3 rounded-lg ${isYou
            ? isDark ? 'bg-purple-500/20 border-2 border-purple-500/50' : 'bg-purple-100 border-2 border-purple-300'
            : isDark ? 'bg-slate-800/60' : 'bg-slate-50'
            } transition-all duration-200`}
        whileHover={{ scale: 1.02 }}
    >
        <div className="flex items-center gap-2">
            <motion.div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-slate-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                            isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                    }`}
                whileHover={{ rotate: [0, -5, 5, 0] }}
            >
                {index + 1}
            </motion.div>

            <Avatar className="w-9 h-9 border border-white/20">
                <AvatarFallback className={`bg-gradient-to-br ${color} text-white text-xs font-bold`}>
                    {player.username.charAt(0).toUpperCase()}{player.username.charAt(1).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                    <p className={`font-bold text-xs truncate ${textPrimaryClass}`}>
                        {player.username}
                    </p>
                    {index === 0 && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-1 text-xs">
                    {/* <span className={textSecondaryClass}>{score} pts</span>
                    <span className={textSecondaryClass}>•</span> */}
                    <span className={textSecondaryClass}>{answered}/10</span>
                </div>
            </div>

            {isYou && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0">
                    You
                </Badge>
            )}
        </div>
    </motion.div>
)});


export default PlayerCard;