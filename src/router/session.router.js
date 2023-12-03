import { Router } from "express"
import UserModel from "../dao/models/user.model.js"

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email, password })

    if (!user) return res.status(404).send("User not Found");

    req.session.user = user;

    return res.redirect("/products")
})

router.post("/register", async (req, res) => {
    const user = req.body
    await UserModel.create(user)

    return res.redirect("/")
})

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send("logout error")

        return res.redirect("/")
    })
})

export default router