'use client';
import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Trophy, Timer, Target, Send, AlertCircle, BarChart3,
} from 'lucide-react';
import { MatchRanking, Player, Question, TemporaryUser } from '@/types';
import QuestionCard from './QuestionCard';
import RankingsModal from './RankingsModal';
import ResultsModal from './ResultsModal';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchRoomSession } from '@/store/features/account/Api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import useSocket from '@/hooks/socketHook';
import { rankingActivity } from '@/store/features/account/AccountSlice';


// ============= MAIN COMPONENT =============
export default function QuizListPage() {
  const [isDark, setIsDark] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  const roomSession = useAppSelector((state) => state.AccountState.roomSession);
  const [localData] = useLocalStorage<TemporaryUser>("username");
  const checkedInput = useRef<number[]>([]);
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const [timeLeft, setTimeLeft] = useState((roomSession?.duration ? roomSession?.duration * 60 : 300)); // default to 5 minutes
  const questions: Question[] = useMemo(() => [
    { id: 1, question: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], correctAnswer: 2, points: 10 },
    { id: 2, question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"], correctAnswer: 1, category: "Art", difficulty: "Medium", points: 15 },
    { id: 3, question: "What is the largest planet in our solar system?", options: ["Mars", "Saturn", "Jupiter", "Neptune"], correctAnswer: 2, category: "Science", difficulty: "Easy", points: 10 },
    { id: 4, question: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], correctAnswer: 2, category: "History", difficulty: "Medium", points: 15 },
    { id: 5, question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correctAnswer: 2, category: "Science", difficulty: "Hard", points: 20 },
    { id: 6, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: 1, category: "Science", difficulty: "Easy", points: 10 },
    { id: 7, question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correctAnswer: 1, category: "Literature", difficulty: "Medium", points: 15 },
    { id: 8, question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], correctAnswer: 2, category: "Mathematics", difficulty: "Hard", points: 20 },
  ], []);

  const players = roomSession?.matchRanking

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
    // setPlayers(prev => {
    //   const updated = [...prev];
    //   updated[0] = { ...updated[0], answered: answeredCount };
    //   return updated.sort((a, b) => b.score - a.score);
    // });
  }, [answers]);

  useLayoutEffect(() => {
    if (!roomSession?.id) return;
    dispatch(fetchRoomSession(roomSession?.id) as any);
  }, [roomSession?.id]);

  const handleAnswerChange = useCallback((questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    if (checkedInput.current.includes(questionId) || !localData?.id || !roomSession?.id) return;
    checkedInput.current.push(questionId);
    socket.sendDataToServer('ranking-activity', {
      playerId: localData?.id,
      roomCode: roomSession?.id,
      answeredCount: checkedInput.current.length,
      members: roomSession?.players.map(p => p.id).filter(id => id !== localData?.id),
    });
    dispatch(rankingActivity({
      playerId: localData?.id,
      roomCode: roomSession?.id,
      answeredCount: checkedInput.current.length,
    }));
    // send socket event here if needed
  }, [localData?.id, roomSession?.id, socket]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    let totalScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        totalScore += q.points;
      }
    });

    // setPlayers(prev => {
    //   const updated = [...prev];
    //   updated[0] = { ...updated[0], score: totalScore, answered: Object.keys(answers).length };
    //   return updated.sort((a, b) => b.score - a.score);
    // });
    setScore(totalScore);
    setSubmitted(true);
    const data = {
      userAnswers: answers,
      score: totalScore,
      timeTaken: 300 - timeLeft,
      CorrectAnswers: questions.reduce((acc, q) => {
        if (answers[q.id] === q.correctAnswer) {
          acc += 1;
        }
        return acc;
      }, 0),
      WrongAnswers: Object.keys(answers).length - Object.values(answers).filter((ans, idx) => ans === questions[idx].correctAnswer).length,
    };
    console.log('Data to submit:', data);
  }, [answers, questions, submitted, timeLeft]);

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
  const sortedPlayers = useMemo(() => [...players ?? []].sort((a, b) => b.score - a.score), [players]);

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} /> */}

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