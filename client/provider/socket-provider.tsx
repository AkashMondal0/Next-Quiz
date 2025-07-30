'use client'
import { appInfo } from "@/config/app-details";
import { RootState } from "@/store";
import { createContext, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'sonner'
import { io, Socket } from "socket.io-client";

interface SocketStateType {
    socket: Socket | null
    sendDataToServer: (eventName: string, data: unknown) => void
}

export const SocketContext = createContext<SocketStateType>({
    socket: null,
    sendDataToServer: () => { }
})


const Socket_Provider = ({ children }: { children: React.ReactNode }) => {
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const socketRef = useRef<Socket | null>(null)

    const SocketConnection = useCallback(async () => {
        if (session) {
            if (socketRef.current) return;
            socketRef.current = io(`${appInfo.apiUrl.replace("/api/v1","/event")}`, {
                transports: ['websocket'],
                withCredentials: true,
                query: {
                    id: session.id,
                    username: session.username
                }
            })
        }
    }, [session?.id, socketRef.current])

    useEffect(() => {
        SocketConnection()
        if (socketRef.current && session?.id) {
            socketRef.current?.on('connect', () => {
                toast("User Connected")
            });
            socketRef.current?.on('disconnect', () => {
                toast("User Disconnected")
            });
            return () => {
                socketRef.current?.off('connect')
                socketRef.current?.off('disconnect')
            }
        }
    }, [session?.id])


    const sendDataToServer = useCallback((eventName: string, data: unknown) => {
        if (socketRef.current) {
            socketRef.current.emit(eventName, data)
        }
    }, [])


    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            sendDataToServer
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export default Socket_Provider