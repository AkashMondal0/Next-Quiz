'use client';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerCard from './PlayerCard';
import { Users } from 'lucide-react';

export default function PlayersGrid({ isDark, isHost, players, totalPlayers, participantLimit }: { isDark: boolean; isHost: boolean; players: any[]; totalPlayers: number; participantLimit: number; }) {
    const playerVariants: any = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 150 } },
        exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    };

    return (
        <motion.div className="grid sm:grid-cols-2 gap-4" variants={containerVariants}>
            <AnimatePresence mode="popLayout">
                {players.map(p => <PlayerCard isHost={isHost} key={p.id} player={p} isDark={isDark} variants={playerVariants} textPrimaryClass={isDark ? 'text-slate-300' : 'text-gray-600'} />)}
                {[...Array(Math.max(0, participantLimit - totalPlayers))].map((_, i) => (
                    <motion.div
                        key={`empty-${i}`}
                        variants={playerVariants}
                        className={`p-5 rounded-2xl border-2 border-dashed flex items-center justify-center backdrop-blur-sm ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-purple-200 bg-purple-50/30'}`}
                    >
                        <div className="text-center animate-pulse-slow">
                            <Users className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-purple-300'}`} />
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Waiting...</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
