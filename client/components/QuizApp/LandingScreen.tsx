import { memo } from "react";
import { cardMotionProps, containerVariants, itemVariants } from "@/utility/hooks";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Hash, Sparkles, Trophy, UserPlus, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

// ============= LANDING PAGE COMPONENT =============
const LandingPage = memo(function LandingPage({ isDark, textPrimaryClass, textSecondaryClass, cardBgClass, onSelectOption }: { isDark: boolean, textPrimaryClass: string, textSecondaryClass: string, cardBgClass: string, onSelectOption: (option: "join" | "create" | "quick") => void }) {
 return <motion.div
    key="landing"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit={{ opacity: 0, scale: 0.98 }}
    className="space-y-8 py-10"
  >
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

      <motion.h1
        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight"
        style={{ backgroundSize: '200% auto' }}
      >
        NextQuiz
      </motion.h1>

      <p className={`text-lg md:text-xl ${textSecondaryClass} max-w-2xl mx-auto font-medium`}>
        Challenge your knowledge, compete with friends, and dominate the leaderboard!
      </p>

      <motion.div className="flex justify-center gap-3 flex-wrap" variants={itemVariants}>
        {[
          { icon: Zap, text: 'Lightning Fast', colorClass: 'text-yellow-400' },
          { icon: Crown, text: 'Competitive', colorClass: 'text-purple-400' },
          { icon: Users, text: 'Multiplayer', colorClass: 'text-blue-400' }
        ].map((badge, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-slate-800/80 border border-slate-700' : 'bg-white/80 border border-purple-200'
              } backdrop-blur-md shadow-md`}
            whileHover={{ scale: 1.03 }}
          >
            <badge.icon className={`w-4 h-4 ${badge.colorClass}`} />
            <span className={`text-sm font-semibold ${textPrimaryClass}`}>{badge.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>

    {/* Option Cards */}
    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 md:gap-8 px-4">
      <motion.div {...cardMotionProps} onClick={() => onSelectOption('join')} className="cursor-pointer group">
        <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl h-full overflow-hidden relative transition-all duration-300 ${isDark ? 'hover:border-purple-500' : 'hover:border-purple-400'
          }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="space-y-4 relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>
                Join Room
              </CardTitle>
              <CardDescription className={`text-sm md:text-base ${textSecondaryClass}`}>
                Have a room code? Jump right into the action with your friends
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`flex items-center justify-between p-4 md:p-5 ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'
              } rounded-xl group-hover:shadow-md transition-shadow`}>
              <span className={`${isDark ? 'text-purple-300' : 'text-purple-700'} font-bold text-base md:text-lg`}>
                Quick Join
              </span>
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <ArrowRight className={`${isDark ? 'text-purple-400' : 'text-purple-600'} w-5 h-5`} />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...cardMotionProps} onClick={() => onSelectOption('create')} className="cursor-pointer group">
        <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl h-full overflow-hidden relative transition-all duration-300 ${isDark ? 'hover:border-blue-500' : 'hover:border-blue-400'
          }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="space-y-4 relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>
                Create Match
              </CardTitle>
              <CardDescription className={`text-sm md:text-base ${textSecondaryClass}`}>
                Start fresh and invite friends to your personal quiz arena
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`flex items-center justify-between p-4 md:p-5 ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'
              } rounded-xl group-hover:shadow-md transition-shadow`}>
              <span className={`${isDark ? 'text-blue-300' : 'text-blue-700'} font-bold text-base md:text-lg`}>
                Be the Host
              </span>
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <ArrowRight className={`${isDark ? 'text-blue-400' : 'text-blue-600'} w-5 h-5`} />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...cardMotionProps} onClick={() => onSelectOption('quick')} className="cursor-pointer group">
        <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl h-full overflow-hidden relative transition-all duration-300 ${isDark ? 'hover:border-pink-500' : 'hover:border-pink-400'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="space-y-4 relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-md">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>
                Quick Play
              </CardTitle>
              <CardDescription className={`text-sm md:text-base ${textSecondaryClass}`}>
                Jump into an instant match — no setup, no wait.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`flex items-center justify-between p-4 md:p-5 ${isDark ? 'bg-pink-500/20' : 'bg-pink-50'} rounded-xl group-hover:shadow-md transition-shadow`}>
              <span className={`${isDark ? 'text-pink-300' : 'text-pink-700'} font-bold text-base md:text-lg`}>
                Instant Match
              </span>
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <ArrowRight className={`${isDark ? 'text-pink-400' : 'text-pink-600'} w-5 h-5`} />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>

    {/* Stats */}
    {/* <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto px-4">
      {[
        { label: 'Active Players', value: '10K+', icon: Users },
        { label: 'Daily Quizzes', value: '500+', icon: Trophy },
        { label: 'Win Rate', value: '95%', icon: Sparkles }
      ].map((stat, i) => (
        <motion.div
          key={i}
          className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800/60 border border-slate-700' : 'bg-white/60 border border-purple-200'
            } backdrop-blur-md text-center shadow-md`}
          whileHover={{ scale: 1.03, y: -4 }}
        >
          <stat.icon className={`w-6 h-6 mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <div className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>{stat.value}</div>
          <div className={`text-sm ${textSecondaryClass}`}>{stat.label}</div>
        </motion.div>
      ))}
    </motion.div> */}
  </motion.div>
});

export default LandingPage;