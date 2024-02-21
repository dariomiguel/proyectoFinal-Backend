import express from "express";
import { chatService } from "../repositories/index.js";
import { authorize, logUser } from "../utils.js";
import { logger } from "../utils/logger.js";

const router = express.Router();



function handleError(error, res) {
    if (error.statusCode === 404) {
        logger.error("Error ")
        res.status(404).json({ Error: "No se encontraron chats" });
    } else if (error.statusCode === 400) {
        logger.error("Error ")
        res.status(400).json({ Error: "Hubo un error al obtener los valores, asegúrese de haber completado todos los campos.😶" });
    } else {
        logger.error(`Error al obtener el historial del chat:\n${error.message}`);
        res.status(500).json({ Error: "Hubo un error al obtener el chat" });
    }
}

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
        logger.info("Chat agregado correctamente.😄")
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