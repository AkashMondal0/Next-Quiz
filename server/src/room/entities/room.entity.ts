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
export class RoomSession {
    id: string;
    code: string;
    members: string[] | number[]
    players: TemporaryUser[];
    readyPlayers: TemporaryUser[];
    hostId?: string | number;
    status: "waiting" | "joining" | "ready";
    createdAt?: string;
    updatedAt?: string;
    main_data: QuestionResponse[];
    prompt?: {
        topic: string;
        numberOfQuestions?: number;
        difficulty?: "easy" | "medium" | "hard";
        participantLimit?: number;
    }
    matchRanking: {
        id: string;
        score: number;
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