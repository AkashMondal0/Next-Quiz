import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { MatchRanking, Player, TemporaryUser } from '@/types';
import PlayerCard from './PlayerCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface RankingsModalProps {
  players: MatchRanking[];
  isDark: boolean;
  textPrimaryClass: string;
  textSecondaryClass: string;
  cardBgClass: string;
  onClose: () => void;
}


// ============= RANKINGS MODAL =============
const RankingsModal: React.FC<RankingsModalProps> = React.memo(({
  players,
  isDark,
  textPrimaryClass,
  textSecondaryClass,
  cardBgClass,
  onClose
}) => {
  const [localData] = useLocalStorage<TemporaryUser>("username");
  
  // console.log('Rendering RankingsModal with players:', players);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-2xl`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <CardTitle className={`text-2xl ${textPrimaryClass}`}>
                  Live Rankings
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            <CardDescription className={textSecondaryClass}>
              Current player standings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {players
                .slice()
                .sort((a, b) => b.answered - a.answered)
                .map((player, index) => (
                  <PlayerCard
                    answered={player.answered}
                    isYou={player.id === localData?.id}
                    key={player.id}
                    player={player}
                    index={index}
                    isDark={isDark}
                    textPrimaryClass={textPrimaryClass}
                    textSecondaryClass={textSecondaryClass}
                  />
                ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>)
});

export default RankingsModal;