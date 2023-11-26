import ChatModel from "../models/messages.model.js"
import __dirname from "../../utils.js"

class ChatManagerMongo {

    constructor() {
        this.chats = this.getChats();
        this.counter;
    }

    getChats = async () => {
        try {
            const lectura = await ChatModel.find();
            return lectura || []

        } catch (error) {
            console.log("Hubo un error en la lectura de la base de datos.", error);
            throw error;
        }
    }

    addChat = async (user, message) => {
        try {
            // const newId = await this.createID()
            const productToAdd = {
                user: user,
                message: message,
                // id: newId
            }

            const result = await ChatModel.create(productToAdd);
            return result;

        } catch (error) {
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