import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Question } from '@/types';

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

// ============= QUESTION CARD =============
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
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base ${isCorrect ? 'bg-green-500 text-white' :
                isWrong ? 'bg-red-500 text-white' :
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-purple-100 text-purple-600'
                }`}
              whileHover={{ scale: 1.05 }}
            >
              {qIndex + 1}
            </motion.div>

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

export default QuestionCard;