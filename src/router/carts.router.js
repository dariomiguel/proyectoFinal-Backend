import { Router } from "express";
import { Cart, Product } from "../DAO/factory.js";

const router = Router();
const cartManager = new Cart();
const product = new Product();

function auth(req, res, next) {
    if (req.session?.user) return next()

    res.redirect("/login")
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-               M O N G O   D B               -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();

        console.log("Carrito creado con id: 🛒 ", cart._id.toString());
        res.status(201).json({ status: "success", payload: cart });
    }
    catch (error) {

        console.error("Error al crear el carrito:", error);
        res.status(500).send("Error al crea el carrito" + error)
    }
})

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();

        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        res.status(500).send("Error al obtener los carritos" + error)
    }
})

router.get("/:cid", auth, async (req, res) => {
    try {
        const cartPorId = await cartManager.getCartById(req.params.cid);
        if (cartPorId === null) {
            res
                .status(404)
                .json({ Error: "No se encontró el carrito solicitado" });
        } else {
            //Si estoy usando un postman uso res.status
            if (req.headers['user-agent'].includes('Postman')) {
                return res.status(200).json({ status: "success", payload: cartPorId });
            }
            res.render("cartDetails", {
                style: "cartDetails.css",
                cartPorId
            })
        }

    } catch (error) {
        res.status(500).json({ Error: "Hubo un error al buscar el carrito por ID" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        const quantity = req.body.quantity || 1;

        console.log("La cantidad de productos que se va a agregar al carrito es: ", quantity);

        const existingCart = await cartManager.getCartById(cId);
        if (!existingCart) {
            console.error(`No se encontró el carrito con id: ${cId}`);
            return res.status(404).json({ error: `No se encontró el carrito con id: ${cId}` });
        }
        const existingProduct = await product.getProductById(pId);
        if (!existingProduct) {
            console.error(`No se encontró el producto con id: ${pId}`);
            return res.status(404).json({ error: `No se encontró el carrito con id: ${pId}` });
        }

        const productsIds = existingCart.products.map(product => {
            if (product.product && product.product._id) {
                const productObject = product.product.toJSON();
                return productObject._id.toString();
            }
            return null;
        });

        // Busca el índice del _id en la lista de _id
        const productIndex = productsIds.indexOf(pId);


        if (productIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad
            existingCart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no existe, agregarlo al carrito con la cantidad especificada
            existingCart.products.push({ product: pId, quantity });
        }

        // Actualizar el carrito en la base de datos
        await cartManager.updateCart(cId, existingCart);

        res.status(200).json({ message: `Producto con id: ${pId} agregado al carrito con id: ${cId} correctamente!` });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Hubo un error al agregar producto al carrito" });
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const cId = req.params.cid;

        await cartManager.deleteAllProductsFromCart(cId);

        res.status(200).json({ message: `Todos los productos del carrito con id:${cId} se eliminaron correctamente` });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).json({ error: "Hubo un error al eliminar todos los productos del carrito" });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {

    try {
        const cId = req.params.cid;
        const pId = req.params.pid;

        await cartManager.deleteProductFromCart(cId, pId);

        res.status(200).json({ message: `Producto con id:${pId} eliminado del carrito con id:${cId} correctamente` });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: "Hubo un error al eliminar el producto del carrito" });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const updatedProducts = req.body.products;

        // Validar si el carrito existe
        const existingCart = await cartManager.getCartById(cId);
        if (!existingCart) {
            console.error(`No se encontró el carrito con id:"${cId}"`);
            return res.status(404).json({ Error: `No se encontró el carrito con id:"${cId}"` });
        }

        // Actualizar los productos en el carrito
        existingCart.products = updatedProducts;

        // Actualizar el carrito en la base de datos
        await cartManager.updateCart(cId, existingCart);

        res.status(200).json({ message: `Carrito con id:${cId} actualizado correctamente` });
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: "Hubo un error al actualizar el carrito" });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        const newQuantity = req.body.quantity;

        console.log("La nueva cantidad que se va a usar para actualizar es: ", newQuantity);
        const existingCart = await cartManager.getCartById(cId);
        if (!existingCart) {
            console.error(`No se encontró el carrito con id:"${cId}"`);
            return res.status(404).json({ Error: `No se encontró el carrito con id:"${cId}"` });
        }

        const productIndex = existingCart.products.findIndex(product => product.product === pId);

        if (productIndex !== -1) {
            // Actualiza solo la cantidad del producto en el carrito
            existingCart.products[productIndex].quantity = newQuantity;

            // Actualiza el carrito en la base de datos
            await cartManager.updateProductQuantity(cId, existingCart, newQuantity, pId);

            res.status(200).json({ message: `Nueva cantidad del producto (${newQuantity}) con id:${pId} en el carrito con id:${cId}, se actualizó correctamente!` });
        } else {
            console.log(`No se encontró el producto con id:${pId} en el carrito con id:${cId}`);
            res.status(404).json({ Error: `No se encontró el producto con id:${pId} en el carrito con id:${cId}` });
        }
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
        res.status(500).json({ error: "Hubo un error al actualizar la cantidad del producto en el carrito" });
    }
});

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

//? router.get("/", async (req, res) => {
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


//? router.post("/:cid/product/:pid", async (req, res) => {
//     try {
//         const cid = parseInt(req.params.cid)
//         const pid = parseInt(req.params.pid)

//         const productPorId = await productManager.getProductById(pid);
//         const result = await cartManager.addProductInCart(cid, pid);

//         if (result === "Carrito not found") return res.status(404).json({ Error: "No se encontró el carrito" });
//         if (typeof productPorId === "string") return res.status(404).json({ Error: "No se encontro el producto solicitado" });

//         res.send(result);

//     } catch (error) {
//         res.status(500).send("Error al agregar producto al carrito " + error)
//     }
// })



export default router