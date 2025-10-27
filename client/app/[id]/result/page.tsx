'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Moon, Sun, Crown, Trophy, Medal, Award, Target, Clock,
  Flame, CheckCircle2, XCircle, TrendingUp, Zap, Star,
  Home, RotateCcw, Share2
} from 'lucide-react';

// ---------------------------
// Static data moved outside
// ---------------------------
const PLAYERS = [
  { id: 1, name: 'Alex Thunder', avatar: 'AT', color: 'from-purple-500 to-pink-500', score: 950, correctAnswers: 9, wrongAnswers: 1, totalQuestions: 10, avgTime: 12.5, streak: 7, rank: 1, accuracy: 90, fastestAnswer: 5.2 },
  { id: 2, name: 'Jordan Smith', avatar: 'JS', color: 'from-blue-500 to-cyan-500', score: 820, correctAnswers: 8, wrongAnswers: 2, totalQuestions: 10, avgTime: 15.2, streak: 5, rank: 2, accuracy: 80, fastestAnswer: 7.8 },
  { id: 3, name: 'Casey Brown', avatar: 'CB', color: 'from-orange-500 to-red-500', score: 780, correctAnswers: 8, wrongAnswers: 2, totalQuestions: 10, avgTime: 18.7, streak: 4, rank: 3, accuracy: 80, fastestAnswer: 9.1 },
  { id: 4, name: 'Sam Parker', avatar: 'SP', color: 'from-green-500 to-emerald-500', score: 710, correctAnswers: 7, wrongAnswers: 3, totalQuestions: 10, avgTime: 16.3, streak: 3, rank: 4, accuracy: 70, fastestAnswer: 8.5 },
  { id: 5, name: 'Taylor Swift', avatar: 'TS', color: 'from-pink-500 to-rose-500', score: 680, correctAnswers: 7, wrongAnswers: 3, totalQuestions: 10, avgTime: 19.8, streak: 4, rank: 5, accuracy: 70, fastestAnswer: 10.2 },
  { id: 6, name: 'Morgan Lee', avatar: 'ML', color: 'from-indigo-500 to-purple-500', score: 590, correctAnswers: 6, wrongAnswers: 4, totalQuestions: 10, avgTime: 20.1, streak: 2, rank: 6, accuracy: 60, fastestAnswer: 11.4 }
] as {
  id: number;
  name: string;
  avatar: string;
  color: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  avgTime: number;
  streak: number;
  rank: number;
  accuracy: number;
  fastestAnswer: number;
}[];

// ---------------------------
// Small reusable helpers
// ---------------------------
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

// ---------------------------
// PlayerCard - memoized
// ---------------------------
type Player = (typeof PLAYERS)[number];

