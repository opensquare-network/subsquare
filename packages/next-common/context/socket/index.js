import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socketUrl = new URL("/", process.env.NEXT_PUBLIC_API_END_POINT).href;
    const socket = io(socketUrl);
    socket.connect();
    socket.on("connect", () => {
      setSocket(socket);
    });
    socket.on("disconnect", () => {
      setSocket(null);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={[socket, setSocket]}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const [socket] = useContext(SocketContext);
  return socket;
}
