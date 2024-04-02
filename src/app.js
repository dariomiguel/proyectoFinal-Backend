import express from "express";
import handlebars from "express-handlebars";
import { configureSocket } from "./config/socketConfig.js";
import __dirname from "./utils.js";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import compression from "express-compression";
import cors from "cors"

//? Variables de entorno
const urlMongo = config.urlMongo;

import cartsRouter from "./router/carts.router.js";
import chatRouter from "./router/chat.router.js";
import lastProductRouter from "./router/lastProduct.router.js";
import productsRouter from "./router/products.router.js";
import realtimeproductsRouter from "./router/realTimeProducts.router.js";
import viewsRouter from "./router/views.router.js";
import userRouter from "./router/users.router.js";
import mailRouter from "./router/mail.router.js"
import MockingProductsRouter from "./router/mockingProducts.router.js";
import loggerTest from "./router/loggerTest.router.js"
import restorePass from "./router/restorePass.router.js"
import paymentRouter from "./router/payment.router.js"

import MongoStore from "connect-mongo";
import session from "express-session";
import sessionRouter from "./router/session.router.js"

import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { addLogger, logger } from "./utils/logger.js";

import swaggerJsdoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";

const app = express();
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(addLogger)
app.use(cors())

// Configuración de middleware para habilitar CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(session({
    store: MongoStore.create({
        mongoUrl: urlMongo,
        dbName: "login",
        ttl: 1000,
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
    helpers: {
        ifEquals: function (arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Agregamos la propiedad de Express para poder seleccionar la carpeta public
app.use(express.static(__dirname + "/public"))

//Rutas
app.use("/", viewsRouter);
app.use("/realtimeproducts", realtimeproductsRouter);
app.use("/chat", chatRouter);
app.use("/api/products", productsRouter);
app.use("/api/lastProduct", lastProductRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);
app.use("/mail", mailRouter);
app.use("/mockingproducts", MockingProductsRouter);
app.use("/loggerTest", loggerTest);
app.use("/recoverpass", restorePass);
app.use("/api/payments", paymentRouter)

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de E-Comerce",
            description: "Proyecto de e-commerce."
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);
app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))


//PASSPORT
initializePassport()
app.use(passport.initialize());
app.use(passport.session());

//Creamos una variable para el servidor  
const httpServer = app.listen(8080, () => logger.info("En linea..."));

//Creamos una variable que contenga el servidor socket basado en http
const io = configureSocket(httpServer);