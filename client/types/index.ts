// user account
export interface Session {
    id: string,
    username: string,
    email: string,
    name: string,
    profilePicture: string,
    accessToken?: string,
    bio?: string,
    privateKey: string
    publicKey: string
}
export interface AuthorData {
    id: string
    username: string
    email: string
    name: string
    profilePicture?: string | null
    isPrivate?: boolean | null
    isVerified?: boolean | null
    followed_by?: boolean | any
    following?: boolean | any
    bio?: string | any
    website?: string[] | any[];
    privateKey?: string
    publicKey?: string
}
export enum Role {
    User = 'user',
    Admin = 'admin',
}
export type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    password?: string; // Password might not be returned
    profilePicture: string | null;
    bio: string | null;
    website: string[] | any[];
    createdAt?: Date | string | null | unknown;
    updatedAt?: Date | string | null | unknown;
    isVerified?: boolean | false | null;
    isPrivate?: boolean | false | null;

    friendship: {
        followed_by: boolean; // if the user is followed by the following
        following: boolean; // if the user is following the following
    }
    postCount: number;
    followerCount: number;
    followingCount: number;
}