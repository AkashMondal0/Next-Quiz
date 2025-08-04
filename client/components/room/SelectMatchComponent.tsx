'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RocketIcon, UsersIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function SelectMatchComponent({
    handleStartMatchmaking
}: {
    handleStartMatchmaking: (roomSize: number) => void;
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [roomSize, setRoomSize] = useState(2)

    const handleQuickMatch = () => {
        setIsLoading(true)
        handleStartMatchmaking(roomSize)
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-xl w-full space-y-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold"
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

                <div className="text-sm text-neutral-300">
                    <label className="block mb-2">Room Size</label>
                    <div className="flex justify-center gap-2">
                        {[2, 3, 4].map((size) => (
                            <button
                                key={size}
                                onClick={() => setRoomSize(size)}
                                className={`px-4 py-1 rounded-full border ${
                                    roomSize === size
                                        ? 'bg-green-600 border-green-400 text-white'
                                        : 'border-neutral-600 text-neutral-400 hover:bg-neutral-700'
                                }`}
                                disabled={isLoading}
                            >
                                {size} Players
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    {/* Quick Match */}
                    <motion.div
                        className={`bg-neutral-800 border border-neutral-700 rounded-2xl p-6 transition-all cursor-pointer ${
                            isLoading ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg hover:scale-[1.02]'
                        }`}
                        onClick={handleQuickMatch}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 },
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="w-8 h-8 mx-auto mb-3 text-green-400 animate-spin" />
                        ) : (
                            <RocketIcon className="w-8 h-8 mx-auto mb-3 text-green-400" />
                        )}
                        <h2 className="text-xl font-semibold">
                            {isLoading ? 'Matching...' : 'Quick Match'}
                        </h2>
                        <p className="text-sm text-neutral-400 mt-1">
                            {isLoading
                                ? 'Looking for a random opponent...'
                                : 'Instantly match with a random player.'}
                        </p>
                    </motion.div>

                    {/* Custom Match */}
                    <motion.div
                        className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                        onClick={() => router.push('/quiz/custom-match')}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 },
                        }}
                    >
                        <UsersIcon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                        <h2 className="text-xl font-semibold">Custom Match</h2>
                        <p className="text-sm text-neutral-400 mt-1">
                            Create or join a private room with friends.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    )
}
