// new 2.0 types

export type TemporaryUser = {
    id: string;
    avatar: string;
    username: string;
}

export type Player = TemporaryUser & {
    isReady: boolean
    isHost: boolean
}

export type CreateQuizPayload = {
    prompt: string;
    difficulty: string;
    participantLimit: number;
    duration: number;
    player: Player;
    hostId: string;
    numberOfQuestions?: number;
}

export type RoomSession = {
    id: string;
    members: string[];
    code: string;
    players: Player[];
    readyPlayers: Player[];
    hostId: string | number;
    status: "waiting" | "joining" | "ready";
    participantLimit: number;
    difficulty: string;
    duration: number; // in seconds
    questions: any[];
    createdAt: string;
    matchRanking: MatchRanking[];
    matchStarted: boolean;
    matchEnded: boolean;
    matchDuration: number;
    matchResults: MatchResults[];
    prompt: string | null;
    numberOfQuestions?: number;
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

export type JoinRoomDto = {
    roomCode: string;
    player: Player;
}