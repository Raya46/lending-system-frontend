import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Gunakan URL backend yang di-deploy atau localhost untuk development
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    console.log("Connecting to backend at:", backendUrl);
    const socketInstance = io(backendUrl, {
      // Gunakan polling sebagai transport utama karena Vercel tidak mendukung WebSocket
      transports: ["polling"],
      // Timeout yang lebih singkat untuk polling
      timeout: 20000,
      // Interval polling yang lebih sering
      forceNew: true,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket io server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket io server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinStudentRoom = (nim) => {
    if (socket) {
      socket.emit("join_student_room", nim);
    }
  };

  const joinAdminRoom = () => {
    if (socket) {
      socket.emit("join_admin_room");
    }
  };

  const leaveStudentRoom = (nim) => {
    if (socket) {
      socket.emit("leave_student_room", nim);
    }
  };

  const leaveAdminRoom = () => {
    if (socket) {
      socket.emit("leave_admin_room");
    }
  };

  const value = {
    socket,
    isConnected,
    joinStudentRoom,
    joinAdminRoom,
    leaveStudentRoom,
    leaveAdminRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
