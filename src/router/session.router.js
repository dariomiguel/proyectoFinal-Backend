import { Router } from "express";
import passport from "passport";
import { userService } from "../repositories/index.js";
import authorize from "../middleware/authorizationMiddleware.js";

const router = Router();

router.post("/login", passport.authenticate("login", { failureRedirect: "/" }), async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales no validas!" })
        const result = await userService.get(req.user)

        req.session.user = result

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
            if (err) {
                console.error("Error al destruir la sesión:", err);
                return res.status(500).send("Error al destruir la sesión");
            }

            return res.redirect("/");
        });
    } catch (error) {
        console.error("Error en el controlador /logout:", error);
        return res.status(500).send("Error en el servidor");
    }
});

router.get("/current", authorize("user"), (req, res) => {
    try {
        if (!req.session.user) return res.status(401).json({ error: "No hay usuario autenticado" });
        return res.status(200).json(req.session.user);
    } catch (error) {
        console.error("Error en la ruta /current:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/error" }),
    (req, res) => {
        console.log("Callback: ", req.user);

        req.session.user = req.user;
        console.log("Session iniciada correctamante", req.session.user);

        res.redirect("/")
    })

router.get("/error", (req, res) => res.send("ERROR EN LA AUTENTIFICACIÓN!"))

export default router