const PlayerCard = React.memo(function PlayerCard({ player, isDark }: { player: Player, isDark: boolean }) {
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
              <AvatarFallback className={`bg-gradient-to-br ${player.color} text-white text-xl font-bold`}>{player.avatar}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-bold text-xl md:text-2xl truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{player.name}</p>
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

// ---------------------------
// Main Component
// ---------------------------
export default function QuizResults() {
  const [isDark, setIsDark] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  // memoize computed values to avoid recalculation on each render
  const players = useMemo(() => PLAYERS, []);
  const topThree = useMemo(() => players.slice(0, 3), [players]);

  const avgAccuracy = useMemo(() => Math.round(players.reduce((acc, p) => acc + p.accuracy, 0) / players.length), [players]);
  const avgTime = useMemo(() => Math.round(players.reduce((acc, p) => acc + p.avgTime, 0) / players.length), [players]);

  // generate confetti parameters only once
  const confetti = useMemo(() => {
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#00CED1'];
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      xOffset: Math.random() * 100 - 50
    }));
  }, []);

  // auto-stop confetti after a short duration to reduce GPU usage
  useEffect(() => {
    if (!showConfetti) return;
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, [showConfetti]);

  const containerVariants: any = useMemo(() => ({ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }), []);
  const itemVariants: any = useMemo(() => ({ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90, damping: 12 } } }), []);
  const bgClass = isDark ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';
  const cardBgClass = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-purple-200';

  const toggleTheme = useCallback(() => setIsDark(v => !v), []);

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500`}>

      {/* Decorative blurred blobs: keep them but with simple CSS transforms (less frequent layout thrash) */}
      <motion.div className={`absolute top-16 left-8 w-80 h-80 ${isDark ? 'bg-purple-600' : 'bg-purple-300'} rounded-full mix-blend-multiply filter blur-3xl ${isDark ? 'opacity-20' : 'opacity-30'}`} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
      <motion.div className={`absolute top-40 right-8 w-80 h-80 ${isDark ? 'bg-blue-600' : 'bg-blue-300'} rounded-full mix-blend-multiply filter blur-3xl ${isDark ? 'opacity-20' : 'opacity-30'}`} animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} />

      {/* Confetti - reduced count, memoized positions */}
      <AnimatePresence>
        {showConfetti && confetti.map(c => (
          <motion.div key={c.id}
            className="absolute w-3 h-3 rounded-full"
            style={{ left: c.left, top: '-6%', background: c.color }}
            initial={{ y: '-6vh', opacity: 1 }}
            animate={{ y: ['-6vh', '110vh'], x: [0, c.xOffset], opacity: [1, 0.6, 0] }}
            transition={{ duration: c.duration, delay: c.delay, ease: 'linear' }}
          />
        ))}
      </AnimatePresence>

      {/* Theme Toggle */}
      <motion.button onClick={toggleTheme} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
        className={`fixed top-6 right-6 z-50 p-4 rounded-2xl ${isDark ? 'bg-slate-800/80 hover:bg-slate-700/80' : 'bg-white/80 hover:bg-white/90'} backdrop-blur-lg shadow-xl border ${isDark ? 'border-slate-700' : 'border-purple-200'} transition-all duration-300`} whileHover={{ scale: 1.05 }}>
        {isDark ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-purple-600" />}
      </motion.button>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-7xl relative z-10">
        <div className="space-y-8">

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-3xl shadow-2xl flex items-center justify-center">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl opacity-20 blur-2xl" />
            </div>

            <div>
              <motion.h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4" animate={{ backgroundPosition: ['0%', '100%', '0%'] }} style={{ backgroundSize: '200% auto' }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}>
                Game Over!
              </motion.h1>
              <p className={`text-2xl md:text-3xl font-semibold ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>🎉 Congratulations to all players!</p>
            </div>
          </motion.div>

          {/* Winner's Podium - keep animations but fewer animated props */}
          <motion.div variants={itemVariants}>
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl overflow-hidden`}>
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-3 gap-4 md:gap-6 items-end max-w-4xl mx-auto">

                  {/* 2nd */}
                  <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-slate-400 mx-auto shadow-xl"><AvatarFallback className={`bg-gradient-to-br ${topThree[1].color} text-white text-2xl md:text-3xl font-bold`}>{topThree[1].avatar}</AvatarFallback></Avatar>
                      <div className="absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white">2</div>
                    </div>
                    <div className="h-32 md:h-40 bg-gradient-to-br from-slate-400 to-slate-500 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                      <Medal className="w-8 h-8 md:w-10 md:h-10 text-white mb-2" />
                      <p className="font-bold text-white text-sm md:text-base truncate px-2 max-w-full">{topThree[1].name}</p>
                      <p className="text-white/90 text-xl md:text-2xl font-bold">{topThree[1].score}</p>
                    </div>
                  </motion.div>

                  {/* 1st */}
                  <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-yellow-400 mx-auto shadow-2xl"><AvatarFallback className={`bg-gradient-to-br ${topThree[0].color} text-white text-3xl md:text-4xl font-bold`}>{topThree[0].avatar}</AvatarFallback></Avatar>
                      <div className="absolute -top-3 -right-3 w-14 h-14 md:w-16 md:h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"><Crown className="w-7 h-7 md:w-9 md:h-9 text-white" /></div>
                    </div>
                    <div className="h-48 md:h-56 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-t-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                      <Trophy className="w-12 h-12 md:w-14 md:h-14 text-white mb-3" />
                      <Badge className="bg-white/30 text-white mb-2 text-xs md:text-sm">🏆 WINNER</Badge>
                      <p className="font-bold text-white text-base md:text-lg truncate px-2 max-w-full">{topThree[0].name}</p>
                      <p className="text-white text-2xl md:text-3xl font-bold">{topThree[0].score}</p>
                    </div>
                  </motion.div>

                  {/* 3rd */}
                  <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-orange-400 mx-auto shadow-xl"><AvatarFallback className={`bg-gradient-to-br ${topThree[2].color} text-white text-2xl md:text-3xl font-bold`}>{topThree[2].avatar}</AvatarFallback></Avatar>
                      <div className="absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white">3</div>
                    </div>
                    <div className="h-24 md:h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                      <Medal className="w-8 h-8 md:w-10 md:h-10 text-white mb-2" />
                      <p className="font-bold text-white text-sm md:text-base truncate px-2 max-w-full">{topThree[2].name}</p>
                      <p className="text-white/90 text-xl md:text-2xl font-bold">{topThree[2].score}</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Rankings - use non-motion mapping for cards to reduce overhead */}
          <motion.div variants={itemVariants}>
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Final Rankings</CardTitle>
                    <CardDescription className={`${isDark ? 'text-slate-300' : 'text-gray-600'} mt-2`}>Complete player statistics and performance breakdown</CardDescription>
                  </div>
                  <div><TrendingUp className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {players.map((player) => (
                  <div key={player.id}>
                    {/* player card uses memoized component */}
                    <PlayerCard player={player} isDark={isDark} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Match Summary */}
          <motion.div variants={itemVariants}>
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
              <CardHeader><CardTitle className={`text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Match Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'} text-center`}>
                    <div className="mx-auto mb-3"><Star className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /></div>
                    <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>10</p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Total Questions</p>
                  </div>

                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'} text-center`}>
                    <div className="mx-auto mb-3"><Trophy className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} /></div>
                    <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{players.length}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Total Players</p>
                  </div>

                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-green-500/20' : 'bg-green-50'} text-center`}>
                    <div className="mx-auto mb-3"><Star className={`w-10 h-10 ${isDark ? 'text-green-400' : 'text-green-600'}`} /></div>
                    <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{avgAccuracy}%</p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Avg Accuracy</p>
                  </div>

                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-50'} text-center`}>
                    <div className="mx-auto mb-3"><Clock className={`w-10 h-10 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} /></div>
                    <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{avgTime}s</p>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Avg Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-xl"><RotateCcw className="w-6 h-6 mr-3" />Play Again</Button>
            <Button variant="outline" className={`h-16 px-10 text-lg font-bold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'}`}><Share2 className="w-6 h-6 mr-3" />Share Results</Button>
            <Button variant="outline" className={`h-16 px-10 text-lg font-bold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'}`}><Home className="w-6 h-6 mr-3" />Home</Button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
