import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { configureSocket } from "./socketConfig.js";
import productsRouter from "./router/products.router.js";
import cartsRouter from "./router/carts.router.js";
import viewsRouter from "./router/views.router.js";
import realtimeproductsRouter from "./router/realTimeProducts.router.js";
import chatRouter from "./router/chat.router.js";
import mongoose from "mongoose";

const urlMongo = "mongodb+srv://darioemiguel:GcY3pZnnUc67DfFj@cluster0.7tlrgmb.mongodb.net/";

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
const io = configureSocket(httpServer);

//Ruta de vistas
app.use("/", viewsRouter)
//Ruta de realtimeProducts
app.use("/realtimeproducts", realtimeproductsRouter);
//Ruta de chat
app.use("/chat", chatRouter);
//Ruta de producto
app.use("/api/products", productsRouter);
//Ruta de carrito
app.use("/api/carts", cartsRouter);

mongoose.connect(urlMongo, { dbName: "ecommerce" })
    .then(() => {
        console.log("DB connected.");
    })
    .catch((error) => {
        console.error("Error conecting to DB", error);
    })

export { httpServer }