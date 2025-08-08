'use client'

import React, { useEffect, useContext, useCallback } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { SocketContext } from '@/provider/socket-provider'
import { setRoomMatchMakingState } from '@/store/features/room/RoomSlice'
import dynamic from 'next/dynamic'
import { QuizBattleFormData } from '@/types'

const MatchmakingLoadingScreen = dynamic(() => import('@/components/quiz/MatchmakingLoadingScreen'), { ssr: false })
const LoginComponent = dynamic(() => import('@/components/quiz/LoginComponent'), { ssr: false })
const SelectMatchComponent = dynamic(() => import('@/components/room/SelectMatchComponent'), { ssr: false })


const Page = () => {
    const { reconnectSocket, disconnectSocket, connectSocket } = useContext(SocketContext)
    const roomMatchMakingState = useSelector((Root: RootState) => Root.RoomState.roomMatchMakingState)
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const router = useRouter()
    const dispatch = useDispatch()

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

    return (
        <div className="min-h-screen h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-6">
            {roomMatchMakingState ?
                <MatchmakingLoadingScreen data={roomMatchMakingState} cancelMatchmaking={handleCancelMatchmaking} />
                :
                <SelectMatchComponent handleStartMatchmaking={handleStartMatchmaking} handleCustomRoom={handleCustomRoom} />}
        </div>
    );
}

export default Page;