import { TemporaryUser } from "src/lib/types";

export class Room { }

export class RoomCreatedResponse {
    members: number[];
    code: string | null;
    players?: TemporaryUser[];
    status?: "waiting" | "joining" | "ready";
    hostId?: any;
    createdAt?: any;
}

export class RoomMatchMakingState {
    code: string | null;
    players: TemporaryUser[];
    status: "waiting" | "joining" | "ready" | "full";
    members?: number[];
    roomSize: number;
    prompt?: {
        topic: string;
        difficulty: string;
        numberOfQuestions: number;
    };
}
export type QuestionResponse = {
    text: string;
    options: string[];
    correctIndex: number;
};
export type RoomSession = {
    id: string;
    code: string;
    members: string[] | number[]
    players: TemporaryUser[];
    readyPlayers: TemporaryUser[];
    hostId?: string | number;
    status: "waiting" | "joining" | "ready";
    createdAt?: string;
    updatedAt?: string;
    questions: QuestionResponse[];
    matchDuration: number;
    prompt: string;
    matchRanking: {
        id: string;
        score: number;
        isSubmitted: boolean;
    }[];
    matchEnded?: boolean;
    matchStarted?: boolean;
    matchResults: {
        totalMarks: number;
        userMarks: number;
        id: string;
        userAnswers: number[];
        timeTaken?: number; // Optional field for time taken by the user
    }[];
}