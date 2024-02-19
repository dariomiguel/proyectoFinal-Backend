import express from "express"
import { userService } from "../repositories/index.js";
import { logger } from "../utils/logger.js";

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        res.render("sendEmailResetPass", {
            style: "style.css"
        });
    } catch (error) {
        logger.error("Error al obtener la página:", error);
        res.status(500).send("Error al obtener la página" + error)
    }
})

router.post("/:userEmail", async (req, res) => {
    try {
        const emailSearch = req.params.userEmail
        const response = await userService.getUser(emailSearch)

        res.status(201).json({ status: "success", payload: response });
    } catch (error) {
        logger.error("Error al obtener la página:", error);
        res.status(500).send("Error al obtener la página" + error)
    }
})

router.get("/emailsent", async (req, res) => {
    try {
        res.render("resetEmailSent", {
            style: "style.css"
        });
    } catch (error) {
        logger.error("Error al obtener la página:", error);
        res.status(500).send("Error al obtener la página" + error)
    }
})

router.get("/reset", async (req, res) => {
    try {
        res.render("resetPass", {
            style: "style.css"
        });
    } catch (error) {
        logger.error("Error al obtener la página:", error);
        res.status(500).send("Error al obtener la página" + error)
    }
})

export default router