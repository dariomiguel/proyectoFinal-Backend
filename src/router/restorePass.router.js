import express from "express"
import { authorize, logUser } from "../utils.js"
import { logger } from "../utils/logger.js";

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        res.render("sendEmailResetPass", {
            style: "style.css"
        });
    } catch (error) {
        logger.error("Error al obtener los carritos:", error);
        res.status(500).send("Error al obtener los carritos" + error)
    }
})

router.get("/emailsent", async (req, res) => {
    try {
        res.render("resetEmailSent", {
            style: "style.css"
        });
    } catch (error) {
        logger.error("Error al obtener los carritos:", error);
        res.status(500).send("Error al obtener los carritos" + error)
    }
})

router.get("/reset", async (req, res) => {
    try {
        res.render("resetPass", {
            style: "style.css"
        });
    } catch (error) {
        logger.error("Error al obtener los carritos:", error);
        res.status(500).send("Error al obtener los carritos" + error)
    }
})

export default router