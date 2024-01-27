import config from "../config/config.js"
import mongoose from "mongoose";
import { options } from "../config/commander.js";
//? Variables de entorno
const urlMongo = config.urlMongo;

export let CartManager
export let ProductManager
export let ChatManager
export let UserManager
export let TicketManager

console.log(`Persistence with ${options.p}`)

switch (options.p) {
    case "FILE":
        const { default: CartManagerFile } = await import("./file/CartManager.file.js")
        const { default: ProductManagerFile } = await import("./file/ProductManager.file.js")
        const { default: ChatManagerFile } = await import("./file/ChatManager.file.js")
        const { default: UserManagerFile } = await import("./file/UserManager.file.js")
        const { default: TicketManagerFile } = await import("./mongo/TicketManager.file.js")


        CartManager = CartManagerFile;
        ProductManager = ProductManagerFile;
        ChatManager = ChatManagerFile;
        UserManager = UserManagerFile;
        TicketManager = TicketManagerFile;

        break;

    case "MONGO":
        mongoose.connect(urlMongo, {
            serverSelectionTimeoutMS: 50000, // tiempo de espera para la selección del servidor
            socketTimeoutMS: 45000,
            dbName: "ecommerce"
        })
            .then(() => {
                console.log("DB connected.");
            })
            .catch((error) => {
                console.error("Error conecting to DB", error);
            })

        const { default: CartManagerMongo } = await import("./mongo/CartManager.mongo.js")
        const { default: ProductManagerMongo } = await import("./mongo/ProductManager.mongo.js")
        const { default: ChatManagerMongo } = await import("./mongo/ChatManager.mongo.js")
        const { default: UserManagerMongo } = await import("./mongo/UserManager.mongo.js")
        const { default: TicketManagerMongo } = await import("./mongo/TicketManager.mongo.js")

        ProductManager = ProductManagerMongo;
        CartManager = CartManagerMongo;
        ChatManager = ChatManagerMongo;
        UserManager = UserManagerMongo;
        TicketManager = TicketManagerMongo;

        break;

    default:
        throw new Error("Persistencie is not configured!")
}