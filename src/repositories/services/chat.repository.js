export default class ChatRepository {

    constructor(dao) {
        this.dao = dao
    }

    get = async (limit) => {

        let chats = await this.dao.getChats()
        chats = JSON.parse(JSON.stringify(chats));

        if (chats.length === 0) {
            const error = new Error("No se encontraron chats");
            error.statusCode = 404; // Asigna un código de estado 404 al error
            throw error;
        }

        if (limit) {
            const limitNumber = parseInt(limit, 10);
            if (!isNaN(limitNumber) && limitNumber >= 0) {
                chats = chats.slice(0, limitNumber);
            }
        }
        const result = [...chats].reverse().filter((p) => p.user);
        return result
    }

    post = async (user, message) => {

        const algunaPropiedadVacia = await this.dao.isNotValidCode(user, message);

        if (algunaPropiedadVacia) {
            const error = new Error("Hubo un error al obtener los valores, asegúrese de haber completado todos los campos.😶");
            error.statusCode = 400; // Asigna un código de estado 404 al error
            throw error;
        } else {
            const chatAgregado = await this.dao.addChat(user, message);
            return chatAgregado

        }
    }
}