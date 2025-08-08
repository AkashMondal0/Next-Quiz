'use client'
import React, { useCallback, useContext, useEffect } from 'react'
import { useAxios } from '@/lib/useAxios'
import { RoomSession, RoomSessionActivityData } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { setRoomSession } from '@/store/features/room/RoomSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '@/components/ui/button'
import ShareLink from '@/components/quiz/ShareLink'
import { SocketContext } from '@/provider/socket-provider'
import MatchScreen from '@/components/quiz/MatchScreen'
import { toast } from 'sonner'
import { event_name } from '@/config/app-details'

type PageProps = {
    params: {
        id: string
    }
}

const Page = ({ params: { id } }: PageProps) => {
    const roomSession = useSelector((Root: RootState) => Root.RoomState.roomSession)
    const { disconnectSocket, connectSocket, sendDataToServer } = useContext(SocketContext)
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

    useEffect(() => {
        if (data) {
            dispatch(setRoomSession(data));
        }
    }, [data])

    useEffect(() => {
        connectSocket()
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

    return <RoomPrepareComponent roomSession={roomSession} startMatch={startMatch} />
}

export default Page;


const RoomPrepareComponent = ({
    roomSession,
    startMatch
}: {
    roomSession: RoomSession | null
    startMatch: () => void
}) => {
    const session = useSelector((Root: RootState) => Root.AccountState.session)

    if (!roomSession) {
        return <React.Fragment></React.Fragment>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-6 flex-col space-y-10 mx-auto">

            <div className="absolute top-4 right-4">
                <ShareLink link={`${roomSession.code}`} />
            </div>

            {/* Battle Logo */}
            <motion.div
                className="text-center text-5xl md:text-6xl font-extrabold text-white tracking-widest select-none relative"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                ⚔️ QUIZ BATTLE
                <motion.div
                    className="absolute inset-0 blur-2xl bg-white opacity-10 rounded-xl"
                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>

            {/* Joined Players List */}
            <motion.div
                className="flex flex-wrap justify-center gap-6 mt-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.2,
                        }
                    }
                }}
            >
                {roomSession.players.map((player, index) => (
                    <motion.div
                        key={player.id || index}
                        className="flex flex-col items-center space-y-2 p-4 bg-neutral-800 rounded-2xl shadow-md"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center text-2xl">
                            <Avatar className="w-16 h-16 border border-neutral-600 rounded-full">
                                <AvatarFallback>{player.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <span className="text-white text-sm font-medium">{player.username}</span>
                    </motion.div>
                ))}
            </motion.div>

            {session?.id === roomSession.hostId && (
                <Button className="mt-6 w-full max-w-xs" onClick={startMatch}>
                    Start Match
                </Button>
            )}
        </div>
    )
}