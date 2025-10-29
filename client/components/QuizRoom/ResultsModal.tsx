import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { MatchRanking, Player, Question } from '@/types';

interface ResultsModalProps {
  score: number;
  questions: Question[];
  answers: Record<number, number>;
  answeredCount: number;
  sortedPlayers: MatchRanking[];
  isDark: boolean;
  textPrimaryClass: string;
  textSecondaryClass: string;
  cardBgClass: string;
  onClose: () => void;
  onTryAgain: () => void;
}
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <CardTitle className={`text-3xl md:text-4xl font-black ${textPrimaryClass}`}>
            Quiz Complete!
          </CardTitle>
          <CardDescription className={`text-base ${textSecondaryClass}`}>
            Great job! Here are your results
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className={`p-6 rounded-xl bg-gradient-to-br ${isDark ? 'from-purple-500/20 to-pink-500/20' : 'from-purple-100 to-pink-100'} text-center`}>
            <p className={`text-sm mb-1 ${textSecondaryClass}`}>Final Score</p>
            <p className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {score}
            </p>
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
          </div>

          {/* === Review Section === */}
          <div className="mt-6 space-y-4">
            <h3 className={`text-lg font-bold ${textPrimaryClass}`}>Answer Review</h3>
            <div className="space-y-3">
              {questions.map((q) => {
                const userAnswerIndex = answers[q.id];
                const isCorrect = userAnswerIndex === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border ${isCorrect
                      ? isDark ? 'border-green-500/50 bg-green-500/10' : 'border-green-300 bg-green-50'
                      : isDark ? 'border-red-500/50 bg-red-500/10' : 'border-red-300 bg-red-50'
                      }`}
                  >
                    <p className={`font-semibold mb-1 ${textPrimaryClass}`}>{q.question}</p>
                    <p className={`text-sm ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? '✅ Correct' : '❌ Wrong'}
                    </p>
                    <p className={`text-xs mt-1 ${textSecondaryClass}`}>
                      Your answer: <span className="font-medium">{q.options[userAnswerIndex] ?? 'Not answered'}</span>
                    </p>
                    {!isCorrect && (
                      <p className={`text-xs ${textSecondaryClass}`}>
                        Correct answer: <span className="font-medium">{q.options[q.correctAnswer]}</span>
                      </p>
                    )}
                  </div>
                );
              })}
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
              className={`w-full h-12 text-base font-semibold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'}`}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
));

export default ResultsModal;

