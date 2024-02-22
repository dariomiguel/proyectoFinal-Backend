import { Router } from "express";
import { userService, cartService } from "../repositories/index.js";
import { authorize } from "../utils.js";
import { logger } from "../utils/logger.js";

const router = Router();


router.get("/", authorize(["user", "premium"]), async (req, res) => {
    try {
        const user = req.session.user
        const uId = user._id;

        let response = await userService.getCart(uId);

        if (!response) {
            const responseCreate = await cartService.create(user.role)
            response = responseCreate._id
        }
        logger.http("Success")
        res.status(200).json({ payload: response });

    } catch (error) {
        logger.error("Error al buscar usuario: ", error);
        res.status(500).json({ error: "Hubo un error al buscar usuario" });
    }
})

router.post("/cart/:cid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const user = req.session.user
        const uId = user._id;

        if (!uId) {
            logger.error(`No se encontró el usuario con id:"${uId}"`);
            return res.status(404).json({ Error: `No se encontró el usuario con id:"${uId}"` });
        }

        await userService.post(uId, cId)
        logger.http("Success")
        res.status(200).json({ userId: uId, cartId: cId });

    } catch (error) {
        logger.error("Error al actualizar la cantidad del user en el carrito:", error);
        res.status(500).json({ error: "Hubo un error al actualizar la cantidad del user en el carrito" });
    }
});

router.get("/premium/:uid", async (req, res) => {
    const uId = req.params.uid;
    const user = req.session.user

    try {
        if (uId === user._id) {
            logger.info("Son iguales")
            res.render("changeRole", {
                style: "style.css",
                user
            })
            return
        }

        logger.error(`No se encontró el usuario con id:"${uId}"`);
        return res.status(404).json({ Error: `No se encontró el usuario con id:"${uId}"` });

    } catch (error) {
        logger.error("Error al cambiar el rol de usuario :", error);
        res.status(500).json({ error: "Hubo un error al cambiar el rol de usuario " });
    }
})

router.post("/premium/:uid", async (req, res) => {
    const uId = req.params.uid;

    try {
        const response = await userService.put(uId)
        if (!response) {
            logger.error(`No se encontró el usuario con id:"${uId}"`);
            return res.status(404).json({ Error: `No se encontró el usuario con id:"${uId}"` });
        }
        logger.info("El rol del usuario ha sido cambiado satisfactoriamente")

        req.session.user.role = response
        res.status(200).json({ payload: true });

    } catch (error) {
        logger.error("Error al cambiar el rol de usuario :", error);
        res.status(500).json({ error: "Hubo un error al cambiar el rol de usuario " });
    }


})

export default router