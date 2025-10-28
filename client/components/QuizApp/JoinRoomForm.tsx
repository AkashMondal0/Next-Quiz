import { motion } from "framer-motion";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRight, Hash } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { RoomJoinPayload, TemporaryUser } from "@/types";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import useSocket from "@/hooks/socketHook";

interface JoinRoomFormValues {
  playerName: string;
  roomCode: string;
}

const JoinRoomForm = memo(function JoinRoomForm({
  isDark,
  textPrimaryClass,
  textSecondaryClass,
  cardBgClass,
  onBack,
}: {
  isDark: boolean;
  textPrimaryClass: string;
  textSecondaryClass: string;
  cardBgClass: string;
  onBack: () => void;
}) {
  const socket = useSocket();
  const router = useRouter();
  const [localData, setData] = useLocalStorage<TemporaryUser>("username");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<JoinRoomFormValues>({
    defaultValues: { playerName: localData.username, roomCode: "" },
  });

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("roomCode", e.target.value.toUpperCase());
  };

  const onSubmit = async(data: JoinRoomFormValues) => {
    setIsLoading(true);
    socket.connectSocket();
    if (data.playerName.trim() !== localData.username) {
      setData({
        ...localData,
        username: data.playerName.trim(),
      });
    }
    // console.log("🟣 Form Submitted:", data);
    try {
      const { playerName, roomCode } = data;
      const payload: RoomJoinPayload = {
        player: {
          id: localData.id,
          username: playerName.trim(),
          avatar: localData.avatar,
          isReady: false,
          isHost: false,
        },
        roomCode: roomCode,
      };
      const res = await api.post("/quiz/room/join", payload);
      router.push(`/${res.data.code}`);
    } catch (error) {
      toast.error("Error joining room. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="join"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="max-w-lg mx-auto"
    >
      <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl`}>
        <CardHeader className="space-y-4">
          <motion.div
            initial={{ scale: 0.95, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <div
              className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl opacity-20 blur-xl"
              style={{ animation: "pulse 2.2s infinite" }}
            />
          </motion.div>

          <div>
            <CardTitle
              className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}
            >
              Join Room
            </CardTitle>
            <CardDescription
              className={`text-sm md:text-base ${textSecondaryClass}`}
            >
              Enter the room code and your name to jump in
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Player Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={`text-base font-semibold ${textPrimaryClass}`}
              >
                Player Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("playerName", {
                  required: "Player name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`h-12 text-base ${isDark
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    : "bg-white border-purple-200"
                  }`}
              />
              {errors.playerName && (
                <p className="text-red-500 text-sm">
                  {errors.playerName.message}
                </p>
              )}
            </div>

            {/* Room Code */}
            <div className="space-y-2">
              <Label
                htmlFor="code"
                className={`text-base font-semibold ${textPrimaryClass}`}
              >
                Room Code
              </Label>
              <Input
                id="code"
                placeholder="XXXXXX"
                maxLength={6}
                {...register("roomCode", {
                  required: "Room code is required",
                  pattern: {
                    value: /^[A-Z0-9]{6}$/,
                    message: "Must be 6 letters or numbers",
                  },
                  onChange: handleRoomCodeChange,
                })}
                className={`h-12 text-lg tracking-widest uppercase text-center font-bold ${isDark
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    : "bg-white border-purple-200"
                  }`}
              />
              {errors.roomCode && (
                <p className="text-red-500 text-sm">
                  {errors.roomCode.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-3 space-y-2">
              <Button
                type="submit"
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-500 to-purple-600 shadow transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join Room"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                className={`w-full h-12 text-base font-semibold ${isDark
                    ? "border-slate-700 hover:bg-slate-800 text-white"
                    : "border-purple-200 hover:bg-purple-50"
                  }`}
                onClick={onBack}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default JoinRoomForm;
