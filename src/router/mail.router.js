
import nodemailer from "nodemailer"
import express from "express";
import __dir from "../utils.js";
import config from "../config/config.js";


const EMAIL = config.emailUser;
const PASS = config.emailPass;

const router = express.Router();

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: EMAIL,
        pass: PASS,
    }
})

router.get("/", async (req, res) => {
    const result = await transport.sendMail({
        from: "dario.e.miguel@gmail.com",
        to: "dario.e.miguel@gmail.com",
        subject: "Email de prueba",
        html: `
        <h1>Email de prueba usando nodemailer.</h1>`
    })
    console.log(result);
    res.send("Email enviado con exito!")
})

export default router