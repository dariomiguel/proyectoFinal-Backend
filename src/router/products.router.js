import { Router } from "express";
import { ProductManager } from "../DAO/factory.js";
import __dirname from "../utils.js";

const router = Router();
const productManager = new ProductManager();

// ** Métodos  con file system
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-            F I L E   S Y S T E M            -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

// ?router.get("/", async (req, res) => {
//     try {
//         // Listamos con límites
//         const limit = req.query.limit;
//         let products = await productManager.getProducts();

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

//         res.json(products);
//     } catch (error) {
//         console.error("Error al obtener la lista de productos:", error);
//         res
//             .status(500)
//             .json({ Error: "Hubo un error al obtener la lista de productos" });
//     }
// });

//? router.get("/:pid", async (req, res) => {
//     try {
//         const productPorId = await productManager.getProductById(req.params.pid);

//         if (typeof productPorId === "string") {
//             res.status(404).json({ Error: "No se encontro el producto solicitado" });
//         } else {
//             res.json({ productPorId });
//         }
//     } catch (error) {
//         res
//             .status(500)
//             .json({ Error: "Hubo un error al buscar el producto por ID" });
//     }
// });

//? router.post("/", async (req, res) => {
//     try {
//         const { title, description, code, price, stock, category, thumbnail } = req.body;

//         if (await productManager.isNotValidCode( title, description, code, price, stock, category, thumbnail)) {
//             return res
//                 .status(400)
//                 .json({
//                     message:
//                         "Atención: Verifique que todos los datos se hayan cargado correctamente o que el código de producto no se repita!",
//                 });
//         }
//         const productoAgregado = await productManager.addProduct(
//             title,
//             description,
//             code,
//             price,
//             stock,
//             category,
//             thumbnail
//         );

//         // socket.emit("ServerAddProducts", productoAgregado)

//         res.status(201).json({ message: "Producto agregado correctamente" });
//     } catch (error) {
//         console.error("Hubo un error en el proceso", error);
//         res.status(500).json({ error: "Hubo un error en el proceso" });
//     }
// });

//? router.put("/:pid", async (req, res) => {
//     try {
//         const productId = req.params.pid;
//         const { key, value } = req.body;

//         await productManager.updateProduct(productId, key, value);

//         const productPorId = await productManager.getProductById(productId);
//         if (typeof productPorId === "string") {
//             res.status(404).json({ Error: "No se encontro el producto solicitado" });
//         } else {
//             res.status(201).json({ message: "Producto actualizado correctamente" });
//         }
//     } catch (error) {
//         console.error("Error al actualizar el producto:", error);
//         res.status(500).json({ error: "Hubo un error al actualizar el producto" });
//     }
// });

// router.delete("/:pid", async (req, res) => {
//     try {
//         const productId = parseInt(req.params.pid);
//         const productPorId = await productManager.getProductById(productId);

//         if (typeof productPorId === "string") {
//             res.status(404).json({ Error: "No se encontro el producto solicitado" });
//         } else {
//             await productManager.deleteProduct(productId);
//             res.status(201).json({ message: "Producto eliminado correctamente" });
//         }
//     } catch (error) {
//         console.error("Error al eliminar el producto:", error);
//         res.status(500).json({ error: "Hubo un error al eliminar el producto" });
//     }
// });

//* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//* =-               M O N G O   D B               -=
//* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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

        //Manejo de excepciones para no permitir valores incorrectos
        const algunaPropiedadVacia = await productManager.isNotValidCode(title, description, code, price, stock, category, thumbnail);
        if (isNaN(price)) {
            console.log("\nEl precio debe ser un valor numérico.\n");
            return res.status(400).json({ error: "El precio debe ser un valor numérico" });
        }
        if (isNaN(stock)) {
            console.log("\nEl stock debe ser un valor numérico.\n");
            return res.status(400).json({ error: "El stock debe ser un valor numérico" });
        }
        if (category !== "cuadros" && category !== "artesanias" && category !== "bordados" && category !== "esculturas") {
            console.log("La categoría no es válida");
            return res.status(400).json({ error: "Debes seleccionar una de estas categorías: cuadros-artesanias-bordados-esculturas" });
        }
        if (algunaPropiedadVacia) {
            res
                .status(400)
                .json({ Error: "Hubo un error al obtener los valores, asegúrese de haber completado todos los campos.😶" });
            console.log("\nVerifique que las propiedades no esten vacías😶.\n");

        } else {
            const productoAgregado = await productManager.addProduct(title, description, code, price, stock, category, thumbnail);
            res
                //*201 para creaciones exitosas
                .status(201)
                .json({ message: "Producto agregado correctamente.😄", payload: productoAgregado });
        }

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
        const productPorId = await productManager.getProductById(req.params.pid);

        if (productPorId === null) {
            res
                .status(404)
                .json({ Error: "No se encontro el producto solicitado" });
        } else {
            res.status(200).json({ status: "success", payload: productPorId })
        }
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

        const productPorId = await productManager.getProductById(req.params.pid);
        if (productPorId === null) {
            console.error(`No se encontro el producto con id: ${productId}.`)
            return res
                .status(404)
                .json({ Error: `No se encontro el producto con id: ${productId}.` });
        }

        const resultOfValid = await productManager.validateProperty(productId, key);

        if (resultOfValid === undefined) {
            console.error(`No se encontró la propiedad "${[key]}".`);
            return res
                .status(404)
                .json({ Error: `No se encontró la propiedad "${[key]}".` });
        }

        const resultOfUpdate = await productManager.updateProductById(productId, key, value);
        if (resultOfUpdate !== null) res.status(201).json({ message: `Se actualizó la propiedad "${key}" del producto con id:"${productId}" correctamente!` });

    } catch (error) {
        res.status(500).json({ error: "Hubo un error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productPorId = await productManager.getProductById(productId);

        if (productPorId === null) {
            console.error(`No se encontró el producto con id:"${productId}"`);
            res.status(404).json({ Error: `No se encontró el producto con id:"${productId}"` });
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