import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Clock, Settings, Target, UserPlus, Wand2 } from "lucide-react";
import { Label } from "../ui/label";
import Counter from "./Counter";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { memo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AIQuizLoading from "./AiGenerateQuizLoading";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CreateQuizPayload, TemporaryUser } from "@/types";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSocket from "@/hooks/socketHook";

type MatchFormData = {
  playerName: string;
  aiPrompt?: string;
  difficulty: string;
  participantLimit: number;
  duration: number;
  numberOfQuestions?: number;
};

const CreateMatchForm = memo(function CreateMatchForm({
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
  const router = useRouter();
  const socket = useSocket();
  const [localData, setValue] = useLocalStorage<TemporaryUser>("username");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MatchFormData>({
    defaultValues: {
      playerName: localData.username || "",
      aiPrompt: "",
      difficulty: "medium",
      participantLimit: 2,
      duration: 5,
      numberOfQuestions: 10,
    },
  });

  const onSubmit = async (data: MatchFormData) => {
    try {
      setIsLoading(true);
      socket.connectSocket();
      const { playerName, aiPrompt, difficulty, participantLimit, duration, numberOfQuestions } = data;
      if (playerName.trim() !== localData.username) {
        setValue({
          ...localData,
          username: playerName.trim(),
        });
      }
      const payload: CreateQuizPayload = {
        prompt: aiPrompt?.trim() || null,
        difficulty,
        participantLimit,
        numberOfQuestions,
        duration,
        player: {
          id: localData.id,
          username: data.playerName.trim(),
          avatar: localData.avatar,
          isReady: true,
          isHost: true,
        },
        hostId: localData.id,
      };
      const res = await api.post("/quiz/room/create", payload);
      router.push(`/${res.data.code}`);
    } catch (error) {
      toast.error("Error creating match. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <AIQuizLoading />
  }

  return (
    <motion.form
      key="create"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="max-w-2xl mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className={`${cardBgClass} border-2 backdrop-blur-xl shadow-xl`}>
        <CardHeader className="space-y-4">
          <motion.div
            initial={{ scale: 0.95, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-20 blur-xl"
              style={{ animation: "pulse 2.2s infinite" }}
            />
          </motion.div>

          <div>
            <CardTitle className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimaryClass}`}>
              Create Match
            </CardTitle>
            <CardDescription className={`text-sm md:text-base ${textSecondaryClass}`}>
              Customize your quiz settings and start the match
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Player Name */}
          <div className="space-y-2">
            <Label htmlFor="hostName" className={`text-base font-semibold ${textPrimaryClass}`}>
              Your Name (Host)
            </Label>
            <Input
              id="hostName"
              placeholder="Enter your name"
              {...register("playerName", { required: "Host name is required" })}
              className={`h-12 text-base ${isDark
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                : "bg-white border-purple-200"
                }`}
            />
            {errors.playerName && (
              <p className="text-red-500 text-sm">{errors.playerName.message}</p>
            )}
          </div>

          {/* AI Prompt */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wand2 className={`w-5 h-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              <Label htmlFor="aiPrompt" className={`text-base font-semibold ${textPrimaryClass}`}>
                AI Quiz Prompt
              </Label>
            </div>
            <Textarea
              id="aiPrompt"
              placeholder="e.g., Generate questions about space exploration and astronomy..."
              {...register("aiPrompt", { required: "AI prompt is required" })}
              rows={3}
              className={`text-base resize-none ${isDark
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                : "bg-white border-purple-200"
                }`}
            />
            <p className={`text-xs ${textSecondaryClass}`}>
              Leave empty for random questions or describe your quiz topic
            </p>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <Label className={`text-base font-semibold ${textPrimaryClass} flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Difficulty Level
            </Label>
            <Controller
              control={control}
              name="difficulty"
              rules={{ required: "Select a difficulty" }}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { value: "easy", label: "Easy", color: "green", emoji: "😊" },
                    { value: "medium", label: "Medium", color: "yellow", emoji: "🤔" },
                    { value: "hard", label: "Hard", color: "red", emoji: "🔥" },
                  ].map((level) => (
                    <Label
                      key={level.value}
                      htmlFor={level.value}
                      className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === level.value
                        ? `border-${level.color}-500 bg-${level.color}-500/20`
                        : isDark
                          ? "border-slate-700 hover:border-slate-600 bg-slate-800/60"
                          : "border-purple-200 hover:border-purple-300 bg-white"
                        }`}
                    >
                      <RadioGroupItem value={level.value} id={level.value} className="sr-only" />
                      <div className="text-center">
                        <div className="text-2xl mb-1">{level.emoji}</div>
                        <span className={`font-semibold ${textPrimaryClass}`}>{level.label}</span>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.difficulty && (
              <p className="text-red-500 text-sm">{errors.difficulty.message}</p>
            )}
          </div>

          {/* Participant Limit */}
          <Controller
            name="participantLimit"
            control={control}
            rules={{ min: 2, max: 20 }}
            render={({ field }) => (
              <Counter
                label="Participant Limit"
                value={field.value ?? 2}
                onChange={field.onChange}
                min={2}
                max={20}
                isDark={isDark}
                textPrimaryClass={textPrimaryClass}
                textSecondaryClass={textSecondaryClass}
              />
            )}
          />

          <Controller
            name="numberOfQuestions"
            control={control}
            rules={{ min: 5, max: 50 }}
            render={({ field }) => (
              <Counter
                label="Number of Questions"
                value={field.value ?? 10}
                onChange={field.onChange}
                min={5}
                max={50}
                isDark={isDark}
                textPrimaryClass={textPrimaryClass}
                textSecondaryClass={textSecondaryClass}
              />
            )}
          />

          {/* Match Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <Label className={`text-base font-semibold ${textPrimaryClass}`}>
                Match Duration (minutes)
              </Label>
            </div>
            <Controller
              name="duration"
              control={control}
              rules={{ required: "Select match duration" }}
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((duration) => (
                    <Button
                      key={duration}
                      type="button"
                      variant={field.value === duration ? "default" : "outline"}
                      onClick={() => field.onChange(duration)}
                      className={`h-12 font-bold ${field.value === duration
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                        : isDark
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-purple-200 hover:bg-purple-50"
                        }`}
                    >
                      {duration}m
                    </Button>
                  ))}
                </div>
              )}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-2">
            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-600 shadow-xl transition-all duration-200"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Match
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
        </CardContent>
      </Card>
    </motion.form>
  );
});
export default CreateMatchForm;
