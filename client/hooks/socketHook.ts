import { SocketContext } from "@/provider/socket-provider";
import { useContext } from "react";

const useSocket = () => {
    const socketContext = useContext(SocketContext);

    if (!socketContext) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socketContext;
}

export default useSocket;