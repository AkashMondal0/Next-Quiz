'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface JoinRoomFormProps {
  onJoin?: (roomCode: string) => void
}

export default function JoinRoomForm({ onJoin }: JoinRoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ roomCode: string }>({
    defaultValues: { roomCode: '' },
  })

  const onSubmit = (data: { roomCode: string }) => {
    if (onJoin) {
      onJoin(data.roomCode)
    } else {
      console.log('Joining room:', data.roomCode)
    }
  }

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold text-white">Join Custom Room</h2>
      <p className="text-sm text-neutral-400 mt-1">
        Enter a room code to join an existing custom room.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col items-center mt-6"
      >
        <div className="space-y-1 w-full max-w-xs">
          <Input
            {...register('roomCode', { required: 'Room code is required' })}
            placeholder="Enter room code"
            className="bg-neutral-900 border border-neutral-700 text-white"
          />
          {errors.roomCode && (
            <p className="text-sm text-red-500">{errors.roomCode.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Joining...' : 'Join Room'}
        </Button>
      </form>
    </div>
  )
}
