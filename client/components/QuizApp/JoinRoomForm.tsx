import { motion } from "framer-motion";
import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight, Hash } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// ============= JOIN ROOM FORM =============
const JoinRoomForm = memo(function JoinRoomForm({
  isDark, textPrimaryClass, textSecondaryClass, cardBgClass, playerName, setPlayerName, roomCode, setRoomCode, onBack
}: {
  isDark: boolean,
  textPrimaryClass: string,
  textSecondaryClass: string,
  cardBgClass: string,
  playerName: string,
  setPlayerName: (name: string) => void,
  roomCode: string,
  setRoomCode: (code: string) => void,
  onBack: () => void
}) {
  return <motion.div
    key="join"
    initial={{ opacity: 0, x: 80 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -80 }}
    transition={{ type: 'spring', stiffness: 120 }}
    className="max-w-lg mx-auto px-4"
  >
    <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl`}>
      <CardHeader className="space-y-4">
        <motion.div
          initial={{ scale: 0.95, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl opacity-20 blur-xl" style={{ animation: 'pulse 2.2s infinite' }} />
        </motion.div>

        <div>
          <CardTitle className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>
            Join Room
          </CardTitle>
          <CardDescription className={`text-sm md:text-base ${textSecondaryClass}`}>
            Enter the room code and your name to jump in
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className={`text-base font-semibold ${textPrimaryClass}`}>
            Player Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className={`h-12 text-base ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-purple-200'
              }`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code" className={`text-base font-semibold ${textPrimaryClass}`}>
            Room Code
          </Label>
          <Input
            id="code"
            placeholder="XXXXXX"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            className={`h-12 text-lg tracking-widest uppercase text-center font-bold ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-purple-200'
              }`}
          />
        </div>

        <div className="pt-3 space-y-2">
          <Button
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-500 to-purple-600 shadow transition-all duration-200"
            disabled={!playerName || roomCode.length !== 6}
          >
            Join Room <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className={`w-full h-12 text-base font-semibold ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-purple-200 hover:bg-purple-50'
              }`}
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
});

export default JoinRoomForm;