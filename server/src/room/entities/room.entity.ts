import { TemporaryUser } from "src/lib/types";

export class Room { }

export class RoomCreatedResponse {
    members: number[];
    roomCode: string | null;
    players?: TemporaryUser[];
    status?: "waiting" | "joining" | "ready";
    hostId?: any;
    createdAt?: any;
}

export class RoomMatchMakingState {
    roomCode: string | null;
    players: TemporaryUser[];
    status: "waiting" | "joining" | "ready";
    members?: number[];
}