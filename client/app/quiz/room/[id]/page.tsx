'use client'
import React, { useCallback, useContext, useEffect } from 'react'
import { useAxios } from '@/lib/useAxios'
import { RoomSession, RoomSessionActivityData } from '@/types'
import { setRoomSession } from '@/store/features/room/RoomSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { SocketContext } from '@/provider/socket-provider'
import { toast } from 'sonner'
import { event_name } from '@/config/app-details'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import dynamic from 'next/dynamic'
import MatchScreen from '@/components/quiz/QuizMatchComponent'
import RoomPrepareComponent from '@/components/battle_room/RoomPrepareComponent'

type PageProps = {
    params: {
        id: string
    }
}

const Page = ({ params: { id } }: PageProps) => {
    const router = useRouter()
    const roomSession = useSelector((Root: RootState) => Root.RoomState.roomSession)
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const { disconnectSocket, reconnectSocket, sendDataToServer } = useContext(SocketContext)
    const dispatch = useDispatch()
    const { data, error, loading } = useAxios<RoomSession>({
        url: `/room/${id}`,
        method: 'get',
    })

    const startMatch = useCallback(() => {
        if (roomSession?.players && roomSession?.players.length > 1) {
            const _sData: RoomSessionActivityData = {
                id: roomSession.id,
                members: roomSession.players.map(player => player.id),
                code: roomSession.code,
                type: "quiz_start",
                totalAnswered: 0,
                score: 0
            }
            sendDataToServer(event_name.event.roomActivity, _sData)
        } else {
            toast.error('Not enough players to start the match.')
        }
    }, [roomSession, sendDataToServer])


    const leaveRoom = useCallback(async () => {
        //   custom-leave
        if (!session || !session.id || !session.username || !roomSession?.code) {
            toast.error('You must be logged in to leave a custom room.')
            return
        }
        try {
            await api.post(`/room/custom-leave/${roomSession?.code}`, {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
            })

        } catch (error: any) {
            toast.error('Failed to start matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            })
        } finally {
            router.back();
        }
    }, [roomSession])

    useEffect(() => {
        if (data) {
            dispatch(setRoomSession(data));
        }
    }, [data])

    useEffect(() => {
        reconnectSocket()
        const handleBeforeUnload = () => {
            disconnectSocket()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            disconnectSocket()
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 flex-col">
            <h1 className="text-4xl font-extrabold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-2">
                Loading...
            </h1>
        </div>
    }

    if (data?.matchEnded) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 flex-col">
                <h1 className="text-4xl font-extrabold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-2">
                    Match Ended
                </h1>
                <p className="text-xl text-neutral-300 font-medium">
                    Thank you for playing!
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 flex-col">
                <h1 className="text-4xl font-extrabold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-2">
                    Error
                </h1>
                <p className="text-xl text-neutral-300 font-medium">
                    Unable to load the room session. Please try again later.
                </p>
            </div>
        )
    }

    if (roomSession?.matchStarted) {
        return <MatchScreen data={roomSession} />
    }

    return <RoomPrepareComponent roomSession={roomSession}
        startMatch={startMatch} leaveRoom={leaveRoom} />
}

export default Page;


