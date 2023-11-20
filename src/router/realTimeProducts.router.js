import express from "express";
import ProductManager from "../dao/managerFS/ProductManager.js";

const productManager = new ProductManager();
const router = express.Router();

let socketServer; // Variable para almacenar la instancia de socketServer

// Método para configurar la instancia de socketServer
router.setSocketServer = (server) => {
    socketServer = server;
    socketServer.on("connection", (socket) => {
        console.log("Página actualizada", socket.id);

        socket.on("clientAddProduct", async (data) => {
            let validador = await productManager.isNotValidCode(
                data.title,
                data.description,
                data.code,
                data.price,
                data.stock,
                data.category,
                data.thumbnail
            );

            if (!validador) {
                await productManager.addProduct(
                    data.title,
                    data.description,
                    data.code,
                    data.price,
                    data.stock,
                    data.category,
                    data.thumbnail
                );

                console.log("Producto agregado exitosamente");
                console.log("El id es : ", productManager.showId());

                const dataProducts = { ...data, id: productManager.showId() };
                socket.emit("ServerAddProducts", dataProducts);
            } else {
                console.error("el producto no es valido");
            }
        });
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

        const reversedproducts = [...products].reverse().filter((p) => p.title);

        res.render("realtimeproducts", {
            reversedproducts,
        });
    } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;
