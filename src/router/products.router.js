import { Router } from "express"
import ProductManager from "../manager/ProductManager.js";


const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        // Listamos con límites
        const limit = req.query.limit;
        let products = await productManager.getProducts();

        if (limit) {
            const limitNumber = parseInt(limit, 10);
            if (!isNaN(limitNumber) && limitNumber >= 0) {
                products = products.slice(0, limitNumber);
            }
        }

        res.json(products);
    } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
        res.status(500).json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const productPorId = await productManager.getProductById(req.params.pid);

        if (typeof productPorId === "string") {
            res.json({ Error: productPorId });
        } else {
            res.json({ productPorId });
        }
    } catch (error) {
        res.status(500).json({ Error: "Hubo un error al buscar el producto por ID" });
    }
});


router.post("/", (req, res) => {
    const data = req.body

    data.id = products.length + 1
    products.push(data)

    res.json(data)
})

export default router