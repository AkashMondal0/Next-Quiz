import { useEffect, useContext, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RoomSession } from "@/types";
import { SocketContext } from "@/provider/socket-provider";
import { event_name } from "@/config/app-details";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const generateQuizSchema = (data: any) =>
    z.object(
        Object.fromEntries(
            data?.main_data?.map((_, index) => [
                `q${index}`,
                z.string().min(1, "Please select an option"),
            ]) ?? []
        )
    );

const MatchScreen = ({ data }: { data: RoomSession | undefined | null }) => {
    const session = useSelector((state: RootState) => state.AccountState.session);
    const roomSession = useSelector((state: RootState) => state.RoomState.roomSession);
    const { sendDataToServer, connectSocket, isConnected } = useContext(SocketContext);

    const schema = generateQuizSchema(data);
    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues: {},
    });

    const { handleSubmit, register, setValue, watch } = methods;
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [isRankOpen, setIsRankOpen] = useState(false);

    const rankingUser = roomSession?.matchRanking
        ? [...roomSession.matchRanking].sort((a, b) => b.score - a.score)
        : [];

    const userScore = () => {
        const answers = watch();
        let score = 0;
        data?.main_data?.forEach((q, i) => {
            if (answers[`q${i}`] === q.options[q.correctIndex]) {
                score++;
            }
        });
        return score;
    };

    const onValueChange = (value: string, questionIndex: number) => {
        setValue(`q${questionIndex}`, value);
        sendDataToServer(event_name.event.roomActivity, {
            type: "answered_question",
            members: data?.players.map((player: any) => player.id),
            id: session?.id,
            totalAnswered: answeredQuestions + 1,
            score: userScore(),
        });
        setAnsweredQuestions((prev) => prev + 1);
    };

    const onSubmit = (formData: any) => {
        const score = userScore();
        const totalAnswered = Object.keys(formData).length;
        setAnsweredQuestions(totalAnswered);
        setSubmitted(true);

        sendDataToServer(event_name.event.roomActivity, {
            type: "answered_question",
            members: data?.players.map((player: any) => player.id),
            id: session?.id,
            totalAnswered,
            score,
        });
    };

    useEffect(() => {
        if (!isConnected) {
            connectSocket();
        }
    }, [session?.id, isConnected, connectSocket]);

    return (
        <div className="p-6 min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white">
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-wide mb-2">Match Quiz</h1>
                <p className="text-base text-neutral-400">
                    Answer questions and climb the leaderboard.
                </p>
            </header>

            {/* Mobile Live Rank Button */}
            {/* Floating Action Button (Mobile Only) */}
            <div className="lg:hidden">
                {isRankOpen ? <></> : <Button
                    variant="outline"
                    onClick={() => setIsRankOpen(true)}
                    className="fixed bottom-5 right-5 z-50 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-full shadow-lg focus:outline-none"
                >
                    Live Ranking
                </Button>}
            </div>


            <div className="grid lg:grid-cols-3 gap-8">
                {/* Quiz Form */}
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
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
                                    defaultValue={watch(`q${index}`)}
                                >
                                    {question.options.map((option: string, optIndex: number) => (
                                        <div
                                            key={optIndex}
                                            className="flex items-center gap-2"
                                        >
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
                            <p className="text-green-400 font-semibold text-lg mt-4">
                                ✅ You answered {answeredQuestions} questions. Score: {userScore()}
                            </p>
                        )}
                    </form>
                </FormProvider>

                {/* Desktop Ranking Panel */}
                <div className="relative hidden lg:block">
                    <div className="bg-neutral-900 rounded-xl border border-neutral-700 h-full p-5 sticky top-6 overflow-y-auto max-h-[80vh] shadow-xl">
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
                                    const _user = data?.players.find((p: any) => p.id === user.id);
                                    return (
                                        <motion.div
                                            key={user.id}
                                            className="flex items-center space-x-4 bg-neutral-800 px-4 py-3 rounded-lg border border-neutral-700"
                                            variants={itemVariants}
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
                                                <p className="text-xs text-green-400">
                                                    Score: {user.score}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Lightweight Mobile Ranking Pop-up */}
            <AnimatePresence>
                {isRankOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/50"
                            onClick={() => setIsRankOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Pop Content */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-screen-sm bg-neutral-900 rounded-t-2xl p-5 border-t border-neutral-700 max-h-[80vh] overflow-y-auto overflow-x-hidden"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                                        const _user = data?.players.find((p: any) => p.id === user.id);
                                        return (
                                            <motion.div
                                                key={user.id}
                                                className="flex items-center space-x-4 bg-neutral-800 px-4 py-3 rounded-lg border border-neutral-700"
                                                variants={itemVariants}
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
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
};

export default MatchScreen;
