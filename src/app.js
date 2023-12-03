import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

import { configureSocket } from "./socketConfig.js";

import __dirname from "./utils.js";

import cartsRouter from "./router/carts.router.js";
import chatRouter from "./router/chat.router.js";
import lastProductRouter from "./router/lastProduct.router.js";
import productsRouter from "./router/products.router.js";
import realtimeproductsRouter from "./router/realTimeProducts.router.js";
import viewsRouter from "./router/views.router.js";

import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRouter from "./router/session.router.js"

const urlMongo = "mongodb+srv://darioemiguel:GcY3pZnnUc67DfFj@cluster0.7tlrgmb.mongodb.net/";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: urlMongo,
        dbName: "login",
        mongoOption: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))



//Configuramos el motor de plantillas
app.engine("handlebars", handlebars.engine({
    //habilitamos el uso de las propiedades de mongo como propietarios
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
}));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Agregamos la propiedad de Express para poder seleccionar la carpeta public
app.use(express.static(__dirname + "/public"))

//Ruta de vistas
app.use("/", viewsRouter)
//Ruta de realtimeProducts
app.use("/realtimeproducts", realtimeproductsRouter);
//Ruta de chat
app.use("/chat", chatRouter);
//Ruta de producto
app.use("/api/products", productsRouter);
//Ruta de último producto
app.use("/api/lastProduct", lastProductRouter);
//Ruta de carrito
app.use("/api/carts", cartsRouter);
//Ruta de los logins
app.use("/api/session", sessionRouter)

mongoose.connect(urlMongo, { dbName: "ecommerce" })
    .then(() => {
        console.log("DB connected.");
        //Creamos una variable para el servidor  
        const httpServer = app.listen(8080, () => console.log("En linea..."));
        //Creamos una variable que contenga el servidor socket basado en http
        const io = configureSocket(httpServer);

    })
    .catch((error) => {
        console.error("Error conecting to DB", error);
    })

