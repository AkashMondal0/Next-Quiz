'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { RocketIcon, UsersIcon, Loader2, Users2Icon } from 'lucide-react'
import { useForm, Controller } from "react-hook-form"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import Counter from "@/components/quiz/Counter"
import { Textarea } from "@/components/ui/textarea"
import { QuizBattleFormData } from '@/types'

export default function QuizBattleComponent({
    handleStartMatchmaking,
    handleCustomRoom,
}: {
    handleStartMatchmaking: (roomSize: number, formData: QuizBattleFormData) => void;
    handleCustomRoom: (roomSize: number, formData: QuizBattleFormData) => void;
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [roomSize, setRoomSize] = useState(2)
    const [showCustomForm, setShowCustomForm] = useState(false)
    const [showCustomRoomForm, setShowCustomRoomForm] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<QuizBattleFormData>({
        defaultValues: {
            topic: "javascript General Knowledge",
            difficulty: "easy",
            numberOfQuestions: 10,
            participantLimit: 2,
        },
    })

    const numberOfQuestions = watch("numberOfQuestions")
    const participantLimit = watch("participantLimit")

    const handleQuickMatch = () => {
        setIsLoading(true)
        handleStartMatchmaking(roomSize, {
            topic: watch("topic"),
            difficulty: watch("difficulty"),
            numberOfQuestions,
            participantLimit,
        })
    }

    const _handleCustomRoom = () => {
        setShowCustomForm(false)
        setShowCustomRoomForm(true)
        setIsLoading(false)
    }

    const onSubmit = async (data: QuizBattleFormData) => {
        setIsLoading(true)
        try {
            handleStartMatchmaking(roomSize, data)
        } catch (error) {
            console.error("Error starting match:", error)
        } finally {
            setIsLoading(false)
            setShowCustomForm(false)
        }
    }

    const onSubmitCustomRoom = async (data: QuizBattleFormData) => {
        setIsLoading(true)
        try {
            handleCustomRoom(roomSize, data)
        } catch (error) {
            console.error("Error creating custom room:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-xl w-full space-y-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold"
                >
                    🧠 Quiz Battle Arena
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-neutral-400"
                >
                    Choose a mode to test your knowledge against others.
                </motion.p>

                {!showCustomForm && !showCustomRoomForm && (
                    <>
                        <div className="text-sm text-neutral-300">
                            <label className="block mb-2">Room Size</label>
                            <div className="flex justify-center gap-2">
                                {[2, 3, 4].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setRoomSize(size)}
                                        className={`px-4 py-1 rounded-full border ${roomSize === size
                                            ? 'bg-green-600 border-green-400 text-white'
                                            : 'border-neutral-600 text-neutral-400 hover:bg-neutral-700'
                                            }`}
                                        disabled={isLoading}
                                    >
                                        {size} Players
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10"
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.1 } },
                            }}
                        >
                            {/* Quick Match */}
                            <motion.button
                                className={`bg-neutral-800 border border-neutral-700 rounded-2xl p-6 transition-all cursor-pointer ${isLoading ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg hover:scale-[1.02]'
                                    }`}
                                onClick={handleQuickMatch}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-8 h-8 mx-auto mb-3 text-green-400 animate-spin" />
                                ) : (
                                    <RocketIcon className="w-8 h-8 mx-auto mb-3 text-green-400" />
                                )}
                                <h2 className="text-xl font-semibold">
                                    {isLoading ? 'Matching...' : 'Quick Match'}
                                </h2>
                                <p className="text-sm text-neutral-400 mt-1">
                                    {isLoading
                                        ? 'Looking for a random opponent...'
                                        : 'Instantly match with a random player.'}
                                </p>
                            </motion.button>

                            {/* Custom Match */}
                            <motion.button
                                className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                onClick={() => {
                                    setShowCustomForm(true)
                                    setShowCustomRoomForm(false)
                                }}
                            >
                                <UsersIcon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                                <h2 className="text-xl font-semibold">Custom Match</h2>
                                <p className="text-sm text-neutral-400 mt-1">
                                    Customize game settings and match.
                                </p>
                            </motion.button>

                            {/* Custom Room */}
                            <motion.button
                                className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                onClick={_handleCustomRoom}
                            >
                                <Users2Icon className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                                <h2 className="text-xl font-semibold">Custom Room</h2>
                                <p className="text-sm text-neutral-400 mt-1">
                                    Create or join a private room with friends.
                                </p>
                            </motion.button>
                        </motion.div>
                    </>
                )}

                {(showCustomForm || showCustomRoomForm) && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10"
                    >
                        <Card className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-lg p-6 text-left">
                            <CardHeader>
                                <CardTitle className="text-xl text-center">
                                    {showCustomRoomForm ? "Custom Room Settings" : "Match Settings"}
                                </CardTitle>
                                <CardDescription className="text-center text-neutral-400">
                                    {showCustomRoomForm
                                        ? "Create or join a private room"
                                        : "Customize your quiz battle setup"}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form
                                    onSubmit={handleSubmit(showCustomRoomForm ? onSubmitCustomRoom : onSubmit)}
                                    className="space-y-6"
                                >
                                    {/* Topic */}
                                    <div className="space-y-1">
                                        <Textarea
                                            {...register("topic", { required: "Topic is required" })}
                                            placeholder="Enter topic (e.g. History, Tech...)"
                                            className="bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                                        />
                                        {errors.topic && (
                                            <p className="text-sm text-red-500">
                                                {errors.topic.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Difficulty */}
                                    <div className="space-y-1">
                                        <Controller
                                            control={control}
                                            name="difficulty"
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="rounded-xl bg-neutral-900 border border-neutral-700 text-white">
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="easy">Easy</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="hard">Hard</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    {/* Number of Questions */}
                                    <Counter
                                        label="Number of Questions"
                                        value={numberOfQuestions}
                                        min={5}
                                        max={50}
                                        step={1}
                                        increment={() => setValue("numberOfQuestions", Math.min(numberOfQuestions + 1, 50))}
                                        decrement={() => setValue("numberOfQuestions", Math.max(numberOfQuestions - 1, 5))}
                                    />

                                    {/* Participant Limit */}
                                    <Counter
                                        label="Participant Limit"
                                        value={participantLimit}
                                        min={2}
                                        max={500}
                                        step={1}
                                        increment={() => setValue("participantLimit", Math.min(participantLimit + 1, 500))}
                                        decrement={() => setValue("participantLimit", Math.max(participantLimit - 1, 2))}
                                    />

                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            className="w-full rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-semibold"
                                            disabled={isSubmitting}
                                        >
                                            {showCustomRoomForm ? "Create Room" : "Create Match"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full rounded-xl border-neutral-500 text-neutral-300"
                                            onClick={() => {
                                                setShowCustomForm(false)
                                                setShowCustomRoomForm(false)
                                            }}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </main>
    )
}
