import UserModel from "../models/user.model.js"
import __dirname from "../../utils.js"

class UserManagerMongo {

    cartExist = async (uId) => {
        try {
            const user = await UserModel.findOne({ _id: uId });
            if (!user) return console.log("User no encontrado");

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
            if (!user) return console.log("User no encontrado");

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

}

export default UserManagerMongo