import { TemporaryUser } from "src/lib/types";

export type CreateQuizPayload = {
    prompt: string;
    difficulty: string;
    participantLimit: number;
    duration: number;
    player: TemporaryUser & {
        isReady: boolean
        isHost: boolean
    };
    hostId: string;
    numberOfQuestions?: number;
}

export type JoinRoomDto = {
    roomCode: string;
    player: TemporaryUser;
}