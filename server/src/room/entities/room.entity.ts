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
    status: "waiting" | "joining" | "ready";
    members?: number[];
}
export type QuestionResponse = {
  text: string;
  options: string[];
  correctIndex: number;
};
export class RoomSession {
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
    matchEnded?: boolean;
    matchResults: {
        totalMarks: number;
        userMarks: number;
        id: string;
        userAnswers: number[];
    }[];
}