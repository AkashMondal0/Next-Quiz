'use client'

import React, { useEffect, useContext, useCallback } from 'react'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { SocketContext } from '@/provider/socket-provider'
import StartMatchComponent from '@/components/room/StartMatchComponent'
import MatchmakingLoadingScreen from '@/components/quiz/MatchmakingLoadingScreen'
import { setRoomMatchMakingState } from '@/store/features/room/RoomSlice'


const Page = () => {
    const { reconnectSocket, disconnectSocket, connectSocket } = useContext(SocketContext)
    const roomMatchMakingState = useSelector((Root: RootState) => Root.RoomState.roomMatchMakingState)
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const router = useRouter()
    const dispatch = useDispatch()

    const handleStartMatchmaking = useCallback(async () => {
        try {
            connectSocket()
            const response = await api.post('/room/matchmaking', {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
                level: 2,
                roomSize: 2,
                prompt: {
                    topic: 'general knowledge',
                    numberOfQuestions: 10,
                    difficulty: 'medium'
                }
            })

            await new Promise(resolve => setTimeout(resolve, 1800))
            if (response.data.code) {
                router.replace(`/quiz/${response.data.code}`)
            }
        } catch (error: any) {
            toast.error('Failed to start matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            })
        }
    }, [connectSocket, session, router])

    const handleCancelMatchmaking = useCallback(async () => {
        try {
            reconnectSocket()
            dispatch(setRoomMatchMakingState(null))
            await api.post('/room/cancel-matchmaking', {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
                level: 2,
                roomSize: 2
            })
            // toast.success('Matchmaking cancelled successfully.')
        } catch (error: any) {
            toast.error('Failed to cancel matchmaking. Please try again later.', {
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

    return (
        <>
            {roomMatchMakingState ? <MatchmakingLoadingScreen
                data={roomMatchMakingState}
                cancelMatchmaking={handleCancelMatchmaking} /> :
                <StartMatchComponent handleStartMatchmaking={handleStartMatchmaking} />}
        </>
    );
}

export default Page;