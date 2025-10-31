'use client';

import React, { useMemo, useState, useCallback, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Moon, Sun, Crown, Trophy, Medal, Clock, TrendingUp, Star,
  Home,
} from 'lucide-react';
import { randomColor } from '@/lib/utils';
import PlayerCard from '@/components/Result/PlayerCard';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchRoomSession } from '@/store/features/account/Api';

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: roomCode } = use(params)
  const [isDark, setIsDark] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const roomSession = useAppSelector((state) => state.AccountState.roomSession);
  const RAW_PLAYERS = roomSession?.matchResults
  const dispatch = useAppDispatch();

  // Compute derived fields
  const PLAYERS = useMemo(() => {
    if (!RAW_PLAYERS) return [];
    // compute derived metrics first
    const processed = RAW_PLAYERS.map((p, idx) => {
      const accuracy = Math.round((p.correctAnswers / p.totalQuestions) * 100);
      const avgTime = +(p.timeTaken / p.totalQuestions).toFixed(1);
      const fastestAnswer = +(avgTime * 0.6 + Math.random()).toFixed(1);
      const streak = Math.max(1, p.correctAnswers - Math.floor(p.wrongAnswers / 2));
      const color = randomColor();
      return { ...p, accuracy, avgTime, fastestAnswer, streak, _origIndex: idx, color };
    });

    // sort with tiebreakers: score desc, accuracy desc, avgTime asc (faster is better)
    processed.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return a.avgTime - b.avgTime;
    });

    // assign ranks (standard competition ranking: 1,2,2,4) and add stable id
    const result: (typeof processed[number] & { rank: number; id: number })[] = [];
    for (let i = 0; i < processed.length; i++) {
      const p = processed[i];
      let rank: number;
      if (i === 0) {
        rank = 1;
      } else {
        const prev = processed[i - 1];
        const prevAssigned = result[i - 1];
        const isTie = p.score === prev.score && p.accuracy === prev.accuracy && p.avgTime === prev.avgTime;
        rank = isTie ? prevAssigned.rank : i + 1;
      }
      // id is stable within this run (use original index + 1 to avoid collisions)
      // cast p to any to avoid conflicts with an existing 'id' type coming from external types
      result.push({ ...(p as any), rank, id: p._origIndex + 1 });
    }
    return result;
  }, [RAW_PLAYERS]);

  // memoize computed values to avoid recalculation on each render
  const players = useMemo(() => PLAYERS, [PLAYERS]);
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

  const handleFetchRoomSession = useCallback(() => {
    if (!roomCode) return;
    dispatch(fetchRoomSession(roomCode));
  }, [dispatch, roomCode]);

  useEffect(() => {
    handleFetchRoomSession();
  }, []);

  if (players.length === 0) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500`}>
        <p className="text-lg text-center">No players found.</p>
      </div>
    );
  }

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
                  {topThree[1] ? <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-slate-400 mx-auto shadow-xl"><AvatarFallback className={`bg-gradient-to-br ${topThree[1].color} text-white text-2xl md:text-3xl font-bold`}>
                        {topThree[1].username.charAt(0).toUpperCase()}{topThree[1].username.charAt(1).toUpperCase()}
                      </AvatarFallback></Avatar>
                      <div className="absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white">2</div>
                    </div>
                    <div className="h-32 md:h-40 bg-gradient-to-br from-slate-400 to-slate-500 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                      <Medal className="w-8 h-8 md:w-10 md:h-10 text-white mb-2" />
                      <p className="font-bold text-white text-sm md:text-base truncate px-2 max-w-full">{topThree[1].username}</p>
                      <p className="text-white/90 text-xl md:text-2xl font-bold">{topThree[1].score}</p>
                    </div>
                  </motion.div> : null}

                  {/* 1st */}
                  {topThree[0] ? <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-yellow-400 mx-auto shadow-2xl"><AvatarFallback className={`bg-gradient-to-br ${topThree[0].color} text-white text-3xl md:text-4xl font-bold`}>{topThree[0].username.charAt(0).toUpperCase()}{topThree[0].username.charAt(1).toUpperCase()}</AvatarFallback></Avatar>
                      <div className="absolute -top-3 -right-3 w-14 h-14 md:w-16 md:h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"><Crown className="w-7 h-7 md:w-9 md:h-9 text-white" /></div>
                    </div>
                    <div className="h-48 md:h-56 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-t-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                      <Trophy className="w-12 h-12 md:w-14 md:h-14 text-white mb-3" />
                      <Badge className="bg-white/30 text-white mb-2 text-xs md:text-sm">🏆 WINNER</Badge>
                      <p className="font-bold text-white text-base md:text-lg truncate px-2 max-w-full">{topThree[0].username}</p>
                      <p className="text-white text-2xl md:text-3xl font-bold">{topThree[0].score}</p>
                    </div>
                  </motion.div> : null}

                  {/* 3rd */}
                  {topThree[2] ? <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-orange-400 mx-auto shadow-xl"><AvatarFallback className={`bg-gradient-to-br ${topThree[2].color} text-white text-2xl md:text-3xl font-bold`}>{topThree[2].username.charAt(0).toUpperCase()}{topThree[2].username.charAt(1).toUpperCase()}</AvatarFallback></Avatar>
                      <div className="absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white">3</div>
                    </div>
                    <div className="h-24 md:h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                      <Medal className="w-8 h-8 md:w-10 md:h-10 text-white mb-2" />
                      <p className="font-bold text-white text-sm md:text-base truncate px-2 max-w-full">{topThree[2].username}</p>
                      <p className="text-white/90 text-xl md:text-2xl font-bold">{topThree[2].score}</p>
                    </div>
                  </motion.div> : null}

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
            {/* <Button className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-xl"><RotateCcw className="w-6 h-6 mr-3" />Play Again</Button> */}
            {/* <Button variant="outline" className={`h-16 px-10 text-lg font-bold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'}`}><Share2 className="w-6 h-6 mr-3" />Share Results</Button> */}
            <Link href={'/'}>
              <Button variant="outline" className={`h-16 px-10 text-lg font-bold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'}`}><Home className="w-6 h-6 mr-3" />Home</Button>
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
