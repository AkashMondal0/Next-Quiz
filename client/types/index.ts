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
    roomCode: string | null;
    players: TemporaryUser[];
    status: "waiting" | "joining" | "ready";
    members?: number[];
}

export type RoomSessionActivityData = {
    type: "answered" | "joined" | "left" | "ready";
    members: string[];
    id: string | number | undefined;
    totalAnswered: number;
}

export type RoomSession = {
    id: string;
    roomCode: string;
    players: TemporaryUser[];
    readyPlayers: TemporaryUser[];
    hostId?: string | number;
    status: "waiting" | "joining" | "ready";
    createdAt?: string;
    updatedAt?: string;
    main_data: any;
    matchRanking?: {
        id: string;
        score: number;
    }[];
    matchDuration?: number;

}