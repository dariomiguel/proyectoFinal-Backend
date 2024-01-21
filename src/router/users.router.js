import { Router } from "express";
import { Cart } from "../DAO/factory.js";
import UserManagerMongo from "../DAO/mongo/UserManager.mongo.js";

const router = Router();
const cartManagerMongo = new Cart();
const userManagerMongo = new UserManagerMongo();


router.get("/", async (req, res) => {
    try {
        const user = req.session.user
        const uId = user._id;

        const response = await userManagerMongo.cartExist(uId);
        res.status(200).json({ payload: response });

    } catch (error) {
        console.error("Error al buscar usuario: ", error);
        res.status(500).json({ error: "Hubo un error al buscar usuario" });
    }
})

router.post("/cart/:cid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const user = req.session.user
        const uId = user._id;

        console.log("EL user id es : 🧑‍💻", uId);

        if (!uId) {
            console.error(`No se encontró el usuario con id:"${uId}"`);
            return res.status(404).json({ Error: `No se encontró el usuario con id:"${uId}"` });
        }

        const addingCart = await userManagerMongo.addCartInUser(uId, cId)
        res.status(200).json({ userId: uId, cartId: cId });

    } catch (error) {
        console.error("Error al actualizar la cantidad del user en el carrito:", error);
        res.status(500).json({ error: "Hubo un error al actualizar la cantidad del user en el carrito" });
    }
});

export default router