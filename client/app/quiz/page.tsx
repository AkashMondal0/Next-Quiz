"use client"

import React from "react"
import { useForm, Controller } from "react-hook-form"
import { motion } from "framer-motion"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

type QuizBattleFormData = {
    topic: string
    difficulty: "easy" | "medium" | "hard"
    numberOfQuestions: number
    participantLimit: number
}

export default function QuizBattleMatchPage() {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<QuizBattleFormData>({
        defaultValues: {
            topic: "",
            difficulty: "easy",
            numberOfQuestions: 10,
            participantLimit: 2,
        },
    })

    const numberOfQuestions = watch("numberOfQuestions")
    const participantLimit = watch("participantLimit")

    const onSubmit = async (data: QuizBattleFormData) => {
        console.log("Quiz Battle Match Created:", data)
        alert("Quiz Battle Match Created!")
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-neutral-900 to-black text-white">
            <motion.div
                className="max-w-xl w-full space-y-8"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: {},
                    show: {
                        transition: { staggerChildren: 0.1 },
                    },
                }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold text-center"
                >
                    🧠 Quiz Battle Setup
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-neutral-400"
                >
                    Customize your challenge and invite players to battle it out!
                </motion.p>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        show: { opacity: 1, y: 0 },
                    }}
                >
                    <Card className="bg-neutral-800 border border-neutral-700 rounded-2xl shadow-lg p-6">
                        <CardHeader>
                            <CardTitle className="text-xl text-center">Match Settings</CardTitle>
                            <CardDescription className="text-center text-neutral-400">
                                Set your quiz parameters
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                {/* Topic */}
                                <div className="space-y-1">
                                    <Textarea
                                        {...register("topic", { required: "Topic is required" })}
                                        placeholder="Enter topic (e.g. History, Tech...)"
                                        className="bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                                    />
                                    {errors.topic && <p className="text-sm text-red-500">{errors.topic.message}</p>}
                                </div>

                                {/* Difficulty */}
                                <div className="space-y-1">
                                    <Controller
                                        control={control}
                                        name="difficulty"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                                <Button
                                    type="submit"
                                    className="w-full rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-semibold"
                                    disabled={isSubmitting}
                                >
                                    Create Match
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </main>
    )
}
