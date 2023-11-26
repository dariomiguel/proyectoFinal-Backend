import express from "express";
// import ProductManager from "../dao/managerFS/ProductManager.js";
import ProductManagerMongo from "../dao/managerMongo/ProductManagerMongo.js"
import __dirname from "../utils.js";

const router = express.Router();
// const productManager = new ProductManager();
const productManagerMongo = new ProductManagerMongo();



// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-            F I L E   S Y S T E M            -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

//? router.get("/", async (req, res) => {
//     try {
//         const limit = req.query.limit;
//         let products = await productManager.getProducts();

//         if (products.length === 0) {
//             res.status(404).json({ Error: "No se encontraron productos" });
//             return;
//         }

//         if (limit) {
//             const limitNumber = parseInt(limit, 10);
//             if (!isNaN(limitNumber) && limitNumber >= 0) {
//                 products = products.slice(0, limitNumber);
//             }
//         }
//         res.render("home", {
//             products
//         });
//     } catch (error) {
//         console.error("Views router Error, al obtener la lista de productos:", error);
//         res.status(500).json({ Error: "Hubo un error al obtener la lista de productos" });
//     }
// });

//* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//* =-               M O N G O   D B               -=
//* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

router.get("/", async (req, res) => {
    try {
        // const limit = req.query.limit;
        // let products = await productManagerMongo.getProducts();
        // if (products.length === 0) {
        //     return res.status(404).json({ Error: "No se encontraron productos" });
        // }

        // if (limit) {
        //     const limitNumber = parseInt(limit, 10);
        //     if (!isNaN(limitNumber) && limitNumber >= 0) {
        //         products = products.slice(0, limitNumber);
        //     }
        // }
        // //Se realiza una limpieza para asegurar que el producto pueda ser usado por handlebars.
        // products = JSON.parse(JSON.stringify(products));

        const limit = parseInt(req.query?.limit ?? 4);
        const page = parseInt(req.query?.page ?? 1);

        const products = await productManagerMongo.getProducts(limit, page);

        res.render("home", {
            products
        })

    } catch (error) {
        console.error("Products, Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;