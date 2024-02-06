import express from "express";
import { productService } from "../repositories/index.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

function auth(req, res, next) {
    if (req.session?.user) return next()

    res.redirect("/login")
}


router.get("/", auth, async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);
        const query = req.query?.query || "";
        const category = req.query?.category || "";
        const stockAvailability = req.query?.stockAvailability || "all";
        const priceOrder = req.query?.priceOrder || "ascending";

        const response = await productService.get(limit, page, query, category, stockAvailability, priceOrder);

        if (response.payload.length === 0) {
            logger.error("No se encontraron productos")
            res.status(404).json({ Error: "No se encontraron productos" });
            return;
        }
        logger.http("Success ")
        res.render("realtimeproducts", {
            style: "realTimeProducts.css",
            response,
        });
    } catch (error) {
        logger.error("Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;
