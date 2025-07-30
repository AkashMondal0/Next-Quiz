'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const fakeAvatars = [
    'https://api.dicebear.com/7.x/lorelei/svg?seed=A',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=B',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=C',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=D',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=E',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=F',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=G',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=H',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=I',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=J',
]

const data = Array.from({ length: 20 }, (_, i) => ({
    name: i === 0 ? 'You' : `Player ${i}`,
    status: Math.random() > 0.3 ? 'Ready' : 'Waiting...',
    url: fakeAvatars[i % fakeAvatars.length],
}))

const BattleRoomScreen = ({
    triggerStartMatch,
    players
}: {
    triggerStartMatch: () => void,
    players: { name: string; status: string; url: string }[]
}) => {
    const [countdown, setCountdown] = useState(15)

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
                    {players.map((player, idx) => (
                        <motion.div
                            key={idx}
                            className="bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-700 shadow-inner flex flex-col items-center space-y-2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.02 }}
                        >
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={player.url} alt={player.name} />
                                <AvatarFallback className="bg-neutral-800 text-xs">
                                    {player.name[0]}
                                </AvatarFallback>
                            </Avatar>

                            <span className="text-sm font-semibold truncate w-full">
                                {player.name}
                            </span>
                            <p
                                className={`text-xs font-medium text-green-400`}
                            >
                                {player.status}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

const Page = () => {
    const [matchStarted, setMatchStarted] = useState(false)
    const [players, setPlayers] = useState(data)

    const triggerStartMatch = () => {
        setMatchStarted(true)
    }

    if (matchStarted) {
        // Redirect to the quiz page or start the match logic
        // This could be a navigation to another page or a state change
        return <div className="text-center text-white">Match has started!</div>
    }

    return (
        <div className="relative w-full h-full">
            <BattleRoomScreen triggerStartMatch={triggerStartMatch}
                players={players}
            />
        </div>
    )
}

export default Page;