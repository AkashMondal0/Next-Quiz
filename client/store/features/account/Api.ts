import { appInfo } from "@/config/app-details";
import api from "@/lib/axios";
import { RoomSession } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSession = createAsyncThunk(
    "get/session",
    async (args: undefined, thunkApi) => {
        try {
            const res = await api.get(appInfo.apiUrl + "/auth/session");
            return res.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.response?.data?.message || "fetch error",
            });
        }
    },
);

export const fetchRoomSession = createAsyncThunk(
    "get/room/session",
    async (id: string, thunkApi) => {
        try {
            const res = await api.get(appInfo.apiUrl + "/quiz/room/" + id);
            return res.data as RoomSession;
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.response?.data?.message || "fetch error",
            });
        }
    },
);

export const handleLogOut = createAsyncThunk(
    "post/logout",
    async (_, thunkApi) => {
        try {
            await api.delete(appInfo.apiUrl + "/auth/logout", {
                withCredentials: true,
            });
            location.reload();
            return true;
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message || "logout error",
            });
        }
    }
);

export const loginApi = async ({ email, password }: { email: string; password: string }) => {
    try {
        const res = await api.post(
            appInfo.apiUrl + "/auth/login",
            { email, password },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return res.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "login error");
    }
}

export const registerApi = async (
    {
        email,
        password,
        name,
        username,
    }: { email: string; password: string; name: string; username: string }) => {
    try {
        const res = await api.post(
            appInfo.apiUrl + "/auth/register",
            { email, password, name, username },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return res.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "register error");
    }
}
