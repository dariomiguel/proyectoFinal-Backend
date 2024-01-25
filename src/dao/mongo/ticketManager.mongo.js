import TicketModel from "../models/ticket.model";
import __dirname from "../../utils";

class TicketManager {

    createTicket = async () => {
        const ticketToAdd = {
            Total: []
        }

        const result = await TicketModel.create(ticketToAdd);
        return result;
    }
}

export default TicketManager