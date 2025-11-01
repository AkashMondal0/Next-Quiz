import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Moon, Sun, Trophy, Timer, Target, Zap, CheckCircle2,
    XCircle, Sparkles,
} from 'lucide-react';
import { RoomSession } from '@/types';
import Link from 'next/link';

export default function QuickMatchPage({ roomSession }: { roomSession: RoomSession }) {
    const [isDark, setIsDark] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);

    // ✅ New state for result modal
    const [showResults, setShowResults] = useState(false);

    const questions = useMemo(() => roomSession?.questions || [], [roomSession]);

    useEffect(() => {
        if (!answered && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
        if (timeLeft === 0 && !answered) {
            handleAnswerSelect(null);
        }
    }, [timeLeft, answered]);

    const handleAnswerSelect = useCallback((answerIndex: any) => {
        setSelectedAnswer(answerIndex);
        setAnswered(true);
        setShowAnswerFeedback(true);

        const q = questions[currentQuestion];
        const isCorrect = answerIndex === q?.correctAnswer;

        if (isCorrect) {
            const timeBonus = Math.floor(timeLeft * 2);
            const baseScore = 100;
            const streakBonus = streak * 10;
            setScore(prev => prev + baseScore + timeBonus + streakBonus);
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(q => q + 1);
                setSelectedAnswer(null);
                setAnswered(false);
                setTimeLeft(30);
                setShowAnswerFeedback(false);
            } else {
                // ✅ Show result modal when quiz ends
                setShowResults(true);
            }
        }, 2500);
    }, [questions, currentQuestion, timeLeft, streak]);

    const bgClass = isDark ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';
    const cardBgClass = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-purple-200';
    const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
    const textSecondaryClass = isDark ? 'text-slate-300' : 'text-gray-600';

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const isCorrect = selectedAnswer === currentQ?.correctAnswer;

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500`}>
            {/* CSS-based background blobs */}
            <div className={`absolute top-20 left-10 w-96 h-96 ${isDark ? 'bg-purple-600 opacity-20' : 'bg-purple-300 opacity-30'} rounded-full mix-blend-multiply blur-3xl animate-[floatBlob1_20s_linear_infinite]`} />
            <div className={`absolute top-40 right-10 w-96 h-96 ${isDark ? 'bg-blue-600 opacity-20' : 'bg-blue-300 opacity-30'} rounded-full mix-blend-multiply blur-3xl animate-[floatBlob2_18s_linear_infinite]`} />

            <div className='w-full max-w-7xl relative z-10'>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-12 gap-6"
                >
                    {/* Left Sidebar - Stats & Leaderboard */}
                    <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:pr-4">
                        {/* Player Stats Card */}
                        <motion.div variants={itemVariants}>
                            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
                                <CardHeader className="pb-3">
                                    <CardTitle className={`text-lg ${textPrimaryClass}`}>Your Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Trophy className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                                            <span className={`text-sm font-medium ${textSecondaryClass}`}>Score</span>
                                        </div>
                                        <p className={`text-3xl font-bold ${textPrimaryClass}`}>{score}</p>
                                    </div>

                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-50'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                                            <span className={`text-sm font-medium ${textSecondaryClass}`}>Streak</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className={`text-3xl font-bold ${textPrimaryClass}`}>{streak}</p>
                                            {streak > 0 && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                >
                                                    <span className="text-2xl">🔥</span>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                            <span className={`text-sm font-medium ${textSecondaryClass}`}>Progress</span>
                                        </div>
                                        <p className={`text-3xl font-bold ${textPrimaryClass}`}>
                                            {currentQuestion + 1}/{questions.length}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Main Content - Question */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Progress Header */}
                        <motion.div variants={itemVariants}>
                            <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-base font-bold">
                                                Question {currentQuestion + 1}/{questions.length}
                                            </Badge>
                                        </div>

                                        <motion.div
                                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${timeLeft < 10
                                                ? 'bg-red-500/20 border-2 border-red-500'
                                                : isDark ? 'bg-slate-800' : 'bg-purple-100'
                                                }`}
                                            animate={timeLeft < 10 ? { scale: [1, 1.05, 1] } : {}}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        >
                                            <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-400' : isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                                            <span className={`font-bold text-2xl ${timeLeft < 10 ? 'text-red-400' : textPrimaryClass}`}>
                                                {timeLeft}s
                                            </span>
                                        </motion.div>
                                    </div>
                                    <Progress value={progress} className="h-3 rounded-full" />
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Question Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
                                    <CardHeader className="space-y-6 pb-4">
                                        <motion.div
                                            className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Sparkles className="w-10 h-10 text-white" />
                                        </motion.div>
                                        <CardTitle className={`text-3xl md:text-5xl text-center leading-tight ${textPrimaryClass}`}>
                                            {currentQ.question}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-6">
                                        {currentQ.options.map((option, index) => {
                                            const isCorrectAnswer = index === currentQ.correctAnswer;
                                            const isSelected = selectedAnswer === index;
                                            const showResult = answered;

                                            let buttonClass = '';
                                            let borderClass = '';

                                            if (showResult) {
                                                if (isCorrectAnswer) {
                                                    buttonClass = 'bg-green-500/20';
                                                    borderClass = 'border-green-500';
                                                } else if (isSelected && !isCorrectAnswer) {
                                                    buttonClass = 'bg-red-500/20';
                                                    borderClass = 'border-red-500';
                                                } else {
                                                    borderClass = isDark ? 'border-slate-700' : 'border-purple-200';
                                                }
                                            } else {
                                                borderClass = isDark ? 'border-slate-700 hover:border-purple-500' : 'border-purple-200 hover:border-purple-400';
                                            }

                                            return (
                                                <motion.button
                                                    key={index}
                                                    onClick={() => !answered && handleAnswerSelect(index)}
                                                    disabled={answered}
                                                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 ${buttonClass} ${borderClass} ${answered
                                                        ? 'cursor-not-allowed'
                                                        : isDark
                                                            ? 'bg-slate-800/60 hover:bg-purple-500/10'
                                                            : 'bg-white hover:bg-purple-50'
                                                        }`}
                                                    whileHover={!answered ? { scale: 1.02, x: 10 } : {}}
                                                    whileTap={!answered ? { scale: 0.98 } : {}}
                                                    initial={{ opacity: 0, x: -50 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <motion.div
                                                                className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${showResult && isCorrectAnswer
                                                                    ? 'bg-green-500 text-white'
                                                                    : showResult && isSelected && !isCorrectAnswer
                                                                        ? 'bg-red-500 text-white'
                                                                        : isDark
                                                                            ? 'bg-slate-700 text-slate-300'
                                                                            : 'bg-purple-100 text-purple-600'
                                                                    }`}
                                                                whileHover={!answered ? { rotate: [0, -5, 5, 0] } : {}}
                                                            >
                                                                {String.fromCharCode(65 + index)}
                                                            </motion.div>
                                                            <span className={`text-xl font-medium ${textPrimaryClass}`}>
                                                                {option}
                                                            </span>
                                                        </div>
                                                        <AnimatePresence>
                                                            {showResult && isCorrectAnswer && (
                                                                <motion.div
                                                                    initial={{ scale: 0, rotate: -180 }}
                                                                    animate={{ scale: 1, rotate: 0 }}
                                                                    exit={{ scale: 0 }}
                                                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                                                >
                                                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                                </motion.div>
                                                            )}
                                                            {showResult && isSelected && !isCorrectAnswer && (
                                                                <motion.div
                                                                    initial={{ scale: 0, rotate: -180 }}
                                                                    animate={{ scale: 1, rotate: 0 }}
                                                                    exit={{ scale: 0 }}
                                                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                                                >
                                                                    <XCircle className="w-10 h-10 text-red-500" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </AnimatePresence>

                        {/* Answer Feedback */}
                        <AnimatePresence>
                            {showAnswerFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                >
                                    <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl overflow-hidden ${isCorrect
                                        ? 'border-green-500 bg-green-500/10'
                                        : 'border-red-500 bg-red-500/10'
                                        }`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <motion.div
                                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                    animate={{ rotate: [0, 360] }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    {isCorrect ? (
                                                        <CheckCircle2 className="w-10 h-10 text-white" />
                                                    ) : (
                                                        <XCircle className="w-10 h-10 text-white" />
                                                    )}
                                                </motion.div>
                                                <div className="flex-1">
                                                    <h3 className={`text-2xl font-bold mb-1 ${isCorrect ? 'text-green-500' : 'text-red-500'
                                                        }`}>
                                                        {isCorrect ? '🎉 Correct!' : '😔 Wrong Answer'}
                                                    </h3>
                                                    <p className={textSecondaryClass}>
                                                        {isCorrect
                                                            ? `+${100 + Math.floor(timeLeft * 2) + (streak * 10)} points! ${streak > 2 ? `🔥 ${streak} streak!` : ''}`
                                                            : `The correct answer was: ${currentQ.options[currentQ.correctAnswer]}`
                                                        }
                                                    </p>
                                                </div>
                                                {isCorrect && streak > 2 && (
                                                    <motion.div
                                                        animate={{
                                                            scale: [1, 1.2, 1],
                                                            rotate: [0, 10, -10, 0]
                                                        }}
                                                        transition={{ duration: 0.5, repeat: Infinity }}
                                                        className="text-4xl"
                                                    >
                                                        🔥
                                                    </motion.div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ✅ Result Modal */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div
                            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                <Card className={`${cardBgClass} border-2 shadow-2xl w-[90vw] max-w-md text-center p-6`}>
                                    <CardHeader>
                                        <CardTitle className={`text-3xl font-bold ${textPrimaryClass}`}>
                                            Quiz Completed 🎉
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className={`text-xl ${textSecondaryClass}`}>
                                            Final Score: <span className={`font-bold ${textPrimaryClass}`}>{score}</span>
                                        </p>
                                        <p className={`text-lg ${textSecondaryClass}`}>
                                            Longest Streak: <span className={`font-bold ${textPrimaryClass}`}>{streak}</span>
                                        </p>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                // simple reset
                                                setShowResults(false);
                                                setCurrentQuestion(0);
                                                setScore(0);
                                                setStreak(0);
                                                setTimeLeft(30);
                                                setAnswered(false);
                                                setSelectedAnswer(null);
                                            }}
                                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${isDark
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                                                }`}
                                        >
                                            Play Again
                                        </motion.button>
                                        <Link href="/" passHref className='mx-2'>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${isDark
                                                    ? 'bg-slate-600 hover:bg-slate-700 text-white'
                                                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                                                    }`}
                                            >
                                                Home
                                            </motion.button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}