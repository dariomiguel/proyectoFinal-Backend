import express from "express";
import __dirname, { logUser, justPublicWithoutSession } from "../utils.js";
import { productService } from "../repositories/index.js";
import { logger } from "../utils/logger.js";

const router = express.Router();


router.get("/", justPublicWithoutSession(), (req, res) => {
    return res.redirect("/products")
})

router.get("/login", justPublicWithoutSession(), (req, res) => {
    return res.render("login", {
        style: "style.css",
        showHeaderLite: true
    })
})

router.get("/register", justPublicWithoutSession(), (req, res) => {
    return res.render("register", {
        style: "login.css"
    })
})

router.get("/profile", logUser(), (req, res) => {
    const user = req.session.user

    res.render("profile", {
        style: "login.css",
        user
    })
})


router.get("/home", justPublicWithoutSession(), async (req, res) => {
    try {

        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);
        const query = req.query?.query || "";
        const category = req.query?.category || "";
        const stockAvailability = req.query?.stockAvailability || "all";
        const priceOrder = req.query?.priceOrder || "ascending";

        const response = await productService.get(limit, page, query, category, stockAvailability, priceOrder);

        if (response.status === "404") {
            logger.error(response.status)
            res.render("error404", {})
        }

        logger.http("Success")
        res
            .render("home", {
                style: "home.css",
                result: response
            })

    } catch (error) {
        logger.error("Products, Error al obtener la lista de productos:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
})

router.get("/products", logUser(), async (req, res) => {
    try {
        const limit = parseInt(req.query?.limit || 10);
        const page = parseInt(req.query?.page || 1);
        const query = req.query?.query || "";
        const category = req.query?.category || "";
        const stockAvailability = req.query?.stockAvailability || "all";
        const priceOrder = req.query?.priceOrder || "ascending";

        const response = await productService.get(limit, page, query, category, stockAvailability, priceOrder);
        const user = req.session.user

        if (response.status === "404") {
            logger.error(response.status)
            return res.redirect("/error404")
        }

        logger.http("Success")
        res
            .render("products", {
                style: "style.css",
                showHeaderLogueado: true,
                result: response,
                user: user
            })

    } catch (error) {
        logger.error("Products, Error al obtener la lista de productos:", error ? error.message : "Error desconocido");
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la lista de productos" });
    }
});

router.get("/error404", logUser(), async (req, res) => {
    try {
        res
            .render("error404", {
                style: "products.css",
            })

    } catch (error) {
        logger.error("Products, Error al obtener la vista:", error);
        res
            .status(500)
            .json({ Error: "Hubo un error al obtener la vista" });
    }
});

export default router;