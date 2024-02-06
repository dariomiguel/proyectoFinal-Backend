import { Server } from "socket.io";
import { logger } from "../utils/logger.js"

const configureSocket = (httpServer) => {
    const io = new Server(httpServer);

    const messages = [];

    io.on("connection", (socket) => {
        logger.info("New socket connection");

        socket.on("message", (data) => {
            logger.info(data);
            messages.push(data);
            io.emit("logs", messages); // Envía a todos incluyendo el que envía
        });

        socket.on("ClienteEnvioProducto", (data) => {
            logger.info("Se agregó un producto nuevo!😐", data);
            io.emit("mostrandoProductos", data);
        });
    });

    return io;
};

export { configureSocket };
