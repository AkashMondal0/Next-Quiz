'use client'

import { motion } from 'framer-motion'
import { Users2Icon } from 'lucide-react'

interface CustomRoomButtonProps {
  onClick: () => void
  isLoading?: boolean
}

export default function CustomRoomButton({ onClick, isLoading }: CustomRoomButtonProps) {
  return (
    <motion.button
      className={`bg-neutral-800 border border-neutral-700 rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer  ${isLoading ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg hover:scale-[1.02]'
        }`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      onClick={onClick}
    >
      <Users2Icon className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
      <h2 className="text-xl font-semibold text-white">Create Custom Room</h2>
      <p className="text-sm text-neutral-400 mt-1">
        Create or join a private room with friends.
      </p>
    </motion.button>
  )
}
