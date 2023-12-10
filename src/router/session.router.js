import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/login", passport.authenticate("login", { failureRedirect: "/" }), async (req, res) => {
    if (!req.user) return res.status(400).send("Invalid Credentials")
    req.session.user = req.user

    return res.send("Loged!")
})

router.post("/register", passport.authenticate("register", { failureRedirect: "/" }), async (req, res) => {
    res.send("registrado correctamente!")
})

// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body
//         if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" })
//         if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//             const user = {
//                 first_name: "admin",
//                 last_name: "admin",
//                 email: "adminCoder@coder.com",
//                 age: 0,
//                 password: "adminCod3r123",
//                 role: "admin"
//             }
//             req.session.user = user;
//             return res.status(200).redirect("/products")
//         }
//         let user = await UserModel.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1, password: 1 })

//         if (!user) return res.status(401).send("Authentication failed");
//         if (!isValidPassword(user, password)) return res.status(403).send({ status: "error", error: "Incomplete Password" })
//         delete user.password;

//         req.session.user = user;
//         return res.status(200).redirect("/products")

//     } catch (error) {
//         console.error("Error en el controlador /login:", error);
//         return res.status(500)
//     }
// })



// router.post("/register", async (req, res) => {
//     try {
//         const { first_name, last_name, age, email, password } = req.body;
//         if (!first_name || !last_name || !age || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" })

//         let user = {
//             first_name,
//             last_name,
//             age,
//             email,
//             password: createHash(password)
//         }

//         await UserModel.create(user)

//         return res.redirect("/")
//     } catch (error) {
//         console.error("Error en el controlador /register:", error);
//         return res.status(500).send("Error en el servidor");
//     }
// })

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