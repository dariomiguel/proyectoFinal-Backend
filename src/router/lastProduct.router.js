import { Router } from "express";
import { productService } from "../repositories/index.js";
import __dirname from "../utils.js";
import { logger } from "../utils/logger.js";
const router = Router();


router.get("/", async (req, res) => {
    try {
        // Listamos con límites
        const limit = req.query.limit;
        let products = await productService.lastId();

        if (products.length === 0) {
            logger.error("No se encontraron productos :")
            res.status(404).json({ Error: "No se encontraron productos" });
            return;
        }

        if (limit) {
            const limitNumber = parseInt(limit, 10);
            if (!isNaN(limitNumber) && limitNumber >= 0) {
                products = products.slice(0, limitNumber);
            }
        }
        logger.http("success")
        res.status(200).json({ status: "success", payload: products })
    } catch (error) {
        logger.error("Products, Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;