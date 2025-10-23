'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Moon, Sun, Crown, Trophy, Medal, Award, Target, Clock, 
  Flame, CheckCircle2, XCircle, TrendingUp, Zap, Star,
  Home, RotateCcw, Share2, Download, Sparkles, ChevronRight
} from 'lucide-react';

export default function QuizResults() {
  const [isDark, setIsDark] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  const players = [
    { 
      id: 1, 
      name: 'Alex Thunder', 
      avatar: 'AT', 
      color: 'from-purple-500 to-pink-500',
      score: 950,
      correctAnswers: 9,
      wrongAnswers: 1,
      totalQuestions: 10,
      avgTime: 12.5,
      streak: 7,
      rank: 1,
      accuracy: 90,
      fastestAnswer: 5.2
    },
    { 
      id: 2, 
      name: 'Jordan Smith', 
      avatar: 'JS', 
      color: 'from-blue-500 to-cyan-500',
      score: 820,
      correctAnswers: 8,
      wrongAnswers: 2,
      totalQuestions: 10,
      avgTime: 15.2,
      streak: 5,
      rank: 2,
      accuracy: 80,
      fastestAnswer: 7.8
    },
    { 
      id: 3, 
      name: 'Casey Brown', 
      avatar: 'CB', 
      color: 'from-orange-500 to-red-500',
      score: 780,
      correctAnswers: 8,
      wrongAnswers: 2,
      totalQuestions: 10,
      avgTime: 18.7,
      streak: 4,
      rank: 3,
      accuracy: 80,
      fastestAnswer: 9.1
    },
    { 
      id: 4, 
      name: 'Sam Parker', 
      avatar: 'SP', 
      color: 'from-green-500 to-emerald-500',
      score: 710,
      correctAnswers: 7,
      wrongAnswers: 3,
      totalQuestions: 10,
      avgTime: 16.3,
      streak: 3,
      rank: 4,
      accuracy: 70,
      fastestAnswer: 8.5
    },
    { 
      id: 5, 
      name: 'Taylor Swift', 
      avatar: 'TS', 
      color: 'from-pink-500 to-rose-500',
      score: 680,
      correctAnswers: 7,
      wrongAnswers: 3,
      totalQuestions: 10,
      avgTime: 19.8,
      streak: 4,
      rank: 5,
      accuracy: 70,
      fastestAnswer: 10.2
    },
    { 
      id: 6, 
      name: 'Morgan Lee', 
      avatar: 'ML', 
      color: 'from-indigo-500 to-purple-500',
      score: 590,
      correctAnswers: 6,
      wrongAnswers: 4,
      totalQuestions: 10,
      avgTime: 20.1,
      streak: 2,
      rank: 6,
      accuracy: 60,
      fastestAnswer: 11.4
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
    : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';

  const cardBgClass = isDark
    ? 'bg-slate-900/90 border-slate-800'
    : 'bg-white/90 border-purple-200';

  const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-slate-300' : 'text-gray-600';

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Trophy className="w-8 h-8 text-yellow-400" />;
      case 2: return <Medal className="w-8 h-8 text-slate-400" />;
      case 3: return <Medal className="w-8 h-8 text-orange-400" />;
      default: return <Award className="w-7 h-7 text-blue-400" />;
    }
  };

  const getRankBadge = (rank) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 2: return 'bg-gradient-to-r from-slate-400 to-slate-500';
      case 3: return 'bg-gradient-to-r from-orange-500 to-red-500';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-500';
    }
  };

  const topThree = players.slice(0, 3);
  const restPlayers = players.slice(3);

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500`}>
      {/* Animated Background */}
      <motion.div
        className={`absolute top-20 left-10 w-96 h-96 ${
          isDark ? 'bg-purple-600' : 'bg-purple-300'
        } rounded-full mix-blend-multiply filter blur-3xl ${
          isDark ? 'opacity-20' : 'opacity-30'
        }`}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={`absolute top-40 right-10 w-96 h-96 ${
          isDark ? 'bg-blue-600' : 'bg-blue-300'
        } rounded-full mix-blend-multiply filter blur-3xl ${
          isDark ? 'opacity-20' : 'opacity-30'
        }`}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={`absolute bottom-20 left-1/2 w-96 h-96 ${
          isDark ? 'bg-pink-600' : 'bg-pink-300'
        } rounded-full mix-blend-multiply filter blur-3xl ${
          isDark ? 'opacity-20' : 'opacity-30'
        }`}
        animate={{
          x: [0, -50, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating Particles/Confetti */}
      {showConfetti && [...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-3 h-3 rounded-full`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            background: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#00CED1'][Math.floor(Math.random() * 5)]
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            ease: 'linear'
          }}
        />
      ))}

      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-4 rounded-2xl ${
          isDark
            ? 'bg-slate-800/80 hover:bg-slate-700/80'
            : 'bg-white/80 hover:bg-white/90'
        } backdrop-blur-lg shadow-xl border ${
          isDark ? 'border-slate-700' : 'border-purple-200'
        } transition-all duration-300`}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-purple-600" />
        )}
      </motion.button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl relative z-10"
      >
        <div className="space-y-8">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <motion.div
              className="relative inline-block"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-28 h-28 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-3xl shadow-2xl flex items-center justify-center">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <motion.div
                className="absolute -inset-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl opacity-20 blur-2xl"
                animate={{ 
                  scale: [1, 1.3, 1], 
                  opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
            
            <div>
              <motion.h1 
                className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%']
                }}
                style={{
                  backgroundSize: '200% auto'
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                Game Over!
              </motion.h1>
              <p className={`text-2xl md:text-3xl font-semibold ${textSecondaryClass}`}>
                🎉 Congratulations to all players!
              </p>
            </div>
          </motion.div>

          {/* Winner's Podium */}
          <motion.div variants={itemVariants}>
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl overflow-hidden`}>
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-3 gap-4 md:gap-6 items-end max-w-4xl mx-auto">
                  {/* 2nd Place */}
                  <motion.div
                    className="text-center"
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                      className="relative inline-block mb-4"
                    >
                      <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-slate-400 mx-auto shadow-xl">
                        <AvatarFallback className={`bg-gradient-to-br ${topThree[1].color} text-white text-2xl md:text-3xl font-bold`}>
                          {topThree[1].avatar}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div 
                        className="absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        2
                      </motion.div>
                    </motion.div>
                    <div className="h-32 md:h-40 bg-gradient-to-br from-slate-400 to-slate-500 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />
                      <Medal className="w-8 h-8 md:w-10 md:h-10 text-white mb-2 relative z-10" />
                      <p className="font-bold text-white text-sm md:text-base truncate px-2 max-w-full relative z-10">
                        {topThree[1].name}
                      </p>
                      <p className="text-white/90 text-xl md:text-2xl font-bold relative z-10">{topThree[1].score}</p>
                    </div>
                  </motion.div>

                  {/* 1st Place - Winner */}
                  <motion.div
                    className="text-center"
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                      className="relative inline-block mb-4"
                    >
                      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-yellow-400 mx-auto shadow-2xl">
                        <AvatarFallback className={`bg-gradient-to-br ${topThree[0].color} text-white text-3xl md:text-4xl font-bold`}>
                          {topThree[0].avatar}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        className="absolute -top-3 -right-3 w-14 h-14 md:w-16 md:h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <Crown className="w-7 h-7 md:w-9 md:h-9 text-white" />
                      </motion.div>
                    </motion.div>
                    <div className="h-48 md:h-56 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-t-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Trophy className="w-12 h-12 md:w-14 md:h-14 text-white mb-3 relative z-10" />
                      </motion.div>
                      <Badge className="bg-white/30 text-white mb-2 relative z-10 text-xs md:text-sm">
                        🏆 WINNER
                      </Badge>
                      <p className="font-bold text-white text-base md:text-lg truncate px-2 max-w-full relative z-10">
                        {topThree[0].name}
                      </p>
                      <p className="text-white text-2xl md:text-3xl font-bold relative z-10">{topThree[0].score}</p>
                    </div>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    className="text-center"
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                      className="relative inline-block mb-4"
                    >
                      <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-orange-400 mx-auto shadow-xl">
                        <AvatarFallback className={`bg-gradient-to-br ${topThree[2].color} text-white text-2xl md:text-3xl font-bold`}>
                          {topThree[2].avatar}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div 
                        className="absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-4 border-white"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        3
                      </motion.div>
                    </motion.div>
                    <div className="h-24 md:h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />
                      <Medal className="w-8 h-8 md:w-10 md:h-10 text-white mb-2 relative z-10" />
                      <p className="font-bold text-white text-sm md:text-base truncate px-2 max-w-full relative z-10">
                        {topThree[2].name}
                      </p>
                      <p className="text-white/90 text-xl md:text-2xl font-bold relative z-10">{topThree[2].score}</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Rankings */}
          <motion.div variants={itemVariants}>
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-3xl font-bold ${textPrimaryClass}`}>
                      Final Rankings
                    </CardTitle>
                    <CardDescription className={`text-lg ${textSecondaryClass} mt-2`}>
                      Complete player statistics and performance breakdown
                    </CardDescription>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <TrendingUp className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1), type: 'spring', stiffness: 100 }}
                    whileHover={{ scale: 1.02, x: 8 }}
                    className={`p-6 rounded-2xl border-2 ${
                      player.rank === 1
                        ? 'border-yellow-400 bg-yellow-500/10'
                        : player.rank === 2
                        ? 'border-slate-400 bg-slate-500/10'
                        : player.rank === 3
                        ? 'border-orange-400 bg-orange-500/10'
                        : isDark
                        ? 'border-slate-700 bg-slate-800/60'
                        : 'border-purple-200 bg-white'
                    } backdrop-blur-sm relative overflow-hidden group transition-all duration-300`}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${getRankBadge(player.rank)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                      {/* Player Header */}
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Rank Icon */}
                          <motion.div
                            whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="flex-shrink-0"
                          >
                            {getRankIcon(player.rank)}
                          </motion.div>

                          {/* Avatar */}
                          <Avatar className="w-16 h-16 border-2 border-white/20 flex-shrink-0">
                            <AvatarFallback className={`bg-gradient-to-br ${player.color} text-white text-xl font-bold`}>
                              {player.avatar}
                            </AvatarFallback>
                          </Avatar>

                          {/* Name & Score */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-bold text-xl md:text-2xl truncate ${textPrimaryClass}`}>
                                {player.name}
                              </p>
                              {player.rank === 1 && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                  👑 Champion
                                </Badge>
                              )}
                              {player.rank === 2 && (
                                <Badge className="bg-gradient-to-r from-slate-400 to-slate-500 text-white">
                                  🥈 Runner Up
                                </Badge>
                              )}
                              {player.rank === 3 && (
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                  🥉 Third Place
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Trophy className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                              <span className={`text-3xl font-bold ${textPrimaryClass}`}>
                                {player.score}
                              </span>
                              <span className={`text-lg ${textSecondaryClass}`}>points</span>
                            </div>
                          </div>
                        </div>

                        {/* Rank Badge */}
                        <motion.div
                          className={`w-16 h-16 rounded-2xl ${getRankBadge(player.rank)} flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0`}
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          #{player.rank}
                        </motion.div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* Accuracy */}
                        <div className={`p-4 rounded-xl ${
                          isDark ? 'bg-green-500/20' : 'bg-green-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                            <span className={`text-xs font-medium ${textSecondaryClass}`}>Accuracy</span>
                          </div>
                          <p className={`font-bold text-xl ${textPrimaryClass}`}>{player.accuracy}%</p>
                        </div>

                        {/* Correct */}
                        <div className={`p-4 rounded-xl ${
                          isDark ? 'bg-blue-500/20' : 'bg-blue-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <span className={`text-xs font-medium ${textSecondaryClass}`}>Correct</span>
                          </div>
                          <p className={`font-bold text-xl ${textPrimaryClass}`}>{player.correctAnswers}/{player.totalQuestions}</p>
                        </div>

                        {/* Wrong */}
                        <div className={`p-4 rounded-xl ${
                          isDark ? 'bg-red-500/20' : 'bg-red-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                            <span className={`text-xs font-medium ${textSecondaryClass}`}>Wrong</span>
                          </div>
                          <p className={`font-bold text-xl ${textPrimaryClass}`}>{player.wrongAnswers}</p>
                        </div>

                        {/* Avg Time */}
                        <div className={`p-4 rounded-xl ${
                          isDark ? 'bg-purple-500/20' : 'bg-purple-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                            <span className={`text-xs font-medium ${textSecondaryClass}`}>Avg Time</span>
                          </div>
                          <p className={`font-bold text-xl ${textPrimaryClass}`}>{player.avgTime}s</p>
                        </div>

                        {/* Fastest */}
                        <div className={`p-4 rounded-xl ${
                          isDark ? 'bg-cyan-500/20' : 'bg-cyan-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                            <span className={`text-xs font-medium ${textSecondaryClass}`}>Fastest</span>
                          </div>
                          <p className={`font-bold text-xl ${textPrimaryClass}`}>{player.fastestAnswer}s</p>
                        </div>

                        {/* Streak */}
                        <div className={`p-4 rounded-xl ${
                          isDark ? 'bg-orange-500/20' : 'bg-orange-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Flame className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                            <span className={`text-xs font-medium ${textSecondaryClass}`}>Streak</span>
                          </div>
                          <p className={`font-bold text-xl ${textPrimaryClass}`}>{player.streak}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Match Summary Stats */}
          <motion.div variants={itemVariants}>
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${textPrimaryClass}`}>
                  Match Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    className={`p-6 rounded-2xl ${
                      isDark ? 'bg-purple-500/20' : 'bg-purple-50'
                    } text-center`}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className={`w-10 h-10 mx-auto mb-3 ${
                        isDark ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                    </motion.div>
                    <p className={`text-3xl font-bold mb-1 ${textPrimaryClass}`}>10</p>
                    <p className={`text-sm ${textSecondaryClass}`}>Total Questions</p>
                  </motion.div>

                  <motion.div
                    className={`p-6 rounded-2xl ${
                      isDark ? 'bg-blue-500/20' : 'bg-blue-50'
                    } text-center`}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Trophy className={`w-10 h-10 mx-auto mb-3 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <p className={`text-3xl font-bold mb-1 ${textPrimaryClass}`}>
                      {players.length}
                    </p>
                    <p className={`text-sm ${textSecondaryClass}`}>Total Players</p>
                  </motion.div>

                  <motion.div
                    className={`p-6 rounded-2xl ${
                      isDark ? 'bg-green-500/20' : 'bg-green-50'
                    } text-center`}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Star className={`w-10 h-10 mx-auto mb-3 ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <p className={`text-3xl font-bold mb-1 ${textPrimaryClass}`}>
                      {Math.round(players.reduce((acc, p) => acc + p.accuracy, 0) / players.length)}%
                    </p>
                    <p className={`text-sm ${textSecondaryClass}`}>Avg Accuracy</p>
                  </motion.div>

                  <motion.div
                    className={`p-6 rounded-2xl ${
                      isDark ? 'bg-orange-500/20' : 'bg-orange-50'
                    } text-center`}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Clock className={`w-10 h-10 mx-auto mb-3 ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`} />
                    <p className={`text-3xl font-bold mb-1 ${textPrimaryClass}`}>
                      {Math.round(players.reduce((acc, p) => acc + p.avgTime, 0) / players.length)}s
                    </p>
                    <p className={`text-sm ${textSecondaryClass}`}>Avg Time</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-6 h-6 mr-3" />
              Play Again
            </Button>
            
            <Button
              variant="outline"
              className={`h-16 px-10 text-lg font-bold ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-white'
                  : 'border-purple-200 hover:bg-purple-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-6 h-6 mr-3" />
              Share Results
            </Button>

            <Button
              variant="outline"
              className={`h-16 px-10 text-lg font-bold ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-white'
                  : 'border-purple-200 hover:bg-purple-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-6 h-6 mr-3" />
              Home
            </Button>
          </motion.div>

          {/* Fun Facts / Achievements */}
          <motion.div variants={itemVariants}>
            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${textPrimaryClass} flex items-center gap-2`}>
                  <Star className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  Match Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <motion.div
                    className={`p-6 rounded-xl ${
                      isDark ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300'
                    }`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className={`font-bold text-lg mb-1 ${textPrimaryClass}`}>
                          Fastest Answer
                        </p>
                        <p className={textSecondaryClass}>
                          {players.reduce((prev, curr) => prev.fastestAnswer < curr.fastestAnswer ? prev : curr).name}
                        </p>
                        <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          {Math.min(...players.map(p => p.fastestAnswer))}s
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className={`p-6 rounded-xl ${
                      isDark ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/50' : 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300'
                    }`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Flame className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className={`font-bold text-lg mb-1 ${textPrimaryClass}`}>
                          Longest Streak
                        </p>
                        <p className={textSecondaryClass}>
                          {players.reduce((prev, curr) => prev.streak > curr.streak ? prev : curr).name}
                        </p>
                        <p className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                          {Math.max(...players.map(p => p.streak))} 🔥
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className={`p-6 rounded-xl ${
                      isDark ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300'
                    }`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className={`font-bold text-lg mb-1 ${textPrimaryClass}`}>
                          Best Accuracy
                        </p>
                        <p className={textSecondaryClass}>
                          {players.reduce((prev, curr) => prev.accuracy > curr.accuracy ? prev : curr).name}
                        </p>
                        <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          {Math.max(...players.map(p => p.accuracy))}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}