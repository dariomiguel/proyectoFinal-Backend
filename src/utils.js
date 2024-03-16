import { fileURLToPath } from "url";
import { dirname } from "path";
import config from "./config/config.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { faker } from "@faker-js/faker"
import { logger } from "./utils/logger.js"
import UserModel from "./DAO/models/user.model.js";

const PRIVATE_KEY = config.privateKey;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generateToken = user => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" })

    return token
}

export const authToken = (req, res, next) => {
    const token = req.cookies["coderCookie"]

    if (!token) {
        logger.error("no auth")
        return res.status(401).send({ error: "no auth" })
    }
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        logger.error("Not authorized")
        if (error) return res.status(403).send({ error: "Not authorized" })

        req.user = credentials.user
        next()
    })
}

export const authorize = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            // Verificar si hay un usuario autenticado en la sesión
            if (!req.session.user) {
                logger.error("No hay usuario autenticado")
                return res.status(401).json({ error: "No hay usuario autenticado" });
            }

            const user = req.session.user
            if (!user) return res.status(401).send({ error: "Sin autortizacion para acceder al contenido solicitado!" })

            const hasRequiredRole = requiredRoles.some(role => user.role === role);
            if (!hasRequiredRole) {
                logger.error("NO PERMISIONS!")
                return res.status(403).send({ error: "NO PERMISIONS!" })
            }

            logger.info("Acceso autorizado ")
            logger.http("Acceso autorizado ")

            return next()
        } catch (error) {

            logger.error("Error en el middleware de autorización:", error);
            return res.status(500).json({ error: "Error en el servidor" });
        }
    };
};

export const logUser = () => {
    return function logUser(req, res, next) {
        if (req.session?.user) return next()

        logger.info("Redirección a login... ")
        res.redirect("/login")
    }
};

export const justPublicWithoutSession = () => {
    return function justPublicWithoutSession(req, res, next) {
        if (req.session?.user) return res.redirect("/products")

        logger.info("Verificando estado de sesión...")
        return next()
    }
}

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.uuid(),
        price: parseFloat(faker.commerce.price()),
        status: faker.datatype.boolean(),
        stock: faker.number.int(),
        category: faker.helpers.arrayElement(["cuadros", "artesanias", "bordados", "esculturas"]),
        thumbnail: faker.image.imageUrl()
    }
}

// Actualiza la fecha de inicio de sesión del usuario
export const updateLoginDate = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await UserModel.findByIdAndUpdate(userId, { $push: { "last_connection": { login: new Date() } } });

        next();
    } catch (error) {
        console.error("Error al actualizar la fecha de inicio de sesión:", error);
        next(error);
    }
};

// Actualiza la fecha de cierre de sesión del usuario
export const updateLogoutDate = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        await UserModel.findByIdAndUpdate(userId, { $push: { "last_connection": { logout: new Date() } } });

        next();
    } catch (error) {
        console.error("Error al actualizar la fecha de cierre de sesión:", error);
        next(error);
    }
};