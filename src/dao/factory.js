import config from "../config/config.js"

export let CartManager
export let ProductManager
export let ChatManager
export let UserManager

console.log(`Persistence with ${config.persistence}`)

switch (config.persistence) {
    case "FILE":
        const { default: CartManagerFile } = await import("./file/CartManager.file.js")
        const { default: ProductManagerFile } = await import("./file/ProductManager.file.js")
        const { default: ChatManagerFile } = await import("./file/ChatManager.file.js")
        const { default: UserManagerFile } = await import("./file/UserManager.file.js")

        CartManager = CartManagerFile;
        ProductManager = ProductManagerFile;
        ChatManager = ChatManagerFile;
        UserManager = UserManagerFile;

        break;

    case "MONGO":
        const { default: CartManagerMongo } = await import("./mongo/CartManager.mongo.js")
        const { default: ProductManagerMongo } = await import("./mongo/ProductManager.mongo.js")
        const { default: ChatManagerMongo } = await import("./mongo/ChatManager.mongo.js")
        const { default: UserManagerMongo } = await import("./mongo/UserManager.mongo.js")

        ProductManager = ProductManagerMongo;
        CartManager = CartManagerMongo;
        ChatManager = ChatManagerMongo;
        UserManager = UserManagerMongo;

        break;

    default:
        throw new Error("Persistencie is not configured!")
}