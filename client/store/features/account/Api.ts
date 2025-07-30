import { appInfo } from "@/config/app-details";
import api from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSession = createAsyncThunk(
    "get/session",
    async (args: undefined, thunkApi) => {
        try {
            const res = await api.get(appInfo.apiUrl + "/auth/session");
            return res.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message || "fetch error",
            });
        }
    },
);

export const handleLogOut = async () => {
    await fetch(appInfo.apiUrl + "/auth/logout", {
        method: "POST",
        credentials: "include",
    });
    location.href = "/";
  }