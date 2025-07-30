export enum Role {
    User = 'user',
    Admin = 'admin',
    Public = "public"
}

export type TemporaryUser = {
    username: string;
    id: number;
    avatar: string;
}