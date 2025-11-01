import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './LandingScreen';
import JoinRoomForm from './JoinRoomForm';
import CreateMatchForm from './CreateMatchForm';
import QuickMatch from './QuickMatch';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { roomReset } from '@/store/features/account/AccountSlice';

// ============= MAIN APP COMPONENT =============
export default function QuizApp() {
  const [selectedOption, setSelectedOption] = useState<"join" | "create" | "quick" | null>(null);
  const [isDark, setIsDark] = useState<boolean>(true);
  const handleOptionSelect = useCallback((option: "join" | "create" | "quick") => setSelectedOption(option), []);
  const roomSession = useAppSelector((state) => state.AccountState.roomSession);
  const dispatch = useAppDispatch()
  const handleBack = useCallback(() => {
    setSelectedOption(null);
  }, []);

  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
    : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';

  const cardBgClass = isDark
    ? 'bg-slate-900/90 border-slate-800'
    : 'bg-white/90 border-purple-200';

  const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-slate-300' : 'text-gray-600';

  useEffect(() => {
    if (roomSession) {
      dispatch(roomReset())
    }
  }, []);

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-2 overflow-hidden relative transition-colors duration-500 pt-5`}>
      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {!selectedOption ? (
            <LandingPage
              isDark={isDark}
              textPrimaryClass={textPrimaryClass}
              textSecondaryClass={textSecondaryClass}
              cardBgClass={cardBgClass}
              onSelectOption={handleOptionSelect}
            />
          ) : selectedOption === 'join' ? (
            <JoinRoomForm
              isDark={isDark}
              textPrimaryClass={textPrimaryClass}
              textSecondaryClass={textSecondaryClass}
              cardBgClass={cardBgClass}
              onBack={handleBack}
            />
          ) : selectedOption === 'quick' ? (
            <QuickMatch
              isDark={isDark}
              textPrimaryClass={textPrimaryClass}
              textSecondaryClass={textSecondaryClass}
              cardBgClass={cardBgClass}
              onBack={handleBack} />
          ) : (
            <CreateMatchForm
              isDark={isDark}
              textPrimaryClass={textPrimaryClass}
              textSecondaryClass={textSecondaryClass}
              cardBgClass={cardBgClass}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}