'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Moon, Sun, Crown, Trophy, Timer, Target, TrendingUp,
  CheckCircle2, XCircle, Sparkles, Send, AlertCircle, Zap,
  Star, Clock, Users, BarChart3, Award, Home, RotateCcw
} from 'lucide-react';

// ============= TYPES =============
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  color: string;
  score: number;
  answered: number;
  isYou?: boolean;
}

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

interface QuestionCardProps {
  question: Question;
  qIndex: number;
  answers: Record<number, number>;
  submitted: boolean;
  isDark: boolean;
  textPrimaryClass: string;
  textSecondaryClass: string;
  cardBgClass: string;
  onAnswerChange: (questionId: number, answerIndex: number) => void;
}

interface PlayerCardProps {
  player: Player;
  index: number;
  isDark: boolean;
  textPrimaryClass: string;
  textSecondaryClass: string;
}

interface ResultsModalProps {
  score: number;
  questions: Question[];
  answers: Record<number, number>;
  answeredCount: number;
  sortedPlayers: Player[];
  isDark: boolean;
  textPrimaryClass: string;
  textSecondaryClass: string;
  cardBgClass: string;
  onClose: () => void;
  onTryAgain: () => void;
}

interface RankingsModalProps {
  players: Player[];
  isDark: boolean;
  textPrimaryClass: string;
  textSecondaryClass: string;
  cardBgClass: string;
  onClose: () => void;
}

// ============= THEME TOGGLE COMPONENT =============
const ThemeToggle: React.FC<ThemeToggleProps> = React.memo(({ isDark, onToggle }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3 }}
    onClick={onToggle}
    className={`fixed top-4 right-4 z-50 p-3 rounded-xl ${isDark ? 'bg-slate-800/90 hover:bg-slate-700' : 'bg-white/90 hover:bg-gray-50'
      } backdrop-blur-md shadow-lg border ${isDark ? 'border-slate-700' : 'border-purple-200'
      } transition-all duration-200`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    aria-label="Toggle theme"
  >
    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
  </motion.button>
));

