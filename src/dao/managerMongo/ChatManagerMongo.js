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

    // createID = async () => {
    //     try {
    //         //*Buscamos el resultado que sea mas grande en la base de datos.
    //         const valorMaximo = await ChatModel.findOne().sort('-id').exec();
    //         if (!valorMaximo) return 0;

    //         //*Obtenemos todos los "products" para saber cuantos hay y verificar que coincida con el valor máximo (.lean se usa para convertilo en un objeto javascript)
    //         const todosLoss = await ChatModel.find({}, 'id').lean();
    //         if (valorMaximo.id === todosLoschats.length - 1) return valorMaximo.id + 1

    //         //*Buscamos cual id falta en la sucesión de números ID.
    //         return await this.findID();
    //     } catch (error) {
    //         console.error("Hubo un error en la creación del ID❗❗❗\n", error);
    //         throw error;
    //     }
    // }

    // findID = async () => {
    //     try {
    //         // Obtener todos los documentos de la colección "products" 
    //         const todosLoschats = await ChatModel.find({}, 'id').lean();
    //         // Extraer todos los IDs existentes en un array
    //         const idsExistente = todosLoschats.map(producto => producto.id);

    //         let idFaltante = 0;
    //         for (let i = 0; i < idsExistente.length; i++) {
    //             if (!idsExistente.includes(i)) {
    //                 idFaltante = i;
    //                 break;
    //             }
    //         }
    //         return idFaltante
    //     } catch (error) {
    //         console.error("Error al encontrar el ID que falta:\n", error);
    //     }
    // };

    // isNotValidCode = async (title, description, code, price, stock, category, thumbnail) => {
    //     //Verificamos que esten todos los productos en la carga de datos no estan vacíos.
    //     const someValid = !title || !description || !price || !thumbnail || !code || !stock || !category;
    //     //Si envía true significa que uno de los elementos está vacío.
    //     return someValid;
    // }

    // getChatById = async (pId) => {
    //     try {
    //         //* Buscamos elementos por Id en base de datos
    //         const productoBuscado = await ChatModel.findOne({ id: pId });
    //         return productoBuscado;
    //     } catch (error) {
    //         console.error("🤔No se encontró el producto solicitado\n", error);
    //         throw error;
    //     }
    // }

    // updateChatById = async (productId, keyUpdate, newValue) => {
    //     const idchat = productId;
    //     const nuevosDatos = { [keyUpdate]: newValue }

    //     try {
    //         await ChatModel.updateOne({ id: idchat }, { $set: nuevosDatos })
    //         console.log(`Se actualizó la propiedad '${[keyUpdate]}' del producto con id:'${idchat}' correctamente!`);

    //     } catch (error) {
    //         console.error('Error al actualizar el documento:\n', error);
    //         throw error;
    //     }
    // }

    // validateProperty = async (productId, keyUpdate) => {
    //     try {
    //         const idchat = productId;
    //         const validador = await ChatModel.findOne({ id: idchat, [keyUpdate]: { $exists: true } });

    //         if (keyUpdate === "id") return undefined;
    //         if (validador !== null) return validador;

    //     } catch (error) {
    //         console.error('No se pudo validar el documento:\n', error);
    //         throw error;
    //     }
    // }

    // deleteChat = async (pid) => {
    //     try {
    //         await ChatModel.deleteOne({ id: pid })
    //         console.log(`chat con id:${pid} se eliminó correctamente!`);
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // findLastId = async () => {
    //     try {
    //         // Intenta encontrar el último producto que se agregó a la base de datos.
    //         const ultimochat = await ChatModel.findOne().sort({ $natural: -1 });
    //         if (!ultimochat) {
    //             // Manejar el caso en el que no se encuentre ningún producto
    //             console.log("No se encontró ningún producto");
    //             return null;
    //         }

    //         return ultimochat
    //     } catch (error) {
    //         // Manejar errores
    //         console.error("Error al obtener el último ID:", error);
    //         throw error;
    //     }
    // }
}


export default ChatManagerMongo