'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuizBattleFormData } from '@/types'
import MatchSettingsForm from '../battle_room/MatchSettingsForm'
import JoinRoomForm from '../battle_room/JoinRoomForm'
import CustomRoomButton from '../battle_room/CustomRoomButton'

export default function QuizBattleComponent({
    handleCustomRoom,
    loading,
    handleJoinCustomRoom
}: {
    handleCustomRoom: (formData: QuizBattleFormData) => void
    loading: boolean
    handleJoinCustomRoom: (input: string) => void
}) {
    const [mode, setMode] = useState<'main' | 'custom' | 'customRoom'>('main')


    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-xl w-full space-y-6 text-center py-16 ">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold text-white"
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
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mt-10">
                            <CustomRoomButton
                                isLoading={loading}
                                onClick={() => setMode('customRoom')}
                            />
                        </div>

                        <JoinRoomForm onJoin={handleJoinCustomRoom} isLoading={loading} />
                    </>
                )}

                {mode !== 'main' && (
                    <MatchSettingsForm
                        type={mode}
                        onSubmit={handleCustomRoom}
                        onBack={() => setMode('main')}
                    />
                )}
            </div>
        </main>
    )
}



//     const handleStartMatchmaking = useCallback(async (formData: QuizBattleFormData = {
//     topic: "General Knowledge",
//     difficulty: "medium",
//     numberOfQuestions: 2,
//     participantLimit: 2
// }) => {
//     if (!session || !session.id || !session.username) {
//         toast.error('You must be logged in to start matchmaking.')
//         return
//     }
//     try {
//         connectSocket()
//         const response = await api.post('/room/matchmaking', {
//             user: {
//                 id: session?.id,
//                 username: session?.username,
//                 avatar: ''
//             },
//             level: 1,
//             prompt: formData
//         })

//         await new Promise(resolve => setTimeout(resolve, 1800))
//         if (response.data.code) {
//             router.push(`/quiz/${response.data.code}`)
//         }
//     } catch (error: any) {
//         toast.error('Failed to start matchmaking. Please try again later.', {
//             description: error?.response?.data?.message || 'An unexpected error occurred.'
//         })
//     }
// }, [connectSocket, session, router])

// const handleCancelMatchmaking = useCallback(async () => {
//     try {
//         reconnectSocket()
//         dispatch(setRoomMatchMakingState(null))
//         await api.post('/room/cancel-matchmaking', {
//             user: {
//                 id: session?.id,
//                 username: session?.username,
//                 avatar: ''
//             },
//             level: 1,
//         })
//     } catch (error: any) {
//         toast.error('Failed to cancel matchmaking. Please try again later.', {
//             description: error?.response?.data?.message || 'An unexpected error occurred.'
//         })
//     }
// }, [session, router])
