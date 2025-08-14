'use client'

import {
    useEffect,
    useContext,
    useState,
    useMemo,
    useCallback,
    useRef
} from 'react'
import {
    useForm,
    FormProvider
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { quizAnswerRequest, RoomSession } from '@/types'
import { SocketContext } from '@/provider/socket-provider'
import { event_name } from '@/config/app-details'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import CountdownTimer from '../CountdownTimer'
import api from '@/lib/axios'
import { toast } from 'sonner'

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const generateQuizSchema = (data: RoomSession | undefined | null) =>
    z.object(
        Object.fromEntries(
            data?.main_data?.map((_, index) => [`q${index}`, z.string().optional()]) ?? []
        )
    )

const MatchScreen = ({ data }: { data: RoomSession | undefined | null }) => {
    const session = useSelector((state: RootState) => state.AccountState.session)
    const roomSession = useSelector((state: RootState) => state.RoomState.roomSession)
    const { sendDataToServer, connectSocket, isConnected } = useContext(SocketContext)
    const router = useRouter()
    const schema = useMemo(() => generateQuizSchema(data), [data])
    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues: {},
    })
    const { handleSubmit, register, setValue, watch } = methods
    const [submitted, setSubmitted] = useState(false)
    const [isRankOpen, setIsRankOpen] = useState(false)
    const [answeredIndexes, setAnsweredIndexes] = useState<Set<number>>(new Set())
    const startTimeRef = useRef<number | null>(null)
    const isSubmittingRef = useRef<boolean>(false)

    const ResultPath = `/quiz/${data?.code}/result`

    const answers = watch()

    const rankingUser = useMemo(() => {
        return roomSession?.matchRanking
            ? [...roomSession.matchRanking].sort((a, b) => b.score - a.score)
            : []
    }, [roomSession])

    const userScore = useCallback(() => {
        let score = 0
        data?.main_data?.forEach((q, i) => {
            if (answers[`q${i}`] === q.options[q.correctIndex]) {
                score++
            }
        })
        return score
    }, [answers, data])

    const onValueChange = (value: string, questionIndex: number) => {
        setValue(`q${questionIndex}`, value)

        if (!answeredIndexes.has(questionIndex)) {
            sendDataToServer(event_name.event.roomActivity, {
                type: 'quiz_answer',
                members: data?.players.map((player) => player.id),
                id: session?.id,
                code: data?.code,
                totalAnswered: answeredIndexes.size + 1,
                score: userScore(),
            })

            setAnsweredIndexes((prev) => {
                const newSet = new Set(prev)
                newSet.add(questionIndex)
                return newSet
            })
        }
    }

    const handleSubmitAnswers = useCallback(async (formData: any) => {
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true
        try {
            const timeTaken = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0

            const answersArr: number[] = Object.keys(formData).map((key) => {
                const qIndex = parseInt(key.replace('q', ''), 10)
                const chosen = formData[key] as string | undefined
                if (chosen === undefined) return -1
                return data?.main_data?.[qIndex]?.options.indexOf(chosen) ?? -1
            })

            const quizAnswers: quizAnswerRequest = {
                answers: answersArr,
                userId: session?.id || '',
                code: data?.code || '',
                timeTaken,
            }

            // send to server
            await api.post('/room/submit-answers', quizAnswers)
            // navigate to result (replace so back won't resubmit)
            router.replace(ResultPath)
        } catch (err) {
            toast.error('Failed to submit answers')
        } finally {
            isSubmittingRef.current = false
            setSubmitted(false)
        }
    }, [data, session?.id, router, ResultPath])


    // const handleSubmitAnswers = async (formData: any) => {
    //     const score = userScore()
    //     const totalAnswered = Object.keys(formData).length
    //     const timeTaken = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0

    //     setSubmitted(true)

    //     sendDataToServer(event_name.event.roomActivity, {
    //         type: 'quiz_submit',
    //         members: data?.players.map((player) => player.id),
    //         id: session?.id,
    //         code: data?.code,
    //         totalAnswered,
    //         score,
    //         timeTaken, // 👈 send time spent in seconds
    //     })

    //     const quizAnswers: quizAnswerRequest = {
    //         answers: Object.keys(formData).map((key) => {
    //             const questionIndex = parseInt(key.replace('q', ''), 10)
    //             return data?.main_data?.[questionIndex]?.options.indexOf(formData[key]) ?? -1
    //         }),
    //         userId: session?.id || '',
    //         code: data?.code || '',
    //         timeTaken: timeTaken
    //     }

    //     sendDataToServer(event_name.event.roomEnded, quizAnswers)
    //     await new Promise((resolve) => setTimeout(resolve, 1800))
    //     router.replace(ResultPath)
    // }

    // const autoSubmit = useCallback(() => {
    //     if (!submitted && roomSession?.matchEnded && session?.id) {
    //         handleSubmitAnswers(answers)
    //     }
    // }, [answers, roomSession, submitted, session?.id])

    useEffect(() => {
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now()
        }
    }, [])


    useEffect(() => {
        if (!isConnected) {
            connectSocket()
        }
    }, [isConnected, connectSocket])

    // useEffect(() => {
    //     autoSubmit()
    // }, [roomSession?.matchEnded, autoSubmit])

    return (
        <div className="p-6 min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white">

            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Match Quiz</h1>
                <p className="text-base text-neutral-400">
                    Answer questions and climb the leaderboard.
                </p>
            </header>

            <CountdownTimer
                duration={data?.matchDuration || 120} // Default to 2 minutes if not set
                onComplete={() => handleSubmitAnswers(methods.getValues())}
            />

            {/* Floating Button for Mobile Ranking */}
            {!isRankOpen && (
                <div className="lg:hidden fixed bottom-5 right-5 z-50">
                    <Button
                        variant="outline"
                        onClick={() => setIsRankOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-full shadow-lg"
                    >
                        Live Ranking
                    </Button>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Quiz Form */}
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(handleSubmitAnswers)}
                        className="lg:col-span-2 flex flex-col gap-6"
                    >
                        {data?.main_data?.map((question, index) => (
                            <div
                                key={index}
                                className="bg-neutral-800 rounded-xl p-5 shadow-lg border border-neutral-700"
                            >
                                <h2 className="text-lg font-semibold mb-3">
                                    {index + 1}. {question.text}
                                </h2>
                                <RadioGroup
                                    className="space-y-2"
                                    onValueChange={(val) => onValueChange(val, index)}
                                    defaultValue={answers[`q${index}`]}
                                >
                                    {question.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex items-center gap-2">
                                            <RadioGroupItem
                                                value={option}
                                                id={`q${index}-opt-${optIndex}`}
                                                {...register(`q${index}`)}
                                            />
                                            <label
                                                htmlFor={`q${index}-opt-${optIndex}`}
                                                className="text-sm text-neutral-300"
                                            >
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        ))}

                        {!submitted ? (
                            <Button type="submit" className="w-fit">
                                Submit Answers
                            </Button>
                        ) : (
                            <></>
                            // <p className="text-green-400 font-semibold text-lg mt-4">
                            //     ✅ You answered {answeredIndexes.size} questions. Score: {userScore()}
                            // </p>
                        )}
                    </form>
                </FormProvider>

                {/* Desktop Ranking */}
                <div className="hidden lg:block relative">
                    <div className="bg-neutral-900 rounded-xl border border-neutral-700 p-5 sticky top-6 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">🏆 Ranking</h2>
                        <p className="text-sm text-neutral-400 mb-4">
                            Based on correct answers. Updated live.
                        </p>
                        <motion.div
                            className="space-y-3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <AnimatePresence>
                                {rankingUser.map((user) => {
                                    const _user = data?.players.find((p) => p.id === user.id)
                                    return (
                                        <motion.div
                                            key={user.id}
                                            className="flex items-center space-x-4 bg-neutral-800 px-4 py-3 rounded-lg border border-neutral-700"
                                            variants={itemVariants as any}
                                            layout
                                        >
                                            <Avatar className="w-10 h-10">
                                                <AvatarFallback className="bg-neutral-700 text-white font-bold">
                                                    {_user?.username?.[0] || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {_user?.username || `User ${user.id}`}
                                                </p>
                                                <p className="text-xs text-green-400">Score: {user.score}</p>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Ranking Drawer */}
            <AnimatePresence>
                {isRankOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/50"
                            onClick={() => setIsRankOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-screen-sm bg-neutral-900 rounded-t-2xl p-5 border-t border-neutral-700 max-h-[80vh] overflow-y-auto"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Live Ranking</h2>
                                <button
                                    onClick={() => setIsRankOpen(false)}
                                    className="text-neutral-400 hover:text-white text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                            <motion.div
                                className="space-y-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                            >
                                <AnimatePresence>
                                    {rankingUser.map((user) => {
                                        const _user = data?.players.find((p) => p.id === user.id)
                                        return (
                                            <motion.div
                                                key={user.id}
                                                className="flex items-center space-x-4 bg-neutral-800 px-4 py-3 rounded-lg border border-neutral-700"
                                                variants={itemVariants as any}
                                                layout
                                            >
                                                <Avatar className="w-10 h-10">
                                                    <AvatarFallback className="bg-neutral-700 text-white font-bold">
                                                        {_user?.username?.[0] || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-semibold">
                                                        {_user?.username || `User ${user.id}`}
                                                    </p>
                                                    <p className="text-xs text-green-400">Score: {user.score}</p>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default MatchScreen
