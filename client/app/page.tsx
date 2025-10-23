'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Users,
  Trophy,
  ArrowRight,
  Hash,
  UserPlus,
  Moon,
  Sun,
  Zap,
  Crown,
} from 'lucide-react';

// Optimized QuizApp
// - reduces runtime allocations
// - memoizes random values so they don't change every render
// - uses CSS keyframe animations for background blobs/particles where possible
// - minimizes framer-motion usage for expensive per-frame animations
// - splits out small components and uses useCallback/useMemo

const BLOBS = [
  { id: 'blob1', size: 384, left: '5%', top: '5%', animateDuration: 20 },
  { id: 'blob2', size: 384, right: '5%', top: '18%', animateDuration: 16 },
  { id: 'blob3', size: 384, left: '45%', bottom: '8%', animateDuration: 18 },
];

// Create a small stable set of particles with memoized positions
function useParticles(count = 12) {
  return useMemo(() => {
    const arr = Array.from({ length: count }).map((_, i) => ({
      id: `p-${i}`,
      left: `${Math.round(Math.random() * 100)}%`,
      top: `${Math.round(Math.random() * 100)}%`,
      delay: +(Math.random() * 2).toFixed(2),
      duration: 3 + Math.random() * 3,
      scale: 0.7 + Math.random() * 0.6,
      opacity: 0.08 + Math.random() * 0.25,
    }));
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
};

const cardMotionProps = {
  initial: 'hidden',
  animate: 'visible',
  whileHover: { scale: 1.02, y: -6 },
  whileTap: { scale: 0.98 },
  variants: {
    hidden: { scale: 0.98, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 140, damping: 18 } },
  },
};

export default function QuizApp() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isDark, setIsDark] = useState(true);

  const particles = useParticles(12);

  const toggleTheme = useCallback(() => setIsDark((s) => !s), []);
  const handleOptionSelect = useCallback((option) => setSelectedOption(option), []);
  const handleBack = useCallback(() => {
    setSelectedOption(null);
    setRoomCode('');
    setPlayerName('');
  }, []);

  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
    : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';

  const cardBgClass = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-purple-200';
  const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-slate-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500`}>
      {/* Background blobs - use CSS animation (lighter than continuous JS animation) */}
      {BLOBS.map((b, idx) => (
        <div
          key={b.id}
          className={`absolute rounded-full mix-blend-multiply filter blur-3xl ${isDark ? 'opacity-20' : 'opacity-30'}`}
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            right: b.right,
            top: b.top,
            bottom: b.bottom,
            background: isDark ? (idx === 0 ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : idx === 1 ? 'linear-gradient(135deg,#2563eb,#60a5fa)' : 'linear-gradient(135deg,#db2777,#f472b6)') : (idx === 0 ? 'linear-gradient(135deg,#c4b5fd,#fbcfe8)' : idx === 1 ? 'linear-gradient(135deg,#bfdbfe,#bfdbfe)' : 'linear-gradient(135deg,#fbcfe8,#fecaca)'),
            animation: `blobMove ${b.animateDuration}s ease-in-out ${idx % 2 === 0 ? 'infinite' : 'infinite reverse'}`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Particles - small circles, memoized positions */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${isDark ? 'bg-purple-400' : 'bg-purple-300'}`}
          style={{ left: p.left, top: p.top, width: 6 * p.scale, height: 6 * p.scale, opacity: p.opacity, willChange: 'transform, opacity' }}
          animate={{ y: [0, -18 * p.scale, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-2xl ${isDark ? 'bg-slate-800/80 hover:bg-slate-700/80' : 'bg-white/80 hover:bg-white/90'} backdrop-blur-lg shadow-lg border ${isDark ? 'border-slate-700' : 'border-purple-200'} transition-all duration-300`}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
      </motion.button>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {!selectedOption ? (
            <motion.div key="landing" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center space-y-6">
                <div className="flex justify-center items-center gap-4">
                  <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                    style={{ willChange: 'transform' }}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl shadow-2xl flex items-center justify-center">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl opacity-20 blur-xl" style={{ animation: 'pulse 3s infinite' }} />
                  </motion.div>
                </div>

                <motion.h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight" animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} style={{ backgroundSize: '200% auto' }}>
                  QuizMaster
                </motion.h1>

                <p className={`text-lg md:text-xl ${textSecondaryClass} max-w-2xl mx-auto font-medium`}>
                  Challenge your knowledge, compete with friends, and dominate the leaderboard!
                </p>

                <motion.div className="flex justify-center gap-3 flex-wrap" variants={itemVariants}>
                  {[{ icon: Zap, text: 'Lightning Fast', colorClass: 'text-yellow-400' }, { icon: Crown, text: 'Competitive', colorClass: 'text-purple-400' }, { icon: Users, text: 'Multiplayer', colorClass: 'text-blue-400' }].map((badge, i) => (
                    <motion.div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-slate-800/80 border border-slate-700' : 'bg-white/80 border border-purple-200'} backdrop-blur-md shadow-md`} whileHover={{ scale: 1.03 }}>
                      <badge.icon className={`w-4 h-4 ${badge.colorClass}`} />
                      <span className={`text-sm font-semibold ${textPrimaryClass}`}>{badge.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Option Cards */}
              <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 md:gap-8 px-4">
                <motion.div {...cardMotionProps} onClick={() => handleOptionSelect('join')} className="cursor-pointer group">
                  <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl h-full overflow-hidden relative transition-all duration-300 ${isDark ? 'hover:border-purple-500' : 'hover:border-purple-400'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="space-y-4 relative z-10">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                        <Hash className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>Join Room</CardTitle>
                        <CardDescription className={`text-sm md:text-base ${textSecondaryClass}`}>Have a room code? Jump right into the action with your friends</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className={`flex items-center justify-between p-4 md:p-5 ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'} rounded-xl group-hover:shadow-md transition-shadow`}>
                        <span className={`${isDark ? 'text-purple-300' : 'text-purple-700'} font-bold text-base md:text-lg`}>Quick Join</span>
                        <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                          <ArrowRight className={`${isDark ? 'text-purple-400' : 'text-purple-600'} w-5 h-5`} />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div {...cardMotionProps} onClick={() => handleOptionSelect('create')} className="cursor-pointer group">
                  <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl h-full overflow-hidden relative transition-all duration-300 ${isDark ? 'hover:border-blue-500' : 'hover:border-blue-400'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="space-y-4 relative z-10">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                        <UserPlus className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>Create Match</CardTitle>
                        <CardDescription className={`text-sm md:text-base ${textSecondaryClass}`}>Start fresh and invite friends to your personal quiz arena</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className={`flex items-center justify-between p-4 md:p-5 ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'} rounded-xl group-hover:shadow-md transition-shadow`}>
                        <span className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-bold text-base md:text-lg`}>Be the Host</span>
                        <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                          <ArrowRight className={`${isDark ? 'text-blue-400' : 'text-blue-600'} w-5 h-5`} />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
                {[{ label: 'Active Players', value: '10K+', icon: Users }, { label: 'Daily Quizzes', value: '500+', icon: Trophy }, { label: 'Win Rate', value: '95%', icon: Sparkles }].map((stat, i) => (
                  <motion.div key={i} className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800/60 border border-slate-700' : 'bg-white/60 border border-purple-200'} backdrop-blur-md text-center shadow-md`} whileHover={{ scale: 1.03, y: -4 }}>
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <div className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>{stat.value}</div>
                    <div className={`text-sm ${textSecondaryClass}`}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ type: 'spring', stiffness: 120 }} className="max-w-lg mx-auto px-4">
              <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl`}>
                <CardHeader className="space-y-4">
                  <motion.div initial={{ scale: 0.95, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }} className="relative">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${selectedOption === 'join' ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'} rounded-2xl flex items-center justify-center shadow-md`}>
                      {selectedOption === 'join' ? <Hash className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
                    </div>
                    <div className={`absolute -inset-2 bg-gradient-to-r ${selectedOption === 'join' ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'} rounded-2xl opacity-20 blur-xl`} style={{ animation: 'pulse 2.2s infinite' }} />
                  </motion.div>

                  <div>
                    <CardTitle className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>{selectedOption === 'join' ? 'Join Room' : 'Create Match'}</CardTitle>
                    <CardDescription className={`text-sm md:text-base ${textSecondaryClass}`}>{selectedOption === 'join' ? 'Enter the room code and your name to jump in' : 'Choose your name and get ready to host'}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={`text-base font-semibold ${textPrimaryClass}`}>Player Name</Label>
                    <Input id="name" placeholder="Enter your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className={`h-12 text-base ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-purple-200'}`} />
                  </div>

                  {selectedOption === 'join' && (
                    <div className="space-y-2">
                      <Label htmlFor="code" className={`text-base font-semibold ${textPrimaryClass}`}>Room Code</Label>
                      <Input id="code" placeholder="XXXXXX" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} maxLength={6} className={`h-12 text-lg tracking-widest uppercase text-center font-bold ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-purple-200'}`} />
                    </div>
                  )}

                  <div className="pt-3 space-y-2">
                    <Button className={`w-full h-12 text-base font-bold ${selectedOption === 'join' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'} shadow transition-all duration-200`} disabled={!playerName || (selectedOption === 'join' && roomCode.length !== 6)}>
                      {selectedOption === 'join' ? 'Join Room' : 'Create Match'} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>

                    <Button variant="outline" className={`w-full h-12 text-base font-semibold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'}`} onClick={handleBack}>
                      Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Minimal CSS-in-JS for animations (could be moved to external CSS file) */}
      <style jsx>{`
        @keyframes blobMove {
          0% {
            transform: translate3d(0,0,0) scale(1);
          }
          50% {
            transform: translate3d(20px, 30px, 0) scale(1.08);
          }
          100% {
            transform: translate3d(0,0,0) scale(1);
          }
        }
        @keyframes pulse {
          0% { opacity: 0.18; transform: scale(1); }
          50% { opacity: 0.28; transform: scale(1.06); }
          100% { opacity: 0.18; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
