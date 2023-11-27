import express from "express";
import ProductManagerMongo from "../dao/managerMongo/ProductManagerMongo.js";

const productManager = new ProductManagerMongo();
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let products = await productManager.getProducts();
        if (products.length === 0) {
            return res.status(404).json({ Error: "No se encontraron productos" });
        }

        const limit = parseInt(req.query?.limit ?? 10);
        const page = parseInt(req.query?.page ?? 1);
        const query = req.query?.query ?? "";

        const result = await productManager.getProducts(limit, page, query);

        result.products = result.docs;
        result.query = query;
        delete result.docs

        res.render("realtimeproducts", {
            style: "realTimeProducts.css",
            result,
        });
    } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;
