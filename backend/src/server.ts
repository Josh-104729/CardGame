import "reflect-metadata";
import dotenv from "dotenv";
import { createApp } from "./app";
import { AppDataSource } from "./config/database";
import io from "socket.io";
import { GameSocketHandler } from "./sockets/gameSocket";

dotenv.config();

const HOST = process.env.HOST;

if (!HOST) {
  console.log("Please add an env file");
  process.exit(1);
}

const app = createApp();

// HTTP Server
const PORT = 8050;
const server = app.listen(PORT, () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(`Luckyman app listening at http://${address.address}:${address.port}`);
  }
});

// Socket.IO Server
const SOCKET_PORT = 5050;
const socketServer = io(SOCKET_PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", socketServer);

// Initialize Socket Handlers
new GameSocketHandler(socketServer);

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database via TypeORM");
  })
  .catch((err) => {
    console.log(err);
    console.error("Database connection error:", err.message);
    console.error("Please check:");
    console.error("1. MySQL server is running");
    console.error("2. Database credentials in .env file are correct");
    console.error("3. MySQL is listening on port 3306");
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    AppDataSource.destroy().then(() => {
      console.log("Database connection closed");
      process.exit(0);
    });
  });
});

