import express from "express";
import ProductManagerMongo from "../dao/managerMongo/ProductManagerMongo.js";

const productManager = new ProductManagerMongo();
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = await productManager.getProducts();
        products = JSON.parse(JSON.stringify(products));

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
            style: "realTimeProducts.css",
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
