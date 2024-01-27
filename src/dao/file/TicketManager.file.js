import TicketModel from "../models/ticket.model";
import __dirname from "../../utils";

class TicketManager {

    createTicket = async () => {

        const ticketToAdd = {
            amount: 100, // Cambia esto por el monto deseado
            purchaser: "Nombre del comprador", // Cambia esto por el nombre del comprador
        }

        const result = await TicketModel.create(ticketToAdd);
        return result;
    }
}

export default TicketManager