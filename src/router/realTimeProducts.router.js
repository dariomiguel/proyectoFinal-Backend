import express from "express";
import ProductManager from "../manager/ProductManager.js";

const productManager = new ProductManager();
const router = express.Router();

let socketServer; // Variable para almacenar la instancia de socketServer

let productsFromClient;

// Método para configurar la instancia de socketServer
router.setSocketServer = async (server) => {
    socketServer = server;
    socketServer.on("connection", async (socket) => {
        console.log("Página actualizada", socket.id);

        let products = await productManager.getProducts();
        socket.on("clientAddProduct", data => {
            console.log("Producto por agregar", data);
            productsFromClient = data;

            products.push(productsFromClient)
            // Emitir una respuesta al cliente
            socket.emit("ServerAddProducts", products);
        });

        // Puedes definir más eventos y escuchar emisiones aquí
    });
};

// router.get("/", async (req, res) => {
//     try {
//         const limit = req.query.limit;
//         let products = await productManager.getProducts();

//         if (products.length === 0) {
//             res.status(404).json({ Error: "No se encontraron productos" });
//             return;
//         }

//         if (limit) {
//             const limitNumber = parseInt(limit, 10);
//             if (!isNaN(limitNumber) && limitNumber >= 0) {
//                 products = products.slice(0, limitNumber);
//             }
//         }
//         res.render("realtimeproducts", {
//             products
//         });
//     } catch (error) {
//         console.error("Error al obtener la lista de productos:", error);
//         res.status(500).json({ Error: "Hubo un error al obtener la lista de productos" });
//     }
// });

// router.post("/", async (req, res) => {
//     try {
//         const { title, description, code, price, stock, category, thumbnail } = productsFromClient;
//         if (await productManager.isNotValidCode(title, description, code, price, stock, category, thumbnail)) {
//             return res.status(400).json({ message: "Atención: Verifique que todos los datos se hayan cargado correctamente o que el código de producto no se repita!" });
//         }
//         await productManager.addProduct(title, description, code, price, stock, category, thumbnail);

//         res.status(201).json({ message: "Producto agregado correctamente" });

//     } catch (error) {
//         console.error("Hubo un error en el proceso", error);
//         res.status(500).json({ error: "Hubo un error en el proceso" });
//     }
// });

export default router;