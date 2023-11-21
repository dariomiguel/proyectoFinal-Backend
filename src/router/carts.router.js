// import ProductManager from "../dao/managerFS/ProductManager.js";
// import CartManager from "../dao/managerFS/CartManager.js"; 
import { Router } from "express";
import ProductManagerMongo from "../dao/managerMongo/ProductManagerMongo.js";
import CartManagerMongo from "../dao/managerMongo/CartManagerMongo.js";

const router = Router();
const cartManagerMongo = new CartManagerMongo();
const productManagerMongo = new ProductManagerMongo();
// const productManager = new ProductManager();

// ** Métodos  con file system
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-            F I L E   S Y S T E M            -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

//? router.post("/", async (req, res) => {
//     try {
//         const cart = await cartManager.createCart()
//         res.send(cart)
//     }
//     catch (error) {
//         res.status(500).send("Error al crea el carrito" + error)
//     }
// })

//? router.get('/', async (req, res) => {
//     try {
//         const carts = await cartManager.getCarts()
//         res.send(carts)

//     } catch (error) {
//         res.status(500).send("Error al obtener los carritos" + error)
//     }
// })

//? router.get("/:cid", async (req, res) => {
//     try {
//         const cartPorId = await cartManager.getCartById(req.params.cid);

//         if (typeof cartPorId === "string") {
//             res.json({ Error: cartPorId });
//         } else {
//             res.json({ cartPorId });
//         }
//     } catch (error) {
//         res.status(500).json({ Error: "Hubo un error al buscar el carrito por ID" });
//     }
// });


//? router.post('/:cid/product/:pid', async (req, res) => {
//     try {
//         const cid = parseInt(req.params.cid)
//         const pid = parseInt(req.params.pid)

//         const productPorId = await productManager.getProductById(pid);
//         const result = await cartManager.addProductInCart(cid, pid);

//         if (result === 'Carrito not found') return res.status(404).json({ Error: "No se encontró el carrito" });
//         if (typeof productPorId === "string") return res.status(404).json({ Error: "No se encontro el producto solicitado" });

//         res.send(result);

//     } catch (error) {
//         res.status(500).send("Error al agregar producto al carrito " + error)
//     }
// })

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-               M O N G O   D B               -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

router.post("/", async (req, res) => {
    try {
        const cart = await cartManagerMongo.createCart();

        console.log("Carrito creado con éxito!");
        res.status(201).json({ status: "success", payload: cart });
    }
    catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send("Error al crea el carrito" + error)
    }
})

router.get('/', async (req, res) => {
    try {
        const carts = await cartManagerMongo.getCarts();

        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        res.status(500).send("Error al obtener los carritos" + error)
    }
})

router.get("/:cid", async (req, res) => {
    try {
        const cartPorId = await cartManagerMongo.getCartById(req.params.cid);

        if (cartPorId === null) {
            res
                .status(404)
                .json({ Error: "No se encontro el producto solicitado" });
        } else {
            //*200 para respuestas exitosas
            res.status(200).json({ status: "success", payload: cartPorId })
        }

    } catch (error) {
        res.status(500).json({ Error: "Hubo un error al buscar el carrito por ID" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)

        const productPorId = await productManagerMongo.getProductById(pid);
        if (productPorId === null) {
            console.log("No se encontró el producto para agregar.");
            return res
                .status(404)
                .json({ Error: "No se encontró el producto solicitado" });
        }

        const cartPorId = await cartManagerMongo.getCartById(cid);
        if (cartPorId === null) {
            console.log("No se encontró el carrito solicitado.");
            return res
                .status(404)
                .json({ Error: "No se encontro el carrito solicitado" });
        }

        const productToAdd = await cartManagerMongo.addProductInCart(cid, pid);
        res.status(201).json({ status: "success", payload: productToAdd })

    } catch (error) {
        res.status(500).send({ Error: "Hubo un error al agregar producto al carrito " })
    }
})

//TODO
//delete

export default router