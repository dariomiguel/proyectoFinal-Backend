import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/login", passport.authenticate("login", { failureRedirect: "/" }), async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales no validas!" })
        req.session.user = req.user

        return res.status(200).redirect("/products")
    } catch {
        console.error("Error en el controlador /login:", error);

        return res.status(500)
    }
})

router.post("/register", passport.authenticate("register", { failureRedirect: "/" }), async (req, res) => {
    try {
        return res.status(200).redirect("/")
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