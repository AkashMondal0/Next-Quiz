'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import RoomInfoCard from './RoomInfoCard';
import GameSettingsCard from './GameSettingsCard';
import ActionButtons from './ActionButtons';
import PlayersGrid from './PlayersGrid';
import ThemeToggle from '../QuizApp/ThemeToggle';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TemporaryUser } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchRoomSession } from '@/store/features/account/Api';
import QuizListPage from '../QuizRoom/QuizRoom';

export default function LobbyPage({ id }: { id: string }) {
    const [isDark, setIsDark] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const dispatch = useAppDispatch();
    const roomSession = useAppSelector((state) => state.AccountState.roomSession);
    const [localData] = useLocalStorage<TemporaryUser>("username");
    const roomCode = id;
    const isHost = localData?.id === roomSession?.hostId;
    const participantLimit = roomSession?.participantLimit || 8;
    const isReadyToStart = !roomSession?.players.every(p => p.isReady);

    const containerVariants: any = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
    }), []);

    const itemVariants: any = useMemo(() => ({
        hidden: { y: 15, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } },
    }), []);

    const handleCopyCode = useCallback(() => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [roomCode]);

    const handleFetchRoomSession = useCallback(() => {
        if (!roomCode) return;
        dispatch(fetchRoomSession(roomCode));
    }, [dispatch, roomCode]);

    useEffect(() => {
        handleFetchRoomSession();
    }, []);

    const readyCount = roomSession?.players.filter(p => p.isReady).length || 0;
    const totalPlayers = roomSession?.players.length || 0;

    const bgClass = isDark ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';
    const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
    const textSecondaryClass = isDark ? 'text-slate-300' : 'text-gray-600';

    if(roomSession?.matchStarted) {
        return <QuizListPage/>
    }

    return (
        <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500`}>
            <div className={`absolute top-20 left-10 w-96 h-96 ${isDark ? 'bg-purple-600 opacity-20' : 'bg-purple-300 opacity-30'} rounded-full mix-blend-multiply blur-3xl animate-[floatBlob1_20s_linear_infinite]`} />
            <div className={`absolute top-40 right-10 w-96 h-96 ${isDark ? 'bg-blue-600 opacity-20' : 'bg-blue-300 opacity-30'} rounded-full mix-blend-multiply blur-3xl animate-[floatBlob2_18s_linear_infinite]`} />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-3 gap-6">
                    <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                        <RoomInfoCard
                            participantLimit={participantLimit}
                            isDark={isDark}
                            roomCode={roomCode}
                            copied={copied}
                            handleCopyCode={handleCopyCode}
                            readyCount={readyCount}
                            totalPlayers={totalPlayers}
                        />
                        <GameSettingsCard
                            isDark={isDark}
                            data={{
                                questions: 10,
                                difficulty: 'Medium'
                            }}
                        />
                        <ActionButtons
                            isReadyToStart={isReadyToStart}
                            participantsCount={totalPlayers}
                            roomCode={roomCode}
                            isHost={isHost}
                            isReady={isReady}
                            setIsReady={setIsReady}
                            readyCount={readyCount}
                            isDark={isDark}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <CardHeader className="my-4 px-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className={`text-2xl ${textPrimaryClass}`}>Players in Lobby</CardTitle>
                                    <CardDescription className={textSecondaryClass}>{readyCount} of {totalPlayers} ready</CardDescription>
                                </div>
                                <div className={`px-4 py-2 rounded-full ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} animate-pulse-slow`}>
                                    <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{totalPlayers}/{participantLimit}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <PlayersGrid
                            roomCode={roomCode}
                            isHost={isHost}
                            players={roomSession?.players || []}
                            totalPlayers={totalPlayers}
                            participantLimit={participantLimit}
                            isDark={isDark}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
