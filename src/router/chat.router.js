import express from "express";
import ChatManagerMongo from "../DAO/mongo/ChatManager.mongo.js";

const router = express.Router();
const chatManagerMongo = new ChatManagerMongo();

function auth(req, res, next) {
    if (req.session?.user) return next()

    res.redirect("/login")
}

router.get("/", auth, async (req, res) => {
    try {
        const limit = req.query.limit;
        let chats = await chatManagerMongo.getChats();
        chats = JSON.parse(JSON.stringify(chats));

        if (chats.length === 0) {
            res.status(404).json({ Error: "No se encontraron chats" });
            return;
        }

        if (limit) {
            const limitNumber = parseInt(limit, 10);
            if (!isNaN(limitNumber) && limitNumber >= 0) {
                chats = chats.slice(0, limitNumber);
            }
        }

        const reversedchats = [...chats].reverse().filter((p) => p.user);

        res.render("chat", {
            style: "chat.css",
            reversedchats
        })
    } catch (error) {
        console.error("Error al obtener el historial del chat:\n", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { user, message } = req.body;

        const algunaPropiedadVacia = await chatManagerMongo.isNotValidCode(user, message);

        if (algunaPropiedadVacia) {
            res
                .status(400)
                .json({ Error: "Hubo un error al obtener los valores, asegúrese de haber completado todos los campos.😶" });
            console.log("\nVerifique que las propiedades no esten vacías😶.\n");
        } else {
            const chatAgregado = await chatManagerMongo.addChat(user, message);
            res
                //*201 para creaciones exitosas
                .status(201)
                .json({ message: "Chat agregado correctamente.😄", payload: chatAgregado });
        }

    } catch (error) {
        console.error("Hubo un error general en la escritura de la base de datos:", error);
        res
            .status(500)
            .json({ error: "Hubo un error general en la escritura de la base de datos" });
    }
});


export default router