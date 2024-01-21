import config from "../config/config.js"

export let Cart
export let Product

console.log(`Persistence with ${config.persistence}`)

switch (config.persistence) {
    case "FILE":
        const { default: CartManagerFile } = await import("./file/CartManager.file.js")
        const { default: ProductManagerFile } = await import("./file/ProductManager.file.js")
        Cart = CartManagerFile;
        Product = ProductManagerFile;
        break;

    case "MONGO":
        const { default: CartManagerMongo } = await import("./mongo/CartManager.mongo.js")
        const { default: ProductManagerMongo } = await import("./mongo/ProductManager.mongo.js")
        Product = ProductManagerMongo;
        Cart = CartManagerMongo;
        break;

    default:
        throw new Error("Persistencie is not configured!")
}