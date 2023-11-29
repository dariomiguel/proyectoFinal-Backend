import express from "express";
import ProductManagerMongo from "../dao/managerMongo/ProductManagerMongo.js";

const productManager = new ProductManagerMongo();
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);
        const query = req.query?.query || "";
        const category = req.query?.category || "";
        const stockAvailability = req.query?.stockAvailability || "all";
        const priceOrder = req.query?.priceOrder || "ascending";

        const response = await productManager.getProducts(limit, page, query, category, stockAvailability, priceOrder);

        if (response.payload.length === 0) {
            res.status(404).json({ Error: "No se encontraron productos" });
            return;
        }
        res.render("realtimeproducts", {
            style: "realTimeProducts.css",
            response,
        });
    } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;
