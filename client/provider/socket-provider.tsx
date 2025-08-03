'use client'

import { appInfo, event_name } from "@/config/app-details";
import { RootState } from "@/store";
import {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'sonner'
import { io, Socket } from "socket.io-client";
import { RoomMatchMakingState, RoomSessionActivityData } from "@/types";
import { setRoomMatchMakingState, setRoomSessionScore, setRoomSessionSubmit } from "@/store/features/room/RoomSlice";

interface SocketStateType {
    socket: Socket | null
    sendDataToServer: (eventName: string, data: unknown) => void
    connectSocket: () => void
    disconnectSocket: () => void
    reconnectSocket: () => void
    isConnected: boolean
}

export const SocketContext = createContext<SocketStateType>({
    socket: null,
    sendDataToServer: () => { },
    connectSocket: () => { },
    disconnectSocket: () => { },
    reconnectSocket: () => { },
    isConnected: false
});

const Socket_Provider = ({ children }: { children: React.ReactNode }) => {
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const socketRef = useRef<Socket | null>(null)
    const dispatch = useDispatch()
    const [isConnected, setIsConnected] = useState(false)

    const setupListeners = useCallback(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.on('connect', () => {
            setIsConnected(true)
            toast.success("Socket connected");
        });

        socket.on('disconnect', () => {
            setIsConnected(false)
            toast.error("Socket disconnected");
        });

        socket.on(event_name.event.roomCreated, (data: RoomMatchMakingState) => {
            // console.log("Room created event received:", data);
            dispatch(setRoomMatchMakingState(data));
        });

        socket.on(event_name.event.roomActivity, (data: RoomSessionActivityData) => {
            switch (data.type) {
                case "quiz_answer":
                    dispatch(setRoomSessionScore(data));
                    break;
                case "quiz_submit":
                    dispatch(setRoomSessionSubmit());
                    break;
            }
        });
    }, [dispatch]);

    const removeListeners = useCallback(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.off('connect');
        socket.off('disconnect');
        socket.off(event_name.event.roomCreated);
    }, []);

    const connectSocket = useCallback(() => {
        if (!session || socketRef.current) return;

        const socket = io(`${appInfo.apiUrl.replace("/api/v1", "/event")}`, {
            transports: ['websocket'],
            withCredentials: true,
            query: {
                id: session.id,
                username: session.username
            }
        });

        socketRef.current = socket;
        setupListeners();
    }, [session, setupListeners]);

    const disconnectSocket = useCallback(() => {
        const socket = socketRef.current;
        if (socket) {
            removeListeners();
            socket.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
        dispatch(setRoomMatchMakingState(null));
        toast.info("Socket disconnected");
    }, [removeListeners]);

    const reconnectSocket = useCallback(() => {
        disconnectSocket();
        connectSocket();
    }, [disconnectSocket, connectSocket]);

    const sendDataToServer = useCallback((eventName: string, data: unknown) => {
        const socket = socketRef.current;
        if (socket?.connected) {
            socket.emit(eventName, data);
        } else {
            toast.warning("Socket not connected");
        }
    }, []);

    // Auto-connect on session load
    // useEffect(() => {
    //     if (session) {
    //         connectSocket();
    //     }

    //     return () => {
    //         disconnectSocket();
    //     };
    // }, [session, connectSocket, disconnectSocket]);

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            sendDataToServer,
            connectSocket,
            disconnectSocket,
            reconnectSocket,
            isConnected
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export default Socket_Provider;
