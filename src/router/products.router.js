import { Router } from "express";
import __dirname from "../utils.js";
import { productService } from "../repositories/index.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);
        const query = req.query?.query || "";
        const category = req.query?.category || "";
        const stockAvailability = req.query?.stockAvailability || "all";
        const priceOrder = req.query?.priceOrder || "ascending";

        const response = await productService.get(limit, page, query, category, stockAvailability, priceOrder);

        if (response.payload.length === 0) {
            res.status(404).json({ Error: "No se encontraron productos" });
            return;
        }

        res.status(200).json({ status: "success", payload: response.payload })
    } catch (error) {
        console.error("Products, Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error en products.router al obtener la lista de productos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail } = req.body;
        await productService.create(title, description, code, price, stock, category, thumbnail)

    } catch (error) {
        if (error.code === 11000) {
            console.error(`Ya existe un producto con el código "${error.keyValue.code}".`);
            return res
                .status(400)
                .json({ Error: `Ya existe un producto con el código "${error.keyValue.code}" ` });

        } else if (error.name === "ValidationError") {
            return res
                .status(400)
                .json({ Error: "Error de validación en los datos del producto" });
        }

        console.error("Hubo un error general en la escritura de la base de datos:", error);
        res
            .status(500)
            .json({ error: "Hubo un error general en la escritura de la base de datos" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        await productService.getProduct(req.params.pid);

    } catch (error) {
        res
            .status(500)
            .json({ Error: "Hubo un error al buscar el producto por ID" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const { key, value } = req.body;

        await productService.update(productId, key, value)
    } catch (error) {
        res.status(500).json({ error: "Hubo un error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productService.delete(productId)

    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Hubo un error al eliminar el producto" });
    }
});

export default router;