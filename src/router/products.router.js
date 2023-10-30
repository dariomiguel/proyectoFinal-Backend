import { Router } from "express"
import ProductManager from "../manager/ProductManager.js";


const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        // Listamos con límites
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
            res.status(404).json({ Error: "No se encontro el producto solicitado" });
        } else {
            res.json({ productPorId });
        }
    } catch (error) {
        res.status(500).json({ Error: "Hubo un error al buscar el producto por ID" });
    }
});


router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail } = req.body;
        if (await productManager.isNotValidCode(title, description, code, price, stock, category, thumbnail)) {
            return res.status(400).json({ message: "Atención: Verifique que todos los datos se hayan cargado correctamente o que el código de producto no se repita!" });
        }
        await productManager.addProduct(title, description, code, price, stock, category, thumbnail);

        res.status(201).json({ message: "Producto agregado correctamente" });

    } catch (error) {
        console.error("Hubo un error en el proceso", error);
        res.status(500).json({ error: "Hubo un error en el proceso" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const { key, value } = req.body;

        await productManager.updateProduct(productId, key, value)
        res.status(201).json({ message: "Producto actualizado correctamente" });

    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Hubo un error al actualizar el producto" });
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        await productManager.deleteProduct(productId)
        res.status(201).json({ message: "Producto eliminado correctamente" });

    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Hubo un error al eliminar el producto" });
    }
})
export default router