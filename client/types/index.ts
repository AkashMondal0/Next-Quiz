export type loadingType = "idle" | "pending" | "normal";

export type User = {
    id: string;
    username: string;
    email?: string;
    createdAt: string;
    updatedAt: string;
};