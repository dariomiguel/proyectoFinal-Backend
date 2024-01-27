import TicketModel from "../models/ticket.model.js";

class TicketManager {

    createTicket = async (cId) => {

        const ticketToAdd = {
            amount: 100, // Cambia esto por el monto deseado
            purchaser: cId, // Cambia esto por el nombre del comprador
        }

        const result = await TicketModel.create(ticketToAdd);

        console.log("Result de manager: ", result);
        return result;
    }
}

export default TicketManager