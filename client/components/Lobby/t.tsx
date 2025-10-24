'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Crown, Users, Copy, Check, LogOut, Play, Clock, Sparkles, Star, Zap, Trophy } from 'lucide-react';

export default function LobbyPage() {
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Static mock data
  const roomCode = 'ABC123';
  const isHost = true;

  const [players, setPlayers] = useState([
    { id: 1, name: 'Alex Thunder', isHost: true, isReady: true, avatar: 'AT', color: 'from-purple-500 to-pink-500' },
    { id: 2, name: 'Jordan Smith', isHost: false, isReady: true, avatar: 'JS', color: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Sam Parker', isHost: false, isReady: false, avatar: 'SP', color: 'from-green-500 to-emerald-500' },
    { id: 4, name: 'Casey Brown', isHost: false, isReady: true, avatar: 'CB', color: 'from-orange-500 to-red-500' },
    { id: 5, name: 'Taylor Lee', isHost: false, isReady: false, avatar: 'TL', color: 'from-pink-500 to-purple-500' },
    { id: 6, name: 'Morgan Davis', isHost: false, isReady: true, avatar: 'MD', color: 'from-yellow-500 to-orange-500' },
    { id: 7, name: 'Riley Wilson', isHost: false, isReady: false, avatar: 'RW', color: 'from-teal-500 to-cyan-500' },
  ]);

  // Optimized: memoize static variants
  const containerVariants: any = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  }), []);

  const itemVariants: any = useMemo(() => ({
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } },
  }), []);

  const playerVariants: any = useMemo(() => ({
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 150 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  }), []);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [roomCode]);

  const readyCount = players.filter(p => p.isReady).length;
  const totalPlayers = players.length;

  const bgClass = isDark ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';
  const cardBgClass = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-purple-200';
  const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-slate-300' : 'text-gray-600';

  // Pre-generate static particle positions to avoid random on every render
  const particles = useMemo(() => Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  })), []);

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500`}>
      {/* Background blobs now use CSS animation for GPU offload */}
      <div className={`absolute top-20 left-10 w-96 h-96 ${isDark ? 'bg-purple-600 opacity-20' : 'bg-purple-300 opacity-30'} rounded-full mix-blend-multiply blur-3xl animate-[floatBlob1_20s_linear_infinite]`} />
      <div className={`absolute top-40 right-10 w-96 h-96 ${isDark ? 'bg-blue-600 opacity-20' : 'bg-blue-300 opacity-30'} rounded-full mix-blend-multiply blur-3xl animate-[floatBlob2_18s_linear_infinite]`} />

      {/* Floating Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className={`absolute w-2 h-2 ${isDark ? 'bg-purple-400' : 'bg-purple-300'} rounded-full opacity-20`}
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}

      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-lg shadow-xl border transition-all duration-300 ${isDark ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700/80' : 'bg-white/80 border-purple-200 hover:bg-white/90'}`}
        whileHover={{ scale: 1.05, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-purple-600" />}
      </motion.button>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            {/* Room Info */}
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-spin-slow">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`text-2xl ${textPrimaryClass}`}>Lobby</CardTitle>
                    <CardDescription className={textSecondaryClass}>Waiting for players</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className={`text-sm font-semibold ${textSecondaryClass}`}>Room Code</p>
                  <div className={`flex items-center gap-2 p-4 rounded-xl ${isDark ? 'bg-slate-800/80' : 'bg-purple-50'}`}>
                    <span className={`text-3xl font-bold tracking-wider flex-1 ${textPrimaryClass}`}>{roomCode}</span>
                    <motion.button onClick={handleCopyCode} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-purple-100'}`} whileTap={{ scale: 0.9 }}>
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-purple-600'}`} />}
                    </motion.button>
                  </div>
                </div>

                <div className={`p-4 rounded-xl flex items-center gap-3 ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                  <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-semibold ${textPrimaryClass}`}>{totalPlayers}/8 Players</p>
                    <p className={`text-sm ${textSecondaryClass}`}>{readyCount} ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Settings */}
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
              <CardHeader>
                <CardTitle className={`text-xl ${textPrimaryClass}`}>Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[{ icon: Clock, label: 'Time per question', value: '30s', color: 'purple' }, { icon: Sparkles, label: 'Questions', value: '10', color: 'blue' }, { icon: Star, label: 'Difficulty', value: 'Medium', color: 'yellow' }].map((s, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/60' : 'bg-purple-50'}`}>
                    <div className="flex items-center gap-2">
                      <s.icon className={`w-4 h-4 text-${s.color}-400`} />
                      <span className={`text-sm font-medium ${textPrimaryClass}`}>{s.label}</span>
                    </div>
                    <Badge className={`bg-gradient-to-r from-${s.color}-500 to-${s.color === 'yellow' ? 'orange' : 'pink'}-500 text-white`}>{s.value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
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
          </motion.div>

          {/* Players Grid */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl h-full`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-2xl ${textPrimaryClass}`}>Players in Lobby</CardTitle>
                    <CardDescription className={textSecondaryClass}>{readyCount} of {totalPlayers} ready</CardDescription>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} animate-pulse-slow`}>
                    <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{totalPlayers}/8</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <motion.div className="grid sm:grid-cols-2 gap-4" variants={containerVariants}>
                  <AnimatePresence mode="popLayout">
                    {players.map(player => (
                      <motion.div key={player.id} variants={playerVariants} layout className={`p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm ${player.isReady ? (isDark ? 'border-green-500/50 bg-green-500/10' : 'border-green-400 bg-green-50') : (isDark ? 'border-slate-700 bg-slate-800/60' : 'border-purple-200 bg-white')}`}>
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
                    ))}
                    {[...Array(Math.max(0, 8 - totalPlayers))].map((_, i) => (
                      <motion.div key={`empty-${i}`} variants={playerVariants} className={`p-5 rounded-2xl border-2 border-dashed flex items-center justify-center backdrop-blur-sm ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-purple-200 bg-purple-50/30'}`}>
                        <div className="text-center animate-pulse-slow">
                          <Users className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-purple-300'}`} />
                          <p className={`text-sm font-medium ${textSecondaryClass}`}>Waiting...</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}