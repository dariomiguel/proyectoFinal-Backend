import { Router } from "express";
import passport from "passport";
import { userService } from "../repositories/index.js";
import { authorize, generateToken } from "../utils.js";
import config from "../config/config.js"
import userInsertDTO from "../DTO/user.dto.js";

const githubId = config.githubId;
const githubSecret = config.githubSecret;
const githubUrl = config.githubUrl;

const router = Router();

router.post("/login", passport.authenticate("login", { failureRedirect: "/" }), async (req, res) => {
    try {
        const usuario = req.user;

        if (!usuario) return res.status(401).send({ status: "error", error: "Credenciales no validas!" })

        //!Para implementar JWT más adelante
        // const token = generateToken(usuario)
        // res.cookie("coderCookie", token, {
        //     maxAge: 60 * 60 * 1000,
        //     httpOnly: true
        // })

        const result = await userService.get(usuario)
        req.session.user = result

        return res.status(200).redirect("/products")
    } catch (error) {
        console.error("Error en el controlador /login:", error);
        return res.status(500).send("Error en el servidor")
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
        const userDTO = new userInsertDTO(req.session.user)
        return res.status(200).json(userDTO);
    } catch (error) {
        console.error("Error en la ruta /current:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/error" }),
    (req, res) => {

        req.session.user = req.user;

        console.log("Session iniciada correctamante", req.session.user);

        res.redirect("/")
    })

router.get("/error", (req, res) => res.send("ERROR EN LA AUTENTIFICACIÓN!"))

//! PREGUNTAR PORQUE NO FUNCIONA CON JWT
// router.get("/current", passport.authenticate("jwt", { session: false }), authorize("user"), (req, res) => {
//     try {
//         if (!req.user) return res.status(401).json({ error: "No hay usuario autenticado" });
//         (req, res) => {
//             res.send({ status: "success", payload: req.user })
//         }
//         // return res.status(200).json(req.session.user);
//     } catch (error) {
//         console.error("Error en la ruta /current:", error);
//         return res.status(500).json({ error: "Error en el servidor" });
//     }
// });
export default router