import express from "express"
import { userService } from "../repositories/index.js";
import { logger } from "../utils/logger.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


const JWT_SECRET = config.privateKey;

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        res.render("sendEmailResetPass", {
            style: "style.css"
        });
    } catch (error) {
        logger.error("Error al obtener la página de enviar reset Pass:", error);
        res.status(500).send("Error al obtener la página de enviar reset Pass" + error)
    }
})

router.post("/:userEmail", async (req, res) => {
    try {
        const emailSearch = req.params.userEmail

        const response = await userService.getUser(emailSearch)
        if (!response) {
            logger.error("Usuario no encontrado", error)
            return res.status(404).send("Usuario no encontrado")
        };

        res.status(201).json({ status: "success", payload: response });
    } catch (error) {
        logger.error("Error al obtener la página de userEmail:", error);
        res.status(500).send("Error al obtener la página de userEmail" + error)
    }
})

router.get("/emailsent", async (req, res) => {
    try {
        res.render("resetEmailSent", {
            style: "style.css"
        });
    } catch (error) {
        logger.error("Error al obtener la página de email Enviado:", error);
        res.status(500).send("Error al obtener la página de email Enviado" + error)
    }
})

router.get("/reset", async (req, res) => {
    try {
        res.render("resetPass", {
            style: "style.css",
            decodedToken
        });
    } catch (error) {
        logger.error("Error al obtener la página:", error);
        res.status(500).send("Error al obtener la página" + error)
    }
})

router.get("/reset/:token", async (req, res) => {
    try {
        const token = req.params.token;
        // Verificar y decodificar el token
        try {
            const decodedToken = jwt.verify(token, JWT_SECRET);
            const decodedTokenString = JSON.stringify(decodedToken.email);

            // res.redirect("/recoverpass/reset")
            res.render("resetPass", {
                style: "style.css",
                token: token,
                decodedTokenString: decodedTokenString
            });
        } catch (error) {
            // Manejar el error, por ejemplo:
            logger.error('Error al decodificar el token:', error);

            res.redirect("/recoverpass");
        }

    } catch (error) {
        logger.error("Error al manejar la solicitud de restablecimiento de contraseña:", error);
        res.status(500).send("Error al manejar la solicitud de restablecimiento de contraseña");
    }
});

router.post("/reset/:token", async (req, res) => {
    try {
        const passUser = req.body

        let response = await userService.getUserAndPass(passUser.email, passUser.pass);
        if (response) logger.info(`La contraseña del usuario ${passUser.email} ha sido cambiada exitosamente`);

        res.status(200).json({ status: "success", payload: response });
    } catch (error) {
        logger.error("Error Fatal al cambiar pass:", error);
        res.status(500).send("Error Fatal al cambiar pass" + error)
    }
})


export default router