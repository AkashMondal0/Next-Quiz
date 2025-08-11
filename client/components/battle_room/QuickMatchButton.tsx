'use client'

import { motion } from 'framer-motion'
import { RocketIcon, Loader2 } from 'lucide-react'
import { QuizBattleFormData } from '@/types'

interface QuickMatchButtonProps {
  isLoading: boolean
  onClick: (formData: QuizBattleFormData) => void
  roomSize: number
}

export default function QuickMatchButton({ isLoading, onClick }: QuickMatchButtonProps) {
  // minimal placeholder form data — could be passed from parent for customization
  const defaultFormData: QuizBattleFormData = {
    topic: 'JavaScript General Knowledge',
    difficulty: 'easy',
    numberOfQuestions: 10,
    participantLimit: 2,
    roomCode: '',
    matchDuration: 0
  }

  return (
    <motion.button
      className={`bg-neutral-800 border border-neutral-700 rounded-2xl p-6 transition-all cursor-pointer ${isLoading ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg hover:scale-[1.02]'
        }`}
      onClick={() => onClick(defaultFormData)}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      {isLoading ? (
        <Loader2 className="w-8 h-8 mx-auto mb-3 text-green-400 animate-spin" />
      ) : (
        <RocketIcon className="w-8 h-8 mx-auto mb-3 text-green-400" />
      )}
      <h2 className="text-xl font-semibold text-white">
        {isLoading ? 'Matching...' : 'Quick Match'}
      </h2>
      <p className="text-sm text-neutral-400 mt-1">
        {isLoading
          ? 'Searching for random topics and players...'
          : 'Instantly match with a random player and topic.'}
      </p>
    </motion.button>
  )
}
