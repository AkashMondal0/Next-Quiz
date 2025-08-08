'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuizBattleFormData } from '@/types'
import RoomSizeSelector from '../quiz/RoomSizeSelector'
import MatchSettingsForm from '../quiz/MatchSettingsForm'
import QuickMatchButton from '../quiz/QuickMatchButton'
import JoinRoomForm from '../quiz/JoinRoomForm'
import CustomRoomButton from '../quiz/CustomRoomButton'
import { toast } from 'sonner'

export default function QuizBattleComponent({
    handleStartMatchmaking,
    handleCustomRoom,
    handleJoinCustomRoom
}: {
    handleStartMatchmaking: (roomSize: number, formData: QuizBattleFormData) => void
    handleCustomRoom: (roomSize: number, formData: QuizBattleFormData) => void
    handleJoinCustomRoom: (input: string) => void
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [roomSize, setRoomSize] = useState(2)
    const [mode, setMode] = useState<'main' | 'custom' | 'customRoom'>('main')

    const handleQuickMatch = (formData: QuizBattleFormData) => {
        setIsLoading(true)
        handleStartMatchmaking(roomSize, formData)
    }

    const handleRoomCreation = (formData: QuizBattleFormData) => {
        handleCustomRoom(roomSize, formData)
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-xl w-full space-y-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold"
                >
                    🧠 Quiz Battle Arena
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-neutral-400"
                >
                    Choose a mode to test your knowledge against others.
                </motion.p>

                {mode === 'main' && (
                    <>
                        <RoomSizeSelector
                            roomSize={roomSize}
                            setRoomSize={setRoomSize}
                            disabled={isLoading}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                            <QuickMatchButton
                                isLoading={isLoading}
                                onClick={() => {
                                    toast.message('Coming Soon!')
                                    // handleQuickMatch()
                                }}
                            />
                            <CustomRoomButton
                                onClick={() => setMode('customRoom')}
                            />
                        </div>

                        <JoinRoomForm onJoin={handleJoinCustomRoom} />
                    </>
                )}

                {mode !== 'main' && (
                    <MatchSettingsForm
                        type={mode}
                        onSubmit={(data) =>
                            mode === 'customRoom'
                                ? handleRoomCreation(data)
                                : handleQuickMatch(data)
                        }
                        onBack={() => setMode('main')}
                    />
                )}
            </div>
        </main>
    )
}
