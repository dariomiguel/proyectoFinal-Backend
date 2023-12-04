import { Router } from "express";
import UserModel from "../dao/models/user.model.js";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            const user = {
                first_name: "admin",
                last_name: "admin",
                email: "adminCoder@coder.com",
                age: 0,
                password: "adminCod3r123",
                role: "admin"
            }
            req.session.user = user;
            return res.status(200).redirect("/products")
        }
        let user = await UserModel.findOne({ email, password })

        if (!user) return res.status(401).send("Authentication failed");

        req.session.user = user;
        return res.status(200).redirect("/products")

    } catch (error) {
        console.error("Error en el controlador /login:", error);
        return res.status(500)
    }
})

router.post("/register", async (req, res) => {
    try {
        const user = req.body
        await UserModel.create(user)

        return res.redirect("/")
    } catch (error) {
        console.error("Error en el controlador /register:", error);
        return res.status(500).send("Error en el servidor");
    }
})

router.get("/logout", (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) return res.send("logout error")

            return res.redirect("/")
        })
    } catch (error) {
        console.error("Error en el controlador /logout:", error);
        return res.status(500).send("Error en el servidor");
    }
});

export default router