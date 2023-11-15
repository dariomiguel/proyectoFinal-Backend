import { Router } from "express";
import ProductManager from "../dao/manager/ProductManager.js";
import __dirname from "../utils.js";
import mongoose from "mongoose"
import ProductModel from "../dao/models/products.model.js"
// import { productsModel } from "../dao/models/products.model.js";

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
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

// router.get("/model", async (req, res) => {
//     try {
//         const limit = req.query.limit;
//         let products = await productsModel.find();

//         if (products.length === 0) {
//             res.status(404).json({ Error: "No se encontraron productos" });
//             return;
//         }

//         if (limit) {
//             const limitNumber = parseInt(limit, 10);
//             if (!isNaN(limitNumber) && limitNumber >= 0) {
//                 products = products.slice(0, limitNumber);
//             }
//         }

//         res.send({ result: "succes", payload: products })
//     } catch (error) {
//         console.error("Error al obtener la lista de productos:", error);
//         res
//             .status(500)
//             .json({ Error: "Hubo un error al obtener la lista de productos" });
//     }
// });

const urlMongo = "mongodb+srv://darioemiguel:GcY3pZnnUc67DfFj@cluster0.7tlrgmb.mongodb.net/"
router.get("api/users", async (req, res) => {
    const product = await ProductModel.find();

    res.json({ status: "succes", payload: product })
})

mongoose.connect(urlMongo, { dbName: "ecommerce" })
    .then(() => {
        console.log("DB connected.");
    })
    .catch(() => {
        console.error("Error conecting to DB");
    })




router.get("/:pid", async (req, res) => {
    try {
        const productPorId = await productManager.getProductById(req.params.pid);

        if (typeof productPorId === "string") {
            res.status(404).json({ Error: "No se encontro el producto solicitado" });
        } else {
            res.json({ productPorId });
        }
    } catch (error) {
        res
            .status(500)
            .json({ Error: "Hubo un error al buscar el producto por ID" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail } =
            req.body;
        if (
            await productManager.isNotValidCode(
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnail
            )
        ) {
            return res
                .status(400)
                .json({
                    message:
                        "Atención: Verifique que todos los datos se hayan cargado correctamente o que el código de producto no se repita!",
                });
        }
        const productoAgregado = await productManager.addProduct(
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail
        );

        // socket.emit("ServerAddProducts", productoAgregado)

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

        await productManager.updateProduct(productId, key, value);

        const productPorId = await productManager.getProductById(productId);
        if (typeof productPorId === "string") {
            res.status(404).json({ Error: "No se encontro el producto solicitado" });
        } else {
            res.status(201).json({ message: "Producto actualizado correctamente" });
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Hubo un error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productPorId = await productManager.getProductById(productId);

        if (typeof productPorId === "string") {
            res.status(404).json({ Error: "No se encontro el producto solicitado" });
        } else {
            await productManager.deleteProduct(productId);
            res.status(201).json({ message: "Producto eliminado correctamente" });
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Hubo un error al eliminar el producto" });
    }
});
export default router;
