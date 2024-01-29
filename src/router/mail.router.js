
import nodemailer from "nodemailer"
import express from "express";
import __dir from "../utils.js";

const router = express.Router();

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "dario.e.miguel@gmail.com",
        pass: "poikyfvjoijapikk",
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