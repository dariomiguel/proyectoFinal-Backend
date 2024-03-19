import UserModel from "../models/user.model.js"
import __dirname, { createHash, isValidPassword } from "../../utils.js"
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

    searchUserAndPass = async (emailUser, newPass) => {
        try {

            const passHashed = createHash(newPass);
            const user = await UserModel.findOne({ email: emailUser.replace(/"/g, '') }).lean().exec()

            if (!isValidPassword(user, newPass)) {
                await UserModel.updateOne({ _id: user._id }, { $set: { password: passHashed } })
                return true
            } else {
                return false;
            }

        } catch (error) {
            throw error;
        }
    }

    updateUser = async (userID) => {
        try {
            const user = await UserModel.findOne({ _id: userID });

            if (!user) logger.info("No se encontro el usuario");

            if (user.role === "user") {
                logger.info("El usuario es user");
                await UserModel.updateOne({ _id: userID }, { $set: { role: "premium" } })
                return "premium"
            } else if (user.role === "premium") {
                logger.info("El usuario es premium");
                await UserModel.updateOne({ _id: userID }, { $set: { role: "user" } })
                return "user"
            }

            return false
        } catch (error) {
            throw error;
        }
    }

    updateUserDocuments = async (uId, documentName, documentLink) => {
        try {
            const user = await UserModel.findById(uId);
            if (!user) {
                logger.info("Usuario no encontrado");
                return false;
            }

            // Actualizar la propiedad documents del usuario
            user.documents.push({ name: documentName, link: documentLink });
            await user.save();

            logger.info("Documentos actualizados exitosamente");
            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default UserManagerMongo