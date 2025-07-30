'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
    '🔍 Scanning for opponents across the network...',
    '🏗 Constructing battle arena...',
    '⚙️ Syncing players and loading questions...',
    '✅ Match ready! Get ready to battle!',
]

const MatchmakingLoadingScreen = () => {
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

                {/* BATTLE LOGO ANIMATION */}
                <motion.div
                    className="text-center text-5xl md:text-6xl font-extrabold text-white tracking-widest select-none relative"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">⚔️ QUIZ BATTLE</span>

                    {/* Subtle glow aura */}
                    <motion.div
                        className="absolute inset-0 blur-2xl bg-white opacity-10 rounded-xl"
                        animate={{ opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                {/* Step-by-step animated message */}
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
            </div>
        </div>
    )
}

const Page = () => {

    useEffect(() => {
       console.log("Matchmaking page loaded. Initializing matchmaking process...");
    }, []);

    return <MatchmakingLoadingScreen />;
}

export default Page;