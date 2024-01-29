export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    post = async (cId, user) => {
        const result = await this.dao.createTicket(cId, user)

        return result
    }

    get = async (email) => {
        const result = await this.dao.lastTicket(email)

        return result
    }
}