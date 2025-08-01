'use client'

import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAxios } from '@/lib/useAxios'
import { RoomSession, TemporaryUser } from '@/types'
import { Button } from '@/components/ui/button'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { SocketContext } from '@/provider/socket-provider'
import { event_name } from '@/config/app-details'
import { setRoomSession } from '@/store/features/room/RoomSlice'

const BattleRoomLoadingScreen = ({
    triggerStartMatch,
    players
}: {
    triggerStartMatch: () => void,
    players: TemporaryUser[]
}) => {
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            triggerStartMatch()
        }
    }, [countdown, triggerStartMatch])

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <motion.div
                className="w-full max-w-6xl text-center space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Title */}
                <h1 className="text-4xl font-extrabold tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-2">
                    ⚔️ Battle Room
                </h1>

                {/* Countdown */}
                <motion.div
                    key={countdown}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-xl text-neutral-300 font-medium"
                >
                    {countdown > 0
                        ? `Match starting in ${countdown}...`
                        : '🚀 Starting match...'}
                </motion.div>

                {/* Grid of Players */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 mx-auto">
                    {players.map((player, idx) => (
                        <motion.div
                            key={idx}
                            className="bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-700 shadow-inner flex flex-col items-center space-y-2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.02 }}
                        >
                            <Avatar className="w-12 h-12">
                                {/* <AvatarImage src={player.avatar} alt={player.username} /> */}
                                <AvatarFallback className="bg-neutral-800">
                                    {player.username[0]}
                                </AvatarFallback>
                            </Avatar>

                            <span className="text-sm font-semibold truncate w-full">
                                {player.username}
                            </span>
                            <p
                                className={`text-xs font-medium text-green-400`}
                            >
                                {/* {player.status} */}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

const Page = ({
    params: { id }
}: {
    params: {
        id: string
    }
}) => {
    const dispatch = useDispatch()
    const { data, loading } = useAxios<RoomSession>({
        url: `/room/${id}`,
        method: 'get',
    })
    const [matchStarted, setMatchStarted] = useState(false)

    const triggerStartMatch = () => {
        setMatchStarted(true)
    }

    useEffect(() => {
        if (data) {
            dispatch(setRoomSession(data));
        }
    }, [data]);

    if (matchStarted) {
        return <MatchScreen data={data} />;
    }

    return (
        <div className="relative w-full h-full">
            {Array.isArray(data?.players) && data.players.length > 0 ? (
                <BattleRoomLoadingScreen
                    players={data.players}
                    triggerStartMatch={triggerStartMatch}
                />
            ) : (
                <></>
            )}
        </div>
    )
}

export default Page;


const MatchScreen = (
    { data }: {
        data: RoomSession | undefined | null
    }
) => {
    const session = useSelector((state: RootState) => state.AccountState.session)
    const roomSession = useSelector((state: RootState) => state.RoomState.roomSession)
    const { sendDataToServer, connectSocket, isConnected } = useContext(SocketContext);
    const [totalAnswered, setTotalAnswered] = useState(0);

    const rankingUser = roomSession?.matchRanking ? [...roomSession.matchRanking].sort((a, b) => b.score - a.score) : [];

    const handleAnswerQuestion = (questionId: string) => {
        // Logic to handle answering a question
        setTotalAnswered(prev => prev + 1);
        if (data?.players && data?.players?.length > 0) {
            // Emit event to server with the question answered
            sendDataToServer(event_name.event.roomActivity, {
                type: "answered_question",
                members: data?.players.map(player => player.id),
                id: session?.id,
                totalAnswered: totalAnswered + 1,
            });
        }
    }

    useEffect(() => {
        if (!isConnected) {
            connectSocket();
        }
    }, [session?.id, isConnected, connectSocket]);

    return (
        <div>
            <h1 className="text-4xl font-extrabold tracking-widest mb-2">
                Match Screen
            </h1>
            <p className="text-xl text-neutral-300">
                List of quiz questions will be displayed here.
            </p>
            <div className="min-h-screen flex justify-center p-6 gap-10">
                <div>
                    {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="bg-neutral-900 p-4 rounded-lg shadow-md mt-4">
                            <h2 className="text-lg font-semibold text-white">Question {i + 1}</h2>
                            <p className="text-sm text-neutral-400">This is a placeholder for quiz question {i + 1}.</p>
                            <Button className="mt-2" variant="outline" onClick={() => handleAnswerQuestion(`question-${i + 1}`)}>
                                Answer Question
                            </Button>
                        </div>
                    ))}
                </div>
                {/* list of ranking users */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Ranking</h2>
                    <div className="space-y-4">
                        {rankingUser.map((user, index) => {
                            if (!user) return null; // Skip if user is undefined
                            const _user = data?.players.find(p => p.id === user.id);
                            return (
                                <div key={user.id} className="flex items-center space-x-4">
                                    <Avatar className="w-10 h-10">
                                        <AvatarFallback className="bg-neutral-800">
                                            {_user?.username[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {_user?.username}
                                        </p>
                                        <p className="text-xs text-green-400">Score: {user.score}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}