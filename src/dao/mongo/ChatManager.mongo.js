import ChatModel from "../models/messages.model.js"
import __dirname from "../../utils.js"
import { logger } from "../../utils/logger.js"

class ChatManagerMongo {

    constructor() {
        this.chats = this.getChats();
    }

    getChats = async () => {
        try {
            const lectura = await ChatModel.find();
            return lectura || []

        } catch (error) {
            logger.error(error)
            throw error;
        }
    }

    addChat = async (user, message) => {
        try {
            const productToAdd = {
                user: user,
                message: message,
            }

            const result = await ChatModel.create(productToAdd);
            return result;

        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    isNotValidCode = async (user, message) => {
        //Verificamos que esten todos los productos en la carga de datos no estan vacíos.
        const someValid = !user || !message;
        //Si envía true significa que uno de los elementos está vacío.
        return someValid;
    }
}


export default ChatManagerMongo