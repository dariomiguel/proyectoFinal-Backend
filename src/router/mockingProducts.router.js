import { Router } from "express";
import __dirname from "../utils.js";
import { mockingProductsService } from "../repositories/index.js";

const router = Router()

router.get("/", async (req, res) => {

    try {
        res.render("mockingProducts", {
            style: "cartDetails.css",
            // mockingProducts
        })

    } catch (error) {
        console.error("Error al generar lista de productos: ", error);
        res
            .status(500)
            .json({ Error: "Error al generar lista de productos" });
    }
})

router.post("/", async (req, res) => {
    try {
        const response = await mockingProductsService.post();
        console.log(response);
        res.json(response);
    } catch (error) {
        console.error("Error al generar lista de productos: ", error);
        res
            .status(500)
            .json({ Error: "Error al generar lista de productos" });
    }


})

export default router