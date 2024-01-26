import { Router } from "express"
// import { generateToken, authToken } from "../utils.js"
// import UserModel from "../DAO/models/user.model.js"
import passport from "passport"
import { authorize } from "../utils.js"

const router = Router()

router.get("/everyone", (req, res) => {
    res.send({ status: "success", payload: {} })
})


router.get("/current", passport.authenticate("jwt", { session: false }), authorize("user"), (req, res) => {

    res.send({ status: "success", payload: req.user })
})



// router.post("/register", async (req, res) => {
//     const user = req.body

//     const result = await UserModel.create(user)
//     console.log({ result })
//     const access_token = generateToken(result)

//     res.send({ status: "succes", access_token })
// })


// router.get("/private", authToken, (req, res) => {
//     res.send({ status: "succes", payload: req.user })
// })


export default router