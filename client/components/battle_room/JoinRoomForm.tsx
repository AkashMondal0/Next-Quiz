'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from "framer-motion"
import { useState } from "react";
import { SearchIcon } from 'lucide-react'

interface JoinRoomFormProps {
  onJoin?: (roomCode: string) => any
  isLoading?: boolean
}

export default function JoinRoomForm({ onJoin, isLoading: quickLoading }: JoinRoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ roomCode: string }>({
    defaultValues: { roomCode: '' },
  })
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: { roomCode: string }) => {
    setIsLoading(true)
    try {
      if (onJoin) {
        await onJoin(data.roomCode)
      } else {
        // console.log('Joining room:', data.roomCode)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className={`bg-neutral-800 border border-neutral-700 rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer  ${quickLoading ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg hover:scale-[1.02]'
        }`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <SearchIcon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
      <h2 className="text-2xl font-bold text-white">Join Custom Room</h2>
      <p className="text-sm text-neutral-400 mt-1">
        Enter a room code to join an existing custom room.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col items-center mt-6"
      >
        <div className="space-y-0.5 w-full max-w-xs">
          <Input
            {...register('roomCode', { required: 'Room code is required' })}
            placeholder="Enter room code"
            className="bg-neutral-900 border border-neutral-700 text-white rounded-xl"
          />
          {errors.roomCode && (
            <p className="text-sm text-red-500">{errors.roomCode.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="max-w-xs rounded-xl">
          {isLoading ? 'Joining...' : 'Join Room'}
        </Button>
      </form>
    </motion.div>
  )
}
