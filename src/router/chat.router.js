import express from "express";
import ChatManagerMongo from "../dao/managerMongo/ChatManagerMongo.js";

const router = express.Router();
const chatManagerMongo = new ChatManagerMongo();

router.get("/", (req, res) => {
    res.render("chat", {
        style: "chat.css"
    })
});

router.post("/", async (req, res) => {
    try {
        const { user, message } = req.body;

        // const algunaPropiedadVacia = await chatManagerMongo.isNotValidCode(title, description, code, price, stock, category, thumbnail);

        const chatAgregado = await chatManagerMongo.addChat(user, message);

        // if (algunaPropiedadVacia) {
        //     res
        //         .status(400)
        //         .json({ Error: "Hubo un error al obtener los valores, asegúrese de haber completado todos los campos.😶" });
        //     console.log("\nVerifique que las propiedades no esten vacías😶.\n");
        // } else {
        //     const chatAgregado = await chatManagerMongo.addChat(title, description, code, price, stock, category, thumbnail);
        //     res
        //         //*201 para creaciones exitosas
        //         .status(201)
        //         .json({ message: "Chat agregado correctamente.😄", payload: chatAgregado });
        // }

    } catch (error) {
        if (error.code === 11000) {
            console.error(`Ya existe un chat con el código '${error.keyValue.code}'.`);
            return res
                .status(400)
                .json({ Error: `Ya existe un chat con el código '${error.keyValue.code}' ` });

        } else if (error.name === "ValidationError") {
            return res
                .status(400)
                .json({ Error: "Error de validación en los datos del chat" });
        }

        console.error("Hubo un error general en la escritura de la base de datos:", error);
        res
            .status(500)
            .json({ error: "Hubo un error general en la escritura de la base de datos" });
    }
});


export default router