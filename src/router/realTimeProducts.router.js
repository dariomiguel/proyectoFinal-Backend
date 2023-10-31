import express from "express";
import ProductManager from "../manager/ProductManager.js";

const productManager = new ProductManager();
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        let products = await productManager.getProducts();

        if (limit) {
            const limitNumber = parseInt(limit, 10);
            if (!isNaN(limitNumber) && limitNumber >= 0) {
                products = products.slice(0, limitNumber);
            }
        }
        res.render("realTimeProducts", {
            products
        });
    } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
        res.status(500).json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;