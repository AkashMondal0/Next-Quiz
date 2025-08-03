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
}

export type RoomSessionActivityData = {
    type: "quiz_submit" | "quiz_answer";
    members: string[];
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
    matchEnded: boolean;
    matchDuration: number;
    matchResults: {
        totalMarks: number;
        userMarks: number;
        id: string;
        userAnswers: number[];
    }[];
}

export type quizAnswerRequest = {
    answers: number[];
    userId: string;
    code: string;
}