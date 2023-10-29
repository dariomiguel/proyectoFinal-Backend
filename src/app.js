import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import productsRouter from "./router/products.router.js";
import cartsRouter from "./router/carts.router.js";
import viewsRouter from "./router/views.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuramos el motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Agregamos la propiedad de Express para poder seleccionar la carpeta public
app.use(express.static(__dirname + "/public"))

//Creamos una variable para el servidor  
const httpServer = app.listen(8080, () => console.log("En linea..."));
//Creamos una variable que contenga el servidor socket basado en http
const socketServer = new Server(httpServer);
//Creamos un evento para el socket
socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");

    socket.on("message", data => {
        console.log(data);

        socket.broadcast.emit("mensaje_al_resto")
    });
});


//Ruta de vistas
app.use("/", viewsRouter)
//Ruta de producto
app.use("/api/products", productsRouter);
//Ruta de carrito
app.use("/api/carts", cartsRouter);
