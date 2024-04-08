import { Router } from "express";
import { cartService, productService, ticketService } from "../repositories/index.js";
import { authorize, logUser } from "../utils.js"
import { logger } from "../utils/logger.js";

const router = Router();

router.get("/", logUser(), async (req, res) => {
    try {
        const carts = await cartService.getCarts();

        logger.http("success ")
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        logger.error("Error al obtener los carritos:", error);
        res.status(500).send("Error al obtener los carritos" + error)
    }
})

router.post("/", logUser(), authorize(["user", "premium"]), async (req, res) => {
    try {
        const cart = await cartService.create(req.user.role);

        logger.http("success ")
        res.status(201).json({ status: "success", payload: cart });
    }
    catch (error) {

        logger.error("Error al crear el carrito:", error);
        res.status(500).send("Error al crea el carrito" + error)
    }
})

router.get("/:cid", logUser(), authorize(["user", "premium"]), async (req, res) => {

    try {
        const cId = req.params.cid;
        const cartPorId = await cartService.get(cId);
        if (cartPorId === null) {
            logger.error("Error ")
            res
                .status(404)
                .json({ Error: "No se encontró el carrito solicitado" });
        } else {
            //Si estoy usando un postman uso res.status
            if (req.headers["user-agent"].includes("Postman")) {
                return res.status(200).json({ status: "success", payload: cartPorId });
            }
            logger.info("Redireccionando a carrito... ")

            res.render("cartDetails", {
                style: "cartDetails.css",
                cartPorId
            })
        }

    } catch (error) {
        logger.error("Hubo un error al buscar el carrito por ID")
        res.status(500).json({ Error: "Hubo un error al buscar el carrito por ID" });
    }
});


router.post("/:cid", logUser(), authorize(["user", "premium"]), async (req, res) => {

    try {
        const cId = req.params.cid;
        const cartPorId = await cartService.get(cId);
        if (cartPorId === null) {
            logger.error("Error ")
            res
                .status(404)
                .json({ Error: "No se encontró el carrito solicitado" });
        } else {
            //Si estoy usando un postman uso res.status
            if (req.headers["user-agent"].includes("Postman")) {
                return res.status(200).json({ status: "success", payload: cartPorId });
            }
            logger.info("Redireccionando a carrito... ")
            res.json({ payload: cartPorId })
        }

    } catch (error) {
        logger.error("Hubo un error al buscar el carrito por ID")
        res.status(500).json({ Error: "Hubo un error al buscar el carrito por ID" });
    }
});

router.post("/:cid/product/:pid", logUser(), async (req, res) => {

    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        const quantity = req.body.quantity || 1;
        const user = req.session.user
        const searchProduct = await productService.getProduct(pId)

        if (user.role === "premium" && searchProduct.owner === user.email) {
            logger.error("Usted no puede agregar el producto al carro");
            res.status(403).json({ status: "Forbidden", payload: false })
            return false
        }
        const response = await cartService.productToCart(cId, pId, quantity);
        logger.info(`Producto con id: ${pId} (cantidad: ${quantity}) agregado al carrito con id: ${cId} correctamente!`)
        res.status(200).json({ status: "success", payload: response })

    } catch (error) {
        if (error.statusCode = 4001) {
            logger.error(`No se encontró el carrito por Id`);

            return res.status(404).json({ error: `No se encontró el carrito con id solicitado` });

        } else if (error.statusCode = 4002) {
            logger.error(`No se encontró el producto por Id`);
            return res.status(404).json({ error: `No se encontró el carrito con id solicitado` });

        } else {
            logger.error("Error al agregar producto al carrito:", error);
            res.status(500).json({ error: "Hubo un error al agregar producto al carrito" });
        }
    }
})

router.delete("/:cid", logUser(), async (req, res) => {

    try {
        const cId = req.params.cid;
        await cartService.delete(cId);

        res.status(200).json({ message: `Todos los productos del carrito con id:${cId} se eliminaron correctamente` });
    } catch (error) {
        logger.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).json({ error: "Hubo un error al eliminar todos los productos del carrito" });
    }
});

router.delete("/:cid/products/:pid", logUser(), async (req, res) => {

    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        await cartService.deleteProduct(cId, pId);

        logger.info(`Producto con id:${pId} eliminado del carrito con id:${cId} correctamente`)
        res.status(200).json({ message: `Producto con id:${pId} eliminado del carrito con id:${cId} correctamente` });
    } catch (error) {
        logger.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: "Hubo un error al eliminar el producto del carrito" });
    }
});

router.put("/:cid", logUser(), async (req, res) => {
    try {
        const cId = req.params.cid;
        const updatedProducts = req.body.products;
        await cartService.update(cId, updatedProducts)

        res.status(200).json({ message: `Carrito con id:${cId} actualizado correctamente` });
    } catch (error) {
        if (error.statusCode === 4003) {
            logger.error(`No se encontró el carrito con id solicitado`);
            return res.status(404).json({ Error: `No se encontró el carrito con id solicitado` });
        } else if (error.statusCode === 4004) {
            logger.error(`No se encontró el producto en el carrito con id solicitado`);
            res.status(404).json({ Error: `No se encontró el producto en el carrito con id solicitado` });
        } else {
            logger.error("Error al actualizar el carrito:", error);
            res.status(500).json({ error: "Hubo un error al actualizar el carrito" });
        }
    }
});

router.put("/:cid/products/:pid", logUser(), async (req, res) => {
    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        const newQuantity = req.body.quantity;
        await cartService.updateQuantity(cId, pId, newQuantity)

        res.status(200).json({ message: `Nueva cantidad del producto (${newQuantity}) con id:${pId} en el carrito con id:${cId}, se actualizó correctamente!` });

    } catch (error) {
        if (error.statusCode === 4003) {
            logger.error(`No se encontró el carrito con id solicitado`);
            return res.status(404).json({ Error: `No se encontró el carrito con id solicitado` });
        } else if (error.statusCode === 4004) {
            logger.error(`No se encontró el producto en el carrito con id solicitado`);
            res.status(404).json({ Error: `No se encontró el producto en el carrito con id solicitado` });
        } else {
            logger.error("Error al actualizar el carrito:", error);
            res.status(500).json({ error: "Hubo un error al actualizar el carrito" });
        }
    }
});

router.get("/:cid/purchase", logUser(), async (req, res) => {
    try {
        const cId = req.params.cid;
        const userT = req.session.user
        const userName = req.session.user.first_name
        await ticketService.post(cId, userT);

        const ticket = await ticketService.get(userName);

        logger.info("Redireccionando a ticket... ")
        logger.info(`El ticket del cliente es: ${ticket}`)

        res.render("ticket", {
            style: "ticket.css",
            ticket
        })

    } catch (error) {
        res.status(500).json({ Error: "Hubo un error al generar un ticket" });
    }
});

export default router