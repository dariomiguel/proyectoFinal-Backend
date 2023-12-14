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

function justPublicWithoutSession(req, res, next) {
    if (req.session?.user) return res.redirect("/products")

    return next()
}

function auth(req, res, next) {
    if (req.session?.user) return next()

    res.redirect("/login")
}

router.get("/", justPublicWithoutSession, (req, res) => {
    return res.redirect("/products")
})

router.get("/login", justPublicWithoutSession, (req, res) => {
    return res.render("login", {
        style: "style.css",
        showHeaderLite: true
    })
})

router.get("/register", justPublicWithoutSession, (req, res) => {
    return res.render("register", {
        style: "login.css"
    })
})

router.get("/profile", auth, (req, res) => {
    const user = req.session.user

    res.render("profile", {
        style: "login.css",
        user
    })
})


router.get("/home", justPublicWithoutSession, async (req, res) => {
    try {

        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);
        const query = req.query?.query || "";
        const category = req.query?.category || "";
        const stockAvailability = req.query?.stockAvailability || "all";
        const priceOrder = req.query?.priceOrder || "ascending";

        const response = await productManagerMongo.getProducts(limit, page, query, category, stockAvailability, priceOrder);

        if (response.status === "404") res.render("error404", {})

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
})

router.get("/products", auth, async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);
        const query = req.query?.query || "";
        const category = req.query?.category || "";
        const stockAvailability = req.query?.stockAvailability || "all";
        const priceOrder = req.query?.priceOrder || "ascending";

        const response = await productManagerMongo.getProducts(limit, page, query, category, stockAvailability, priceOrder);
        const user = req.session.user

        if (response.status === "404") return res.redirect("/error404")

        res
            .render("products", {
                style: "style.css",
                showHeaderLogueado: true,
                result: response,
                user: user
            })

    } catch (error) {
        console.error("Products, Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

router.get("/error404", auth, async (req, res) => {
    try {
        res
            .render("error404", {
                style: "products.css",
            })

    } catch (error) {
        console.error("Products, Error al obtener la vista:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la vista" });
    }
});

export default router;