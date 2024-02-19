import UserModel from "../models/user.model.js"
import __dirname from "../../utils.js"
import { logger } from "../../utils/logger.js"

class UserManagerMongo {

    getUser = async (uId) => {
        try {
            const user = await UserModel.findOne({ _id: uId });
            if (!user) {
                const error = new Error("User no encontrado");
                error.statusCode = 404; // Asigna un código de estado 404 al error
                throw error;
            }
            logger.info("User es: ", user);
            return user
        } catch (error) {
            throw error;
        }
    }

    cartExist = async (uId) => {
        try {
            const user = await UserModel.findOne({ _id: uId });
            if (!user) return logger.info("User no encontrado");
            //Si el usuario no posee carrito devuelve un false 
            const contenidoUserCart = user.carts;
            if (contenidoUserCart == "") return false
            else return user.carts[0].cart

        } catch (error) {
            throw error;
        }
    }

    addCartInUser = async (uId, cId) => {
        try {
            const user = await UserModel.findOne({ _id: uId });
            if (!user) return logger.info("User no encontrado");

            const contenidoUserCart = user.carts;

            if (contenidoUserCart == "") {
                user.carts.push({ "cart": cId, "inUse": true })
                // Guardar el user actualizado
                await user.save();
                // Devolver el user actualizado
                return user;
            }
        } catch (error) {
            throw error;
        }
    }

    searchUser = async (emailUser) => {
        try {
            const user = await UserModel.findOne({ email: emailUser });
            if (!user) return false;

            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default UserManagerMongo