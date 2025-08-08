'use client'

import React, { useEffect, useContext, useCallback, useState } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { SocketContext } from '@/provider/socket-provider'
import { setRoomMatchMakingState } from '@/store/features/room/RoomSlice'
import dynamic from 'next/dynamic'
import { QuizBattleFormData } from '@/types/quizBattle'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const MatchmakingLoadingScreen = dynamic(() => import('@/components/quiz/MatchmakingLoadingScreen'), { ssr: false })
const LoginComponent = dynamic(() => import('@/components/quiz/LoginComponent'), { ssr: false })
const SelectMatchComponent = dynamic(() => import('@/components/room/SelectMatchComponent'), { ssr: false })


const Page = () => {
    const { reconnectSocket, disconnectSocket, connectSocket } = useContext(SocketContext)
    const roomMatchMakingState = useSelector((Root: RootState) => Root.RoomState.roomMatchMakingState)
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const router = useRouter()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleStartMatchmaking = useCallback(async (roomSize: number = 2, formData: QuizBattleFormData = {
        topic: "General Knowledge",
        difficulty: "medium",
        numberOfQuestions: 2,
        participantLimit: roomSize
    }) => {
        if (!session || !session.id || !session.username) {
            toast.error('You must be logged in to start matchmaking.')
            return
        }
        try {
            connectSocket()
            const response = await api.post('/room/matchmaking', {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
                level: 1,
                roomSize: roomSize,
                prompt: formData
            })

            await new Promise(resolve => setTimeout(resolve, 1800))
            if (response.data.code) {
                router.push(`/quiz/${response.data.code}`)
            }
        } catch (error: any) {
            toast.error('Failed to start matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            })
        }
    }, [connectSocket, session, router])

    const handleCancelMatchmaking = useCallback(async (roomSize: number = 2) => {
        try {
            reconnectSocket()
            dispatch(setRoomMatchMakingState(null))
            await api.post('/room/cancel-matchmaking', {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
                level: 1,
                roomSize: roomSize
            })
        } catch (error: any) {
            toast.error('Failed to cancel matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            })
        }
    }, [session, router])

    const handleCustomRoom = useCallback(async (roomSize: number = 2, formData: QuizBattleFormData = {
        topic: "General Knowledge",
        difficulty: "medium",
        numberOfQuestions: 2,
        participantLimit: roomSize
    }) => {
        if (!session || !session.id || !session.username) {
            toast.error('You must be logged in to start matchmaking.')
            return
        }
        try {
            setLoading(true)
            const response = await api.post('/room/custom', {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
                level: 1,
                roomSize: roomSize,
                prompt: formData
            })

            await new Promise(resolve => setTimeout(resolve, 1800))
            if (response.data.code) {
                router.push(`/quiz/room/${response.data.code}`)
            }
        } catch (error: any) {
            toast.error('Failed to start matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            })
        }
    }, [connectSocket, session, router])

    const handleJoinCustomRoom = useCallback(async (input: string) => {
        if (!session || !session.id || !session.username) {
            toast.error('You must be logged in to join a custom room.')
            return
        }
        try {
            const res = await api.post(`/room/custom-join/${input}`, {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
            })
            if (res.data.code) {
                router.push(`/quiz/room/${res.data.code}`)
            }
        } catch (error: any) {
            toast.error('Failed to start matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            })
        }
    }, [session, router])

    useEffect(() => {
        const handleBeforeUnload = () => {
            disconnectSocket()
            handleCancelMatchmaking()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            disconnectSocket()
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (roomMatchMakingState?.status === "ready") {
                router.replace(`/quiz/${roomMatchMakingState.code}`)
            }
        }, 1800)

        return () => clearTimeout(timer)
    }, [roomMatchMakingState, router])

    if (!session || !session.id || !session.username) {
        return (
            <LoginComponent />
        );
    }

    if (loading) {
        return <QuizGenerationLoader />;
    }

    return (
        <div className="min-h-screen h-screen bg-gradient-to-br from-black via-neutral-900 to-black">
            {roomMatchMakingState ?
                <MatchmakingLoadingScreen data={roomMatchMakingState} cancelMatchmaking={handleCancelMatchmaking} />
                :
                <SelectMatchComponent handleStartMatchmaking={handleStartMatchmaking}
                    handleCustomRoom={handleCustomRoom}
                    handleJoinCustomRoom={handleJoinCustomRoom}
                />}
        </div>
    );
}

export default Page;


function QuizGenerationLoader({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-6 min-h-screen h-screen bg-gradient-to-br from-black via-neutral-900 to-black", className)}>
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center gap-2"
            >
                <Sparkles className="h-6 w-6 text-stone-400 animate-pulse" />
                <p className="text-lg font-semibold tracking-wide relative overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-stone-400 via-white to-stone-400 animate-shine">
                    Generating Your Quiz...
                </p>
            </motion.div>

            <motion.div
                className="flex gap-1 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {[...Array(3)].map((_, i) => (
                    <motion.span
                        key={i}
                        className="h-2.5 w-2.5 rounded-full bg-stone-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </motion.div>
        </div>
    )
}
