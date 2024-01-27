export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    post = async (cId) => {
        console.log("El CID en el ticket repository, es:", cId);
        const result = await this.dao.createTicket(cId)
        console.log("el ticket es, ", result);

        return result
    }
}