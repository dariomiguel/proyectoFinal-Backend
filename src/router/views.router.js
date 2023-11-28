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
        let products = await productManagerMongo.getProducts();
        if (products.length === 0) {
            return res.status(404).json({ Error: "No se encontraron productos" });
        }

        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);
        const query = req.query?.query || "";
        const category = req.query?.category || "";
        const stockAvailability = req.query?.stockAvailability || "all";
        const priceOrder = req.query?.priceOrder || "ascending";

        const result = await productManagerMongo.getProducts(limit, page, query, category, stockAvailability, priceOrder);


        let status = "success";
        if (result.docs.length === 0) {
            status = "error";
        }

        const response = {
            status: status,
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null,
            totalDocs: result.totalDocs //?Agregado para ver la cantidad de productos preguntar si eliminar o no
        };

        res
            .render("home", {
                style: "home.css",
                result: response
            })

    } catch (error) {
        console.error("Products, Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

export default router;