// ============= QUESTION CARD COMPONENT =============
const QuestionCard: React.FC<QuestionCardProps> = React.memo(({
  question,
  qIndex,
  answers,
  submitted,
  isDark,
  textPrimaryClass,
  textSecondaryClass,
  cardBgClass,
  onAnswerChange
}) => {
  const isAnswered = answers[question.id] !== undefined;
  const isCorrect = submitted && answers[question.id] === question.correctAnswer;
  const isWrong = submitted && answers[question.id] !== undefined && answers[question.id] !== question.correctAnswer;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return isDark ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-green-100 text-green-700 border-green-300';
      case 'Medium': return isDark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Hard': return isDark ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-red-100 text-red-700 border-red-300';
      default: return isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: qIndex * 0.03 }}
    >
      <Card className={`${cardBgClass} border-2 backdrop-blur-sm shadow-lg ${isCorrect ? 'border-green-500 bg-green-500/5' :
          isWrong ? 'border-red-500 bg-red-500/5' :
            isAnswered ? isDark ? 'border-purple-500' : 'border-purple-400' : ''
        } transition-all duration-200`}>
        <CardHeader className="pb-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <motion.div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base ${isCorrect ? 'bg-green-500 text-white' :
                  isWrong ? 'bg-red-500 text-white' :
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-purple-100 text-purple-600'
                }`}
              whileHover={{ scale: 1.05 }}
            >
              {qIndex + 1}
            </motion.div>
            <Badge variant="secondary" className={`text-xs ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
              }`}>
              {question.category}
            </Badge>
            <Badge variant="outline" className={`text-xs border ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </Badge>
            <Badge variant="secondary" className={`text-xs ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
              }`}>
              {question.points} pts
            </Badge>

            {isAnswered && !submitted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500"
              >
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-xs font-semibold text-green-500">Done</span>
              </motion.div>
            )}

            {isCorrect && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold">Correct</span>
              </motion.div>
            )}

            {isWrong && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Wrong</span>
              </motion.div>
            )}
          </div>

          <CardTitle className={`text-lg md:text-xl leading-snug ${textPrimaryClass}`}>
            {question.question}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => !submitted && onAnswerChange(question.id, parseInt(value))}
            disabled={submitted}
            className="space-y-2"
          >
            {question.options.map((option, optIndex) => {
              const isSelected = answers[question.id] === optIndex;
              const isCorrectOption = optIndex === question.correctAnswer;
              const showCorrect = submitted && isCorrectOption;
              const showWrong = submitted && isSelected && !isCorrectOption;

              return (
                <motion.div
                  key={optIndex}
                  whileHover={!submitted ? { scale: 1.01, x: 4 } : {}}
                  whileTap={!submitted ? { scale: 0.99 } : {}}
                >
                  <Label
                    htmlFor={`q${question.id}-opt${optIndex}`}
                    className={`flex items-center p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${showCorrect ? 'border-green-500 bg-green-500/10' :
                        showWrong ? 'border-red-500 bg-red-500/10' :
                          isSelected ? isDark ? 'border-purple-500 bg-purple-500/10' : 'border-purple-400 bg-purple-50' :
                            isDark ? 'border-slate-700 hover:border-purple-500/50 bg-slate-800/40' : 'border-purple-200 hover:border-purple-300 bg-white'
                      } ${submitted ? 'cursor-not-allowed' : ''}`}
                  >
                    <RadioGroupItem
                      value={optIndex.toString()}
                      id={`q${question.id}-opt${optIndex}`}
                      className="mr-3"
                      disabled={submitted}
                    />
                    <span className={`flex-1 text-sm md:text-base font-medium ${textPrimaryClass}`}>
                      {option}
                    </span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" />}
                    {showWrong && <XCircle className="w-5 h-5 text-red-500 ml-2" />}
                  </Label>
                </motion.div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// ============= PLAYER CARD COMPONENT =============
const PlayerCard: React.FC<PlayerCardProps> = React.memo(({ player, index, isDark, textPrimaryClass, textSecondaryClass }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`p-3 rounded-lg ${player.isYou
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
        <AvatarFallback className={`bg-gradient-to-br ${player.color} text-white text-xs font-bold`}>
          {player.avatar}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className={`font-bold text-xs truncate ${textPrimaryClass}`}>
            {player.name}
          </p>
          {index === 0 && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className={textSecondaryClass}>{player.score} pts</span>
          <span className={textSecondaryClass}>•</span>
          <span className={textSecondaryClass}>{player.answered}/10</span>
        </div>
      </div>

      {player.isYou && (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0">
          You
        </Badge>
      )}
    </div>
  </motion.div>
));

// ============= RANKINGS MODAL =============
const RankingsModal: React.FC<RankingsModalProps> = React.memo(({
  players,
  isDark,
  textPrimaryClass,
  textSecondaryClass,
  cardBgClass,
  onClose
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <CardTitle className={`text-2xl ${textPrimaryClass}`}>
                Live Rankings
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
          <CardDescription className={textSecondaryClass}>
            Current player standings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {players.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                index={index}
                isDark={isDark}
                textPrimaryClass={textPrimaryClass}
                textSecondaryClass={textSecondaryClass}
              />
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
));

// ============= RESULTS MODAL =============
const ResultsModal: React.FC<ResultsModalProps> = React.memo(({
  score,
  questions,
  answers,
  answeredCount,
  sortedPlayers,
  isDark,
  textPrimaryClass,
  textSecondaryClass,
  cardBgClass,
  onClose,
  onTryAgain
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
        <CardHeader className="text-center space-y-4 pb-4">
          <motion.div
            className="inline-block"
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' }, scale: { duration: 1, repeat: Infinity } }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <CardTitle className={`text-3xl md:text-4xl font-black ${textPrimaryClass}`}>
            Quiz Complete!
          </CardTitle>
          <CardDescription className={`text-base ${textSecondaryClass}`}>
            Great job! Here are your results
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className={`p-6 rounded-xl bg-gradient-to-br ${isDark ? 'from-purple-500/20 to-pink-500/20' : 'from-purple-100 to-pink-100'
            } text-center`}>
            <p className={`text-sm mb-1 ${textSecondaryClass}`}>Final Score</p>
            <motion.p
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            >
              {score}
            </motion.p>
            <p className={`text-sm mt-1 ${textSecondaryClass}`}>
              out of {questions.reduce((sum, q) => sum + q.points, 0)} points
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-green-500/20' : 'bg-green-50'} text-center`}>
              <CheckCircle2 className={`w-6 h-6 mx-auto mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <p className={`text-2xl font-bold mb-0.5 ${textPrimaryClass}`}>
                {questions.filter(q => answers[q.id] === q.correctAnswer).length}
              </p>
              <p className={`text-xs ${textSecondaryClass}`}>Correct</p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-red-500/20' : 'bg-red-50'} text-center`}>
              <XCircle className={`w-6 h-6 mx-auto mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-2xl font-bold mb-0.5 ${textPrimaryClass}`}>
                {questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.correctAnswer).length}
              </p>
              <p className={`text-xs ${textSecondaryClass}`}>Wrong</p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'} text-center`}>
              <Target className={`w-6 h-6 mx-auto mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <p className={`text-2xl font-bold mb-0.5 ${textPrimaryClass}`}>
                {Math.round((questions.filter(q => answers[q.id] === q.correctAnswer).length / answeredCount) * 100) || 0}%
              </p>
              <p className={`text-xs ${textSecondaryClass}`}>Accuracy</p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-50'} text-center`}>
              <Trophy className={`w-6 h-6 mx-auto mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={`text-2xl font-bold mb-0.5 ${textPrimaryClass}`}>
                #{sortedPlayers.findIndex(p => p.isYou) + 1}
              </p>
              <p className={`text-xs ${textSecondaryClass}`}>Your Rank</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={onTryAgain}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className={`w-full h-12 text-base font-semibold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'
                }`}
            >
              Review Answers
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
));

// ============= MAIN COMPONENT =============
export default function QuizListPage() {
  const [isDark, setIsDark] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showRankings, setShowRankings] = useState(false);

  const questions: Question[] = useMemo(() => [
    { id: 1, question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correctAnswer: 2, category: "Geography", difficulty: "Easy", points: 10 },
    { id: 2, question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"], correctAnswer: 1, category: "Art", difficulty: "Medium", points: 15 },
    { id: 3, question: "What is the largest planet in our solar system?", options: ["Mars", "Saturn", "Jupiter", "Neptune"], correctAnswer: 2, category: "Science", difficulty: "Easy", points: 10 },
    { id: 4, question: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], correctAnswer: 2, category: "History", difficulty: "Medium", points: 15 },
    { id: 5, question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correctAnswer: 2, category: "Science", difficulty: "Hard", points: 20 },
    { id: 6, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: 1, category: "Science", difficulty: "Easy", points: 10 },
    { id: 7, question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correctAnswer: 1, category: "Literature", difficulty: "Medium", points: 15 },
    { id: 8, question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], correctAnswer: 2, category: "Mathematics", difficulty: "Hard", points: 20 },
  ], []);

  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'You', avatar: 'YO', color: 'from-purple-500 to-pink-500', score: 0, answered: 0, isYou: true },
    { id: 2, name: 'Alex Thunder', avatar: 'AT', color: 'from-blue-500 to-cyan-500', score: 420, answered: 8 },
    { id: 3, name: 'Jordan Smith', avatar: 'JS', color: 'from-green-500 to-emerald-500', score: 380, answered: 7 },
    { id: 4, name: 'Casey Brown', avatar: 'CB', color: 'from-orange-500 to-red-500', score: 350, answered: 7 },
  ]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  useEffect(() => {
    const answeredCount = Object.keys(answers).length;
    setPlayers(prev => {
      const updated = [...prev];
      updated[0] = { ...updated[0], answered: answeredCount };
      return updated.sort((a, b) => b.score - a.score);
    });
  }, [answers]);

  const handleAnswerChange = useCallback((questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  }, []);

  const handleSubmit = useCallback(() => {
    let totalScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        totalScore += q.points;
      }
    });

    setPlayers(prev => {
      const updated = [...prev];
      updated[0] = { ...updated[0], score: totalScore, answered: Object.keys(answers).length };
      return updated.sort((a, b) => b.score - a.score);
    });
    setScore(totalScore);
    setSubmitted(true);
  }, [questions, answers]);

  const handleTryAgain = useCallback(() => {
    window.location.reload();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
    : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';

  const cardBgClass = isDark
    ? 'bg-slate-900/90 border-slate-800'
    : 'bg-white/90 border-purple-200';

  const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-slate-300' : 'text-gray-600';

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const sortedPlayers = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className={`${cardBgClass} border-2 backdrop-blur-sm shadow-lg`}>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>
                    Quiz Challenge
                  </h1>
                  <p className={`text-sm ${textSecondaryClass}`}>
                    Answer all questions before time runs out!
                  </p>
                </div>

                <motion.div
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl ${timeLeft < 60
                      ? 'bg-red-500/20 border-2 border-red-500'
                      : isDark ? 'bg-slate-800 border-2 border-slate-700' : 'bg-purple-100 border-2 border-purple-300'
                    }`}
                  animate={timeLeft < 60 ? { scale: [1, 1.03, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Timer className={`w-6 h-6 ${timeLeft < 60 ? 'text-red-400' : isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div>
                    <p className={`text-xs ${textSecondaryClass}`}>Time</p>
                    <p className={`font-bold text-xl ${timeLeft < 60 ? 'text-red-400' : textPrimaryClass}`}>
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${textSecondaryClass}`}>
                    Progress: {answeredCount}/{questions.length}
                  </span>
                  <span className={`text-xs font-bold ${textPrimaryClass}`}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <Card className={`${cardBgClass} border backdrop-blur-sm`}>
            <CardContent className="p-3 text-center">
              <Trophy className={`w-5 h-5 mx-auto mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={`text-xl font-bold ${textPrimaryClass}`}>
                {submitted ? score : '--'}
              </p>
              <p className={`text-xs ${textSecondaryClass}`}>Score</p>
            </CardContent>
          </Card>

          <Card className={`${cardBgClass} border backdrop-blur-sm`}>
            <CardContent className="p-3 text-center">
              <Target className={`w-5 h-5 mx-auto mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <p className={`text-xl font-bold ${textPrimaryClass}`}>
                {answeredCount}
              </p>
              <p className={`text-xs ${textSecondaryClass}`}>Answered</p>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onClick={() => setShowRankings(true)}
            className={`h-full flex flex-col items-center justify-center gap-1 ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-purple-200 hover:bg-purple-50'
              }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-semibold">Rankings</span>
          </Button>
        </motion.div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {questions.map((question, qIndex) => (
            <QuestionCard
              key={question.id}
              question={question}
              qIndex={qIndex}
              answers={answers}
              submitted={submitted}
              isDark={isDark}
              textPrimaryClass={textPrimaryClass}
              textSecondaryClass={textSecondaryClass}
              cardBgClass={cardBgClass}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>

        {/* Submit Section */}
        {!submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=""
          >
            <Card className={`${cardBgClass} border-2 backdrop-blur-sm shadow-xl p-0`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {answeredCount < questions.length && (
                    <motion.div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg h-12 ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
                        }`}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AlertCircle className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <span className={`text-xs font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                        {questions.length - answeredCount} left
                      </span>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={answeredCount === 0}
                    className="flex-1 sm:flex-initial h-12 px-6 text-base font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit ({answeredCount}/{questions.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showRankings && (
          <RankingsModal
            players={sortedPlayers}
            isDark={isDark}
            textPrimaryClass={textPrimaryClass}
            textSecondaryClass={textSecondaryClass}
            cardBgClass={cardBgClass}
            onClose={() => setShowRankings(false)}
          />
        )}

        {submitted && (
          <ResultsModal
            score={score}
            questions={questions}
            answers={answers}
            answeredCount={answeredCount}
            sortedPlayers={sortedPlayers}
            isDark={isDark}
            textPrimaryClass={textPrimaryClass}
            textSecondaryClass={textSecondaryClass}
            cardBgClass={cardBgClass}
            onClose={() => setSubmitted(false)}
            onTryAgain={handleTryAgain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}