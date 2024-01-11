import { Server } from "socket.io";

const configureSocket = (httpServer) => {
    const io = new Server(httpServer);

    const messages = [];

    io.on("connection", (socket) => {
        console.log("New socket connection");

        socket.on("message", (data) => {
            console.log(data);
            messages.push(data);
            io.emit("logs", messages); // Envía a todos incluyendo el que envía
        });

        socket.on("ClienteEnvioProducto", (data) => {
            console.log("Se agregó un producto nuevo!😐", data);
            io.emit("mostrandoProductos", data);
        });
    });

    return io;
};

export { configureSocket };
