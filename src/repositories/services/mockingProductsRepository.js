export default class MockingProductsRepository {

    constructor(dao) {
        this.dao = dao
    }

    post = async () => {
        const result = await this.dao.post()
        return result
    }
}