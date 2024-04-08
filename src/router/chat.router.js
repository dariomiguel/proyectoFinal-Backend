import express from "express";
import { chatService } from "../repositories/index.js";
import { authorize, logUser, handleError } from "../utils.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

router.get("/", logUser(), authorize(["user", "premium"]), async (req, res) => {
    try {

        const limit = req.query.limit;
        const reversedchats = await chatService.get(limit)

        res.render("chat", {
            style: "chat.css",
            reversedchats
        })

    } catch (error) {
        logger.error(error)
        handleError(error, res)
    }
});

router.post("/", authorize(["user", "premium"]), async (req, res) => {
    try {
        const { user, message } = req.body;
        //Agregar Chat a la conversación
        const chatAgregado = await chatService.post(user, message)
        res
            //*201 para creaciones exitosas
            .status(201)
            .json({ message: "Chat agregado correctamente.😄", payload: chatAgregado });

    } catch (error) {
        logger.error(error)
        handleError(error, res)
    }
});


export default router