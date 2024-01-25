import { Router } from "express";
import { cartService, productService } from "../repositories/index.js";
import authorize from "../middleware/authorizationMiddleware.js";

const router = Router();

function auth(req, res, next) {
    if (req.session?.user) return next()

    res.redirect("/login")
}

router.get("/", async (req, res) => {
    try {
        const carts = await cartService.getCarts();

        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        res.status(500).send("Error al obtener los carritos" + error)
    }
})

router.post("/", authorize("user"), async (req, res) => {
    try {
        const cart = await cartService.create(req.user.role);
        res.status(201).json({ status: "success", payload: cart });
    }
    catch (error) {

        console.error("Error al crear el carrito:", error);
        res.status(500).send("Error al crea el carrito" + error)
    }
})

router.get("/:cid", auth, async (req, res) => {
    try {
        const cId = req.params.cid;
        const cartPorId = await cartService.get(cId);
        if (cartPorId === null) {
            res
                .status(404)
                .json({ Error: "No se encontró el carrito solicitado" });
        } else {
            //Si estoy usando un postman uso res.status
            if (req.headers['user-agent'].includes('Postman')) {
                return res.status(200).json({ status: "success", payload: cartPorId });
            }
            res.render("cartDetails", {
                style: "cartDetails.css",
                cartPorId
            })
        }

    } catch (error) {
        res.status(500).json({ Error: "Hubo un error al buscar el carrito por ID" });
    }
});

router.post("/:cid/purchase", auth, async (req, res) => {
    try {
        const cId = req.params.cid;
        console.log("el cid en el backend es", cId);

        const cartPorId = await cartService.get(cId);

        let total = 0;
        console.log("El total de la compra es de ", total);
        async function processProducts(cartPlain) {
            for (const product of cartPlain.products) {
                try {
                    const productDB = await productService.getProduct(product.product._id);
                    console.log("---------------------------------------");
                    console.log("La cantidad en stock es ", productDB.stock);
                    console.log("---------------------------------------");
                    console.log("Cantidad a comprar:", product.quantity);
                    console.log("El precio es: ", productDB.price);

                    if (productDB.stock >= product.quantity) {
                        console.log(`Se puede comprar ${product._id} , entonces restarlo del stock del producto y continuar.`);
                        total += (productDB.price * product.quantity);
                    } else {
                        console.log(`El producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, no se agregará al carrito.`);
                    }
                } catch (error) {
                    console.error("Error al procesar el producto:", error);
                }
            }
            console.log("El total de la compra es de ", total);
            console.log("000000000000000 FIN DE TICKET 00000000000000000");
        }

        const cartPlain = cartPorId.toObject({ getters: true, virtuals: true })
        processProducts(cartPlain);




        if (cartPorId === null) {
            res
                .status(404)
                .json({ Error: "No se encontró el carrito solicitado" });
        } else {
            if (req.headers['user-agent'].includes('Postman')) {
                return res.status(200).json({ status: "success", payload: cartPorId });
            }
            res.status(200).json({ status: "success", payload: cartPorId })
        }

    } catch (error) {
        res.status(500).json({ Error: "Hubo un error al buscar el carrito por ID" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        const quantity = req.body.quantity || 1;
        await cartService.productToCart(cId, pId, quantity);

        res.status(200).json({ message: `Producto con id: ${pId} (cantidad: ${quantity}) agregado al carrito con id: ${cId} correctamente!` });

    } catch (error) {
        if (error.statusCode = 4001) {
            console.error(`No se encontró el carrito con id: ${cId}`);
            return res.status(404).json({ error: `No se encontró el carrito con id solicitado` });

        } else if (error.statusCode = 4002) {
            console.error(`No se encontró el producto con id: ${pId}`);
            return res.status(404).json({ error: `No se encontró el carrito con id solicitado` });

        } else {
            console.error("Error al agregar producto al carrito:", error);
            res.status(500).json({ error: "Hubo un error al agregar producto al carrito" });
        }
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const cId = req.params.cid;
        await cartService.delete(cId);

        res.status(200).json({ message: `Todos los productos del carrito con id:${cId} se eliminaron correctamente` });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).json({ error: "Hubo un error al eliminar todos los productos del carrito" });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {

    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        await cartService.deleteProduct(cId, pId);

        res.status(200).json({ message: `Producto con id:${pId} eliminado del carrito con id:${cId} correctamente` });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: "Hubo un error al eliminar el producto del carrito" });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const updatedProducts = req.body.products;
        await cartService.update(cId, updatedProducts)

        res.status(200).json({ message: `Carrito con id:${cId} actualizado correctamente` });
    } catch (error) {
        if (error.statusCode === 4003) {
            console.error(`No se encontró el carrito con id solicitado`);
            return res.status(404).json({ Error: `No se encontró el carrito con id solicitado` });
        } else if (error.statusCode === 4004) {
            console.log(`No se encontró el producto en el carrito con id solicitado`);
            res.status(404).json({ Error: `No se encontró el producto en el carrito con id solicitado` });
        } else {
            console.error("Error al actualizar el carrito:", error);
            res.status(500).json({ error: "Hubo un error al actualizar el carrito" });
        }
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        const newQuantity = req.body.quantity;
        await cartService.updateQuantity(cId, pId, newQuantity)

        res.status(200).json({ message: `Nueva cantidad del producto (${newQuantity}) con id:${pId} en el carrito con id:${cId}, se actualizó correctamente!` });

    } catch (error) {
        if (error.statusCode === 4003) {
            console.error(`No se encontró el carrito con id solicitado`);
            return res.status(404).json({ Error: `No se encontró el carrito con id solicitado` });
        } else if (error.statusCode === 4004) {
            console.log(`No se encontró el producto en el carrito con id solicitado`);
            res.status(404).json({ Error: `No se encontró el producto en el carrito con id solicitado` });
        } else {
            console.error("Error al actualizar el carrito:", error);
            res.status(500).json({ error: "Hubo un error al actualizar el carrito" });
        }
    }
});

export default router