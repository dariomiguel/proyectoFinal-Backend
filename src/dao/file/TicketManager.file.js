import TicketModel from "../models/ticket.model";
import __dirname from "../../utils";

class TicketManager {

    createTicket = async (cId, user) => {

        const ticketToAdd = {
            amount: 100,
            purchaser: user,
        }

        const result = await TicketModel.create(ticketToAdd);
        return result;
    }
}

export default TicketManager