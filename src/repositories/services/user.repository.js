export default class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    get = async (uId) => {
        const result = this.dao.cartExist(uId)
        return result
    }

    post = async (uId, cId) => {
        const result = this.dao.addCartInUser(uId, cId)
        return result
    }
}