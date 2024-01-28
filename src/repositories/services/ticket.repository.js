export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    post = async (cId, user) => {
        const result = await this.dao.createTicket(cId, user)

        return result
    }
}