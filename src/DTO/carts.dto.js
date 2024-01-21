export default class cartInsertDTO {

    constructor(cart) {

        this.products = cart?.products ?? [];

    }
}