export default class userInsertDTO {

    constructor(user) {

        this._id = user?._id ?? ""
        this.first_name = user?.first_name ?? ""
        this.last_name = user?.last_name ?? ""
        this.email = user?.email ?? ""
        this.age = user?.age ?? 0
        this.role = user?.role ?? "user"
        this.carts = user?.carts ?? []

    }
}