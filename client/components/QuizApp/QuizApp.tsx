import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParticles } from '@/utility/hooks';
import AnimatedBackground from './BackgroundBlobs';
import ThemeToggle from './ThemeToggle';
import LandingPage from './LandingScreen';
import JoinRoomForm from './JoinRoomForm';
import CreateMatchForm from './CreateMatchForm';

// ============= MAIN APP COMPONENT =============
export default function QuizApp() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [createFormData, setCreateFormData] = useState({
    playerName: '',
    aiPrompt: '',
    difficulty: 'medium',
    participantLimit: 10,
    duration: 10
  });

  const particles = useParticles(12);
  const toggleTheme = useCallback(() => setIsDark((s) => !s), []);
  const handleOptionSelect = useCallback((option: string) => setSelectedOption(option), []);
  const handleBack = useCallback(() => {
    setSelectedOption(null);
    setRoomCode('');
    setPlayerName('');
  }, []);

  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
    : 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50';

  const cardBgClass = isDark
    ? 'bg-slate-900/90 border-slate-800'
    : 'bg-white/90 border-purple-200';

  const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-slate-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-500`}>
      <style jsx>{`
        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(20px, 20px) scale(1.03); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
      `}</style>

      <AnimatedBackground isDark={isDark} particles={particles} />
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

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
              playerName={playerName}
              setPlayerName={setPlayerName}
              roomCode={roomCode}
              setRoomCode={setRoomCode}
              onBack={handleBack}
            />
          ) : (
            <CreateMatchForm
              isDark={isDark}
              textPrimaryClass={textPrimaryClass}
              textSecondaryClass={textSecondaryClass}
              cardBgClass={cardBgClass}
              formData={createFormData}
              setFormData={setCreateFormData}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}