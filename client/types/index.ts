// new 2.0 types

export type TemporaryUser = {
    id: number | string;
    avatar: string;
    username: string;
}

export type Player = TemporaryUser & {
    isReady: boolean
    isHost: boolean
}

export type CreateQuizPayload = {
    prompt: string | null;
    difficulty: string;
    participantLimit: number;
    duration: number;
    player: Player;
    hostId: number | string;
    numberOfQuestions?: number;
}

export type RoomSession = {
    id: string;
    code: string;
    players: Player[];
    readyPlayers: Player[];
    hostId?: string | number;
    status: "waiting" | "joining" | "ready";
    createdAt?: string;
    updatedAt?: string;
    main_data: any[]; // ----->
    matchRanking?: MatchRanking[];
    matchStarted: boolean;
    matchEnded: boolean;
    matchDuration: number;
    matchResults: MatchResults[];
}

export type MatchResults = {
    id: string;
    username: string;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
    avgTime: number;
    streak: number;
    rank: number;
    accuracy: number;
    fastestAnswer: number;
}

export type MatchRanking = {
    id: string;
    username: string;
    score: number;
    rank: number;
}