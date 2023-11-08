import express from "express";
import ProductManager from "../manager/ProductManager.js";

const productManager = new ProductManager();
const router = express.Router();

let socketServer; // Variable para almacenar la instancia de socketServer


// Método para configurar la instancia de socketServer
router.setSocketServer = (server) => {
    socketServer = server;
    socketServer.on("connection", socket => {
        console.log("Página actualizada", socket.id);

        socket.on("clientAddProduct", data => {
            console.log("Producto por agregar", data);
            // Emitir una respuesta al cliente
            socket.emit("ServerAddProducts", data);
        });

        // Puedes definir más eventos y escuchar emisiones aquí
    });
};

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = await productManager.getProducts();

        if (products.length === 0) {
            res.status(404).json({ Error: "No se encontraron productos" });
            return;
        }

        if (limit) {
            const limitNumber = parseInt(limit, 10);
            if (!isNaN(limitNumber) && limitNumber >= 0) {
                products = products.slice(0, limitNumber);
            }
        }
        res.render("realtimeproducts", {
            products
        });
    } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
        res.status(500).json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;