import { Server, Socket } from "socket.io";
import http from "http";

let io: Server;

const initializeSocket = (server: http.Server): void => {
  if (!io) {
    io = new Server(server,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.on("connection", (socket: Socket) => {
      console.log("A user connected");
      // You can add your socket connection logic here
    });

    io.on("disconnect", () => {
      console.log("A user disconnected");
      // You can add your socket disconnection logic here
    });
  } else {
    console.warn("Socket.IO has already been initialized.");
  }
};

export { initializeSocket, io };
