'use client'

import React, { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { SocketContext } from '@/provider/socket-provider'
import StartMatchComponent from '@/components/room/StartMatchComponent'
import { RoomMatchMakingState } from '@/types'
import { Button } from '@/components/ui/button'

const steps = [
    '🔍 Scanning for opponents across the network...',
    '🏗 Constructing battle arena...',
    '⚙️ Syncing players and loading questions...',
    '✅ Match ready! Get ready to battle!',
]
// useEffect(() => {
//     if (stepIndex < steps.length - 1) {
//         const timeout = setTimeout(() => {
//             setStepIndex((prev) => prev + 1)
//         }, 2500)
//         return () => clearTimeout(timeout)
//     }
// }, [stepIndex])

const MatchmakingLoadingScreen = ({
    cancelMatchmaking,
    data
}: {
    cancelMatchmaking: () => void,
    data: RoomMatchMakingState
}) => {
    const [stepIndex, setStepIndex] = useState(0)

    useEffect(() => {
        if (stepIndex < steps.length - 1) {
            const timeout = setTimeout(() => {
                setStepIndex((prev) => prev + 1)
            }, 2500)
            return () => clearTimeout(timeout)
        }
    }, [stepIndex])

    return (
        <div className="min-h-screen h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-6">
            <div className="flex flex-col items-center space-y-10 text-white">

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

                {/* Loading Step Text */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stepIndex}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.6 }}
                        className="text-center text-xl md:text-2xl font-medium tracking-wide text-neutral-300 px-4"
                    >
                        {steps[stepIndex]}
                    </motion.div>
                </AnimatePresence>

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
                    {data.players.map((player, index) => (
                        <motion.div
                            key={player.id || index}
                            className="flex flex-col items-center space-y-2 p-4 bg-neutral-800 rounded-2xl shadow-md"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center text-2xl">
                                {player.avatar ? (
                                    <img src={player.avatar} alt={player.username} className="rounded-full w-full h-full object-cover" />
                                ) : (
                                    <span>{player.username.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <span className="text-white text-sm font-medium">{player.username}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Cancel Button */}
                <Button className="mt-6 w-full max-w-xs" onClick={cancelMatchmaking}>
                    Cancel Matchmaking
                </Button>
            </div>
        </div>
    )
}

const Page = () => {
    const { reconnectSocket, disconnectSocket, connectSocket } = useContext(SocketContext)
    const roomMatchMakingState = useSelector((Root: RootState) => Root.RoomState.roomMatchMakingState)
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const router = useRouter()


    const handleStartMatchmaking = async () => {
        try {
            connectSocket(); // Ensure socket is connected before sending data
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
            });
            setTimeout(() => {
                if (response.data.roomCode) {
                    router.replace(`/quiz/${response.data.roomCode}`);
                }
            }, 2000);
        } catch (error: any) {
            toast.error('Failed to start matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            });
        }
    }

    const handleCancelMatchmaking = async () => {
        try {
            await api.post('/room/cancel-matchmaking', {
                user: {
                    id: session?.id,
                    username: session?.username,
                    avatar: ''
                },
                level: 2,
                roomSize: 2
            });
            toast.success('Matchmaking cancelled successfully.');
            router.push('/'); // Redirect to home or another page
        } catch (error: any) {
            toast.error('Failed to cancel matchmaking. Please try again later.', {
                description: error?.response?.data?.message || 'An unexpected error occurred.'
            });
        }
    }

    useEffect(() => {
        const handleBeforeUnload = () => {
            disconnectSocket(); // disconnect on page reload or close
            handleCancelMatchmaking(); // cancel matchmaking if in progress
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            disconnectSocket(); // for route change
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (roomMatchMakingState?.status === "ready") {
                router.replace(`/quiz/${roomMatchMakingState.roomCode}`);
            }
        }, 1800);
    }, [roomMatchMakingState, router]);

    return (
        <>
            {roomMatchMakingState ? <MatchmakingLoadingScreen
                data={roomMatchMakingState}
                cancelMatchmaking={reconnectSocket} /> :
                <StartMatchComponent handleStartMatchmaking={handleStartMatchmaking} />}
        </>
    );
}

export default Page;