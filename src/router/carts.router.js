import { Router } from "express";
import CartManager from "../manager/CartManager.js";

const router = Router()
const cartManager = new CartManager()

router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart()
        res.send(cart)
    }
    catch (err) {
        res.status(500).send("Error al crea el carrito" + err)
    }
})

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.send(carts)

    } catch (err) {
        res.status(500).send("Error al obtener los carritos" + err)
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const cartPorId = await cartManager.getCartById(req.params.cid);

        if (typeof cartPorId === "string") {
            res.json({ Error: cartPorId });
        } else {
            res.json({ cartPorId });
        }
    } catch (error) {
        res.status(500).json({ Error: "Hubo un error al buscar el carrito por ID" });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)

        const product = await cartManager.addProductInCart(cid, pid)

        res.send(product)

    } catch (err) {
        res.status(500).send("Error al agregar producto al carrito" + err)
    }
})

export default router