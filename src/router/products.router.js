import { Router } from "express";
import __dirname from "../utils.js";
import { productService } from "../repositories/index.js";
import { authorize, logUser } from "../utils.js";
import CustomError from "../errors/customErrors.js";

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

router.post("/", logUser(), authorize("admin"), async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail } = req.body;

        const productoAInspeccionar = {
            title,
            price
        }
        if (!productoAInspeccionar?.title || !productoAInspeccionar?.price) {
            CustomError.createProduct(productoAInspeccionar)
        }


        const productoAgregado = await productService.create(title, description, code, price, stock, category, thumbnail)

        res
            //*201 para creaciones exitosas
            .status(201)
            .json({ message: "Producto agregado correctamente.😄", payload: productoAgregado });

    } catch (error) {
        if (error.statusCode === 4001) {
            console.log("\nEl precio debe ser un valor numérico.\n");
            return res.status(400).json({ error: "El precio debe ser un valor numérico" });

        } else if (error.statusCode === 4002) {
            console.log("\nEl stock debe ser un valor numérico.\n");
            return res.status(400).json({ error: "El stock debe ser un valor numérico" });

        } else if (error.statusCode === 4003) {
            console.log("La categoría no es válida");
            return res.status(400).json({ error: "Debes seleccionar una de estas categorías: cuadros-artesanias-bordados-esculturas" });

        } else if (error.statusCode === 4004) {
            console.log("\nVerifique que las propiedades no esten vacías😶.\n");
            res
                .status(400)
                .json({ Error: "Hubo un error al obtener los valores, asegúrese de haber completado todos los campos.😶" });
        }
        else if (error.code === 11000) {
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

router.get("/:pid", logUser(), async (req, res) => {
    try {
        const result = await productService.getProduct(req.params.pid);

        if (result === null) {
            res.status(404)
                .json({ Error: "No se encontro el producto solicitado" });
        }

        res.status(200).json({ status: "success", payload: result })

    } catch (error) {

        res
            .status(500)
            .json({ Error: "Hubo un error al buscar el producto por ID" });
    }

});

router.put("/:pid", logUser(), authorize("admin"), async (req, res) => {
    try {
        const productId = req.params.pid;
        const { key, value } = req.body;

        await productService.update(productId, key, value)

    } catch (error) {
        if (error.statusCode === 400) {
            console.error(`No se encontró la propiedad solicitada.`);
            return res
                .status(400)
                .json({ Error: `No se encontró la propiedad solicitada.` });
        } else if (error.statusCode === 404) {
            console.error(`No se encontro el producto con id solicitada.`)
            return res
                .status(404)
                .json({ Error: `No se encontro el producto con id solicitada.` });
        } else {
            res.status(500).json({ error: "Hubo un error al actualizar el producto" });
        }
    }
});

router.delete("/:pid", logUser(), authorize("admin"), async (req, res) => {
    try {
        const productId = req.params.pid;

        if (productId === null) {
            console.error(`No se encontró el producto con id:"${productId}"`);
            res.status(404).json({ Error: `No se encontró el producto con id:"${productId}"` });
        } else {
            console.log("El req session role es: ", req.session.user.role);
            await productService.delete(productId)
            res.status(201).json({ message: "Producto eliminado correctamente" });
        }

    } catch (error) {
        console.error("Error al eliminar el producto usando botón:", error);
        res.status(500).json({ error: "Hubo un error al eliminar el producto" });
    }
});

export default router;