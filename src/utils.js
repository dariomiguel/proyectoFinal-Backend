import { fileURLToPath } from "url";
import { dirname } from "path";
import config from "./config/config.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { faker } from "@faker-js/faker"

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

    if (!token) return res.status(401).send({ error: "no auth" })

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Not authorized" })

        req.user = credentials.user
        next()
    })
}

export const authorize = (requiredRole) => {
    return async (req, res, next) => {
        try {
            // Verificar si hay un usuario autenticado en la sesión
            if (!req.session.user) return res.status(401).json({ error: "No hay usuario autenticado" });

            const user = req.session.user

            if (!user) return res.status(401).send({ error: "Sin autortizacion para acceder al contenido solicitado!" })
            if (user.role != requiredRole) return res.status(403).send({ error: "NO PERMISIONS!" })

            return next()
        } catch (error) {
            console.error("Error en el middleware de autorización:", error);
            return res.status(500).json({ error: "Error en el servidor" });
        }
    };
};



//! PREGUNTAR PORQUE NO FUNCIONA CON JWT
// export const authorize = requiredRole => {
//     return async (req, res, next) => {
//         try {
//             // Verificar si hay un usuario autenticado en la sesión
//             if (!req.user) {
//                 return res.status(401).json({ error: "No hay usuario autenticado" });
//             }

//             const user = req.user
//             // console.log("El rol del user es: ", user.user.role)
//             console.log("El rol requerido requiredRole es ", requiredRole);
//             console.log("El req session user es :", req.user);
//             console.log("El user es: ", user)

//             if (!user) return res.status(401).send({ error: "UNAUTHORIZED!" })
//             if (user.user.role != requiredRole) return res.status(403).send({ error: "NO PERMISIONS!" })

//             return next()
//         } catch (error) {
//             console.error("Error en el middleware de autorización:", error);
//             return res.status(500).json({ error: "Error en el servidor" });
//         }
//     };
// };


export const logUser = () => {
    return function logUser(req, res, next) {

        if (req.session?.user) return next()

        res.redirect("/login")
    }
};

export const justPublicWithoutSession = () => {
    return function justPublicWithoutSession(req, res, next) {
        if (req.session?.user) return res.redirect("/products")

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