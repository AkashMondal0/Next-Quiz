'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { Check, LogOut, Play, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/hooks';
import { useRouter } from 'next/navigation';
import useSocket from '@/hooks/socketHook';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TemporaryUser } from '@/types';
import api from '@/lib/axios';
import { playerReadyToggle, roomReset } from '@/store/features/account/AccountSlice';

export default function ActionButtons({
  isDark,
  isHost,
  isReady,
  setIsReady,
  roomCode,
  isReadyToStart
}: {
  isDark: boolean;
  isHost: boolean;
  isReady: boolean;
  readyCount: number;
  roomCode: string;
  participantsCount: number;
  isReadyToStart: boolean;
  setIsReady: (v: boolean) => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [localData] = useLocalStorage<TemporaryUser>("username");
  const itemVariants: any = useMemo(() => ({
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } },
  }), []);

  const onSubmit = async () => {
    setIsLoading(true);
    socket.connectSocket();
    try {
      await api.post("/quiz/room/leave", {
        player: localData,
        roomCode: roomCode,
      });
      dispatch(roomReset())
      router.replace('/');
    } catch (error) {
      toast.error("Error leaving room. Please try again.");
      // setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadyToggle = () => {
    setIsReady(!isReady);
    socket.sendDataToServer('player-ready-toggle', {
      playerId: localData.id,
      roomCode: roomCode,
      isReady: !isReady
    });
    dispatch(playerReadyToggle({
      playerId: localData.id,
      roomCode: roomCode,
      isReady: !isReady
    }));
  };

  const handleStartGame = () => {
    socket.sendDataToServer('start-game', { roomCode });
  };

  return (
    <motion.div variants={itemVariants} className="space-y-3">
      {isHost ? (
        <Button onClick={handleStartGame} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl" disabled={isReadyToStart}>
          <Play className="w-5 h-5 mr-2" /> Start Game
        </Button>
      ) : (
        <Button onClick={handleReadyToggle} className={`w-full h-14 text-lg font-bold shadow-xl ${isReady ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-pink-600'}`}>
          {isReady ? (<><Check className="w-5 h-5 mr-2" />Ready!</>)
            : (<><Zap className="w-5 h-5 mr-2" />Ready Up</>)}
        </Button>
      )}

      <Button variant="outline"
        onClick={onSubmit}
        className={`w-full h-12 font-semibold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'}`}>
        <LogOut className="w-4 h-4 mr-2" /> Leave Lobby
      </Button>
    </motion.div>
  );
}
