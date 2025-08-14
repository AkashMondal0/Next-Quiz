import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TemporaryUser } from '@/types'

export default function BattleRoomLoadingScreen({
    triggerStartMatch,
    players
}: {
    triggerStartMatch: () => void,
    players: TemporaryUser[]
}) {
    const [countdown, setCountdown] = useState(5) // Countdown in seconds

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
        <>
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
        </>
    )
}