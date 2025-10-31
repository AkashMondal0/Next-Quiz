'use client'

import { appInfo } from "@/config/app-details";
import {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDispatch } from "react-redux";
import { toast } from 'sonner'
import { io, Socket } from "socket.io-client";
import { Player, RoomSession, TemporaryUser } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { gameStart, joinUserInRoom, leaveUserFromRoom, playerReadyToggle, rankingActivity, resultUpdate, roomReset } from "@/store/features/account/AccountSlice";
import { useRouter } from "next/navigation";

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
    const [localData] = useLocalStorage<TemporaryUser>("username", {
        id: new Array(8).fill(null).map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join(''),
        username: new Array(8).fill(null).map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join(''),
        avatar: "",
    });
    const socketRef = useRef<Socket | null>(null)
    const dispatch = useDispatch()
    const [isConnected, setIsConnected] = useState(false)
    const router = useRouter();

    const setupListeners = useCallback(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('user-joined', (data: Player) => {
            dispatch(joinUserInRoom(data));
        });

        socket.on('user-left', (data: { playerId: string }) => {
            dispatch(leaveUserFromRoom(data.playerId));
        });

        socket.on('user-kicked', (err) => {
            dispatch(roomReset());
            router.replace('/');
        });

        socket.on('player-ready-toggle', (data: { playerId: string; roomCode: string; isReady: boolean }) => {
            // Handle player ready toggle event
            dispatch(playerReadyToggle({
                playerId: data.playerId,
                roomCode: data.roomCode,
                isReady: data.isReady
            }));
        });

        socket.on('start-game', () => {
            dispatch(gameStart());
        })

        socket.on('ranking-activity', (data: { playerId: string, roomCode: string, answeredCount: number }) => {
            // Handle ranking activity event
            dispatch(rankingActivity({
                playerId: data.playerId,
                roomCode: data.roomCode,
                answeredCount: data.answeredCount
            }));
        });

        socket.on('quiz-submitted', (data: { matchResults: RoomSession["matchResults"] }) => {
            // Handle quiz submitted event
            // You can dispatch an action or update the state as needed
            // console.log("Quiz submitted:", data.matchResults);
            dispatch(resultUpdate(data.matchResults))
        });
    }, [dispatch]);


    const removeListeners = useCallback(() => {
        const socket = socketRef.current;
        if (!socket) return;
        socket.off('connect');
        socket.off('disconnect');
        socket.off('user-joined');
        socket.off('user-left');
        socket.off('user-kicked');
        socket.off('player-ready-toggle');
        socket.off('start-game');
        socket.off('ranking-activity');
    }, []);

    const connectSocket = useCallback(() => {
        if (!localData.id || socketRef.current) return;

        const socket = io(`${appInfo.apiUrl.replace("/api/v1", "/event")}`, {
            transports: ['websocket'],
            withCredentials: true,
            query: {
                id: localData.id,
                username: localData.username
            }
        });

        socketRef.current = socket;
        setupListeners();
    }, [localData.username, localData.id, setupListeners]);

    const disconnectSocket = useCallback(() => {
        const socket = socketRef.current;
        if (socket) {
            removeListeners();
            socket.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
        // toast.info("Socket disconnected");
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
    useEffect(() => {
        if (localData.id) {
            connectSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [localData.id, connectSocket, disconnectSocket]);

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
