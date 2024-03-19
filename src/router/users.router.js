import { Router } from "express";
import { userService, cartService } from "../repositories/index.js";
import { authorize } from "../utils.js";
import { logger } from "../utils/logger.js";
// import { upload } from "../utils.js";
import multer from "multer"

const router = Router();


router.get("/", authorize(["user", "premium"]), async (req, res) => {
    try {
        const user = req.session.user
        const uId = user._id;

        let response = await userService.getCart(uId);

        if (!response) {
            const responseCreate = await cartService.create(user.role)
            response = responseCreate._id
        }
        logger.http("Success")
        res.status(200).json({ payload: response });

    } catch (error) {
        logger.error("Error al buscar usuario: ", error);
        res.status(500).json({ error: "Hubo un error al buscar usuario" });
    }
})

router.post("/cart/:cid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const user = req.session.user
        const uId = user._id;

        if (!uId) {
            logger.error(`No se encontró el usuario con id:"${uId}"`);
            return res.status(404).json({ Error: `No se encontró el usuario con id:"${uId}"` });
        }

        await userService.post(uId, cId)
        logger.http("Success")
        res.status(200).json({ userId: uId, cartId: cId });

    } catch (error) {
        logger.error("Error al actualizar la cantidad del user en el carrito:", error);
        res.status(500).json({ error: "Hubo un error al actualizar la cantidad del user en el carrito" });
    }
});

router.get("/premium/:uid", async (req, res) => {
    const uId = req.params.uid;
    const user = req.session.user

    try {
        if (uId === user._id) {
            logger.info("Son iguales")
            res.render("changeRole", {
                style: "style.css",
                user
            })
            return
        }

        logger.error(`No se encontró el usuario con id:"${uId}"`);
        return res.status(404).json({ Error: `No se encontró el usuario con id:"${uId}"` });

    } catch (error) {
        logger.error("Error al cambiar el rol de usuario :", error);
        res.status(500).json({ error: "Hubo un error al cambiar el rol de usuario " });
    }
})

// router.post("/premium/:uid", async (req, res) => {
//     const uId = req.params.uid;

//     try {
//         const response = await userService.put(uId)
//         if (!response) {
//             logger.error(`No se encontró el usuario con id:"${uId}"`);
//             return res.status(404).json({ Error: `No se encontró el usuario con id:"${uId}"` });
//         }
//         logger.info("El rol del usuario ha sido cambiado satisfactoriamente")

//         req.session.user.role = response
//         res.status(200).json({ payload: true });

//     } catch (error) {
//         logger.error("Error al cambiar el rol de usuario :", error);
//         res.status(500).json({ error: "Hubo un error al cambiar el rol de usuario " });
//     }

// })


router.get("/uid", authorize(["user", "premium"]), async (req, res) => {
    try {
        const user = req.session.user
        const uId = user._id;

        res.status(200).json({ status: "success", payload: uId });

    } catch (error) {
        logger.error("Error al buscar usuario: ", error);
        res.status(500).json({ error: "Hubo un error al buscar usuario" });
    }
})




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // let destinationFolder = "";
        // if (file.fieldname === "profileImage") {
        //     destinationFolder = "profiles";
        // } else if (file.fieldname === "productImage") {
        //     destinationFolder = "products";
        // } else if (file.fieldname === "document") {
        //     destinationFolder = "documents";
        // } else {
        //     destinationFolder = "others";
        // }
        // cb(null, `src/public/img/uploads/${destinationFolder}`);
        cb(null, `src/public/img/uploads/documents`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    limits: {
        // Limitar el tamaño del archivo a 2 MB (en bytes)
        fileSize: 2 * 1024 * 1024 // 2 MB
    }
});
const upload = multer({ storage: storage });

router.post('/:uid/documents/', upload.array("files"), async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.getUserById(userId);

        // const upadate = await userService.putDocuments(userId,)
        console.log("El req.files es: ", req.files);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si se cargaron documentos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado documentos' });
        }

        // Actualizar el estado del usuario para indicar que se han cargado documentos
        user.hasUploadedDocuments = true;
        await user.save();

        return res.status(200).json({ message: 'Documentos cargados exitosamente' });
    } catch (error) {
        console.error('Error al cargar documentos:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});
router.post('/:uid/documents/d', upload.array("profile"), async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.getUserById(userId);

        // const upadate = await userService.putDocuments(userId,)

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si se cargaron documentos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado documentos' });
        }

        console.log(req.files);

        // Actualizar el estado del usuario para indicar que se han cargado documentos
        user.hasUploadedDocuments = true;
        await user.save();

        return res.status(200).json({ message: 'Documentos cargados exitosamente' });
    } catch (error) {
        console.error('Error al cargar documentos:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});
router.post('/:uid/documents/products', upload.array("document"), async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.getUserById(userId);

        // const upadate = await userService.putDocuments(userId,)

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si se cargaron documentos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado documentos' });
        }

        console.log(req.files);

        // Actualizar el estado del usuario para indicar que se han cargado documentos
        user.hasUploadedDocuments = true;
        await user.save();

        return res.status(200).json({ message: 'Documentos cargados exitosamente' });
    } catch (error) {
        console.error('Error al cargar documentos:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});








router.put('/premium/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el usuario ha cargado todos los documentos necesarios
        if (!user.hasUploadedDocuments) {
            return res.status(400).json({ error: 'El usuario no ha cargado todos los documentos necesarios' });
        }

        // Actualizar el usuario a premium
        user.role = 'premium';
        await user.save();

        return res.status(200).json({ message: 'Usuario actualizado a premium correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario a premium:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});


export default router