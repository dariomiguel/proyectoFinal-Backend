import userInsertDTO from "../../DTO/user.dto.js"

export default class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    get = async (userAdmin) => {
        const result = userAdmin
        const user = new userInsertDTO(result)
        return user
    }

    getCart = async (uId) => {
        const result = await this.dao.cartExist(uId)
        return result
    }

    post = async (uId, cId) => {
        const result = await this.dao.addCartInUser(uId, cId)
        return result
    }

    getUser = async (userEmail) => {
        const result = await this.dao.searchUser(userEmail)
        return result
    }

    getUserAndPass = async (userEmail, newPass) => {
        const result = await this.dao.searchUserAndPass(userEmail, newPass)
        return result
    }
}