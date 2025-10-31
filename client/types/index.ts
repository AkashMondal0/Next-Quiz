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
    userAnswers: { [questionId: string]: string };
    score: number;
    timeTaken: number;
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
    answered: number;
}

export type RoomJoinPayload = {
    roomCode: string;
    player: Player;
}

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
}

export type RankUser = {
  username: string;
  color: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  rank: number;
  accuracy: number;
  avgTime: number;
  fastestAnswer: number;
  streak: number;
  id: number;
  isSubmitted?: boolean;
};
