import express from "express";
import ProductManager from "../dao/managerFS/ProductManager.js";

const productManager = new ProductManager();
const router = express.Router();


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
        res.render("home", {
            products
        });
    } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
        res.status(500).json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;