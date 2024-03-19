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

    getUserById = async (uId) => {
        const result = await this.dao.getUser(uId)
        return result
    }

    getUser = async (userEmail) => {
        const result = await this.dao.searchUser(userEmail)
        return result
    }

    getUserAndPass = async (userEmail, newPass) => {
        logger.info("User es: ", userEmail);
        const result = await this.dao.searchUserAndPass(userEmail, newPass)
        if (result) logger.info("la contraseña No es igual a la anterior")
        else logger.info("la contraseña es igual a la anterior no se va a cambiar")

        return result
    }

    put = async (uId) => {
        const result = await this.dao.updateUser(uId)

        return result
    }

    putDocuments = async (uId, documentName, documentLink) => {
        const result = await this.dao.updateUserDocuments(uId, documentName, documentLink)

        return result
    }
}