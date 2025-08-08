export type loadingType = "idle" | "pending" | "normal";

export type User = {
    id: string;
    username: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
};

export type TemporaryUser = {
    id: number | string;
    avatar: string;
    username: string;
}

export type RoomMatchMakingState = {
    code: string | null;
    players: TemporaryUser[];
    status: "waiting" | "joining" | "ready";
    members?: number[];
    roomSize: number;
}

export type RoomSessionActivityData = {
    type: "quiz_submit" | "quiz_answer" | "quiz_start" | "quiz_result_update";
    members: (string | number)[];
    id: string | number | undefined;
    totalAnswered: number;
    code?: string;
    score: number;
}
export type QuestionResponse = {
    text: string;
    options: string[];
    correctIndex: number;
};
export type QuizPrompt = {
    topic: string;
    numberOfQuestions?: number;
    difficulty?: "easy" | "medium" | "hard";
};
export type RoomSession = {
    id: string;
    code: string;
    players: TemporaryUser[];
    readyPlayers: TemporaryUser[];
    hostId?: string | number;
    status: "waiting" | "joining" | "ready";
    createdAt?: string;
    updatedAt?: string;
    main_data: QuestionResponse[];
    matchRanking?: {
        id: string;
        score: number;
    }[];
    matchStarted: boolean;
    prompt: QuizPrompt;
    matchEnded: boolean;
    matchDuration: number;
    matchResults: {
        totalMarks: number;
        userMarks: number;
        id: string;
        userAnswers: number[];
        timeTaken: number;
    }[];
}

export type quizAnswerRequest = {
    answers: number[];
    userId: string;
    code: string;
    timeTaken?: number; // in seconds
}


export type QuizBattleFormData = {
    topic: string
    difficulty: "easy" | "medium" | "hard"
    numberOfQuestions: number
    participantLimit: number
    roomCode: string
}
