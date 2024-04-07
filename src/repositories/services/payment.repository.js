export default class PaymentRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async (cart) => {
        const result = await this.dao.get(cart)

        return result
    }
}