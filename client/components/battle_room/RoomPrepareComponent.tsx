import React, { useEffect, useState } from 'react'
import { RoomSession } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '@/components/ui/button'
import ShareLink from '@/components/battle_room/ShareLink'

const RoomPrepareComponent = ({
    roomSession,
    startMatch,
    leaveRoom
}: {
    roomSession: RoomSession | null
    startMatch: () => void
    leaveRoom: () => void
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
            <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-white">Room Code</span>
                <span className="text-xl font-extrabold text-white">{roomSession.code}</span>
            </div>

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
                        <div className="w-16 h-16 rounded-full border border-neutral-600 bg-neutral-600 bg-opacity-70 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                                {player.username.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                        <span className="text-white text-sm font-medium">{player.username}</span>
                    </motion.div>
                ))}
            </motion.div>

            <div className='flex justify-center gap-4'>
                {session?.id === roomSession.hostId && (
                    <Button className="mt-6 max-w-xs rounded-lg" onClick={startMatch} variant={"secondary"}>
                        Start Match
                    </Button>
                )}
                <Button className="mt-6 max-w-xs rounded-lg" onClick={leaveRoom} variant="destructive">
                    Leave Room
                </Button>
            </div>
            <div className="text-sm text-neutral-400 mt-4">
                {roomSession.players.length} {roomSession.players.length === 1 ? 'player' : 'players'} joined
            </div>
        </div>
    )
}

export default RoomPrepareComponent



const TextLoading = () => {
    const [stepIndex, setStepIndex] = useState(0)
    const steps = [
        '🔍 Scanning for opponents across the network...',
        '🏗 Constructing battle arena...',
        '⚙️ Syncing players and loading questions...',
        '✅ Match ready! Get ready to battle!',
        // (roomSession?.players?.length ?? 0) > 0 ? (
        //     `Waiting for ${roomSession?.players?.length ?? 0} player${(roomSession?.players?.length ?? 0) > (roomSession?.prompt?.participantLimit ?? 0) ? 's' : ''} to join...`
        // ) : (
        //     'Waiting for players to join...'
        // )
        'Waiting for players to join...'
    ]
    useEffect(() => {
        const timeout = setTimeout(() => {
            setStepIndex((prev) => (prev + 1) % steps.length)
        }, 2500)
        return () => clearTimeout(timeout)
    }, [stepIndex, steps.length])
    return <AnimatePresence mode="wait">
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
}