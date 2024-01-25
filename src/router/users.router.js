import { Router } from "express";
import { userService, cartService } from "../repositories/index.js";
import authorize from "../middleware/authorizationMiddleware.js";

const router = Router();

router.get("/", authorize("user"), async (req, res) => {
    try {
        const user = req.session.user
        const uId = user._id;

        let response = await userService.getCart(uId);
        if (!response) {
            const responseCreate = await cartService.create(user.role)
            response = responseCreate._id
        }
        res.status(200).json({ payload: response });

    } catch (error) {
        console.error("Error al buscar usuario: ", error);
        res.status(500).json({ error: "Hubo un error al buscar usuario" });
    }
})

router.post("/cart/:cid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const user = req.session.user
        const uId = user._id;

        if (!uId) {
            console.error(`No se encontró el usuario con id:"${uId}"`);
            return res.status(404).json({ Error: `No se encontró el usuario con id:"${uId}"` });
        }

        await userService.post(uId, cId)
        res.status(200).json({ userId: uId, cartId: cId });

    } catch (error) {
        console.error("Error al actualizar la cantidad del user en el carrito:", error);
        res.status(500).json({ error: "Hubo un error al actualizar la cantidad del user en el carrito" });
    }
});

export default router