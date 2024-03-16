
import nodemailer from "nodemailer"
import express from "express";
import __dir from "../utils.js";
import config from "../config/config.js";
import { logger } from "../utils/logger.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const EMAIL = config.emailUser;
const PASS = config.emailPass;
const JWT_SECRET = config.privateKey;


const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: EMAIL,
        pass: PASS,
    }
})

router.post("/reset-password/:emailUser", async (req, res) => {
    try {
        const email = req.params.emailUser;

        // Genera Token que dura 1h
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

        const resetLink = `http://localhost:8080/recoverpass/reset/${token}`;

        // Envia un email con el link
        const result = await transport.sendMail({
            from: "example@example.com",
            to: email,
            subject: "Reset Password",
            html: `Haga click <a href="${resetLink}">aquí</a> para resetear su contraseña. Este link expira en una hora.`
        });

        logger.info("Email para resetear contraseña enviado: ", result);
        res.send("Email para resetear contraseña enviado correctamente!");
    } catch (error) {
        logger.error("Error enviando email: ", error);
        res.status(500).send("Error enviando email");
    }
});

export default router