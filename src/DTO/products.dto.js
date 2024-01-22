export default class ProductInsertDTO {

    constructor(product) {

        this.title = product?.title ?? "Titulo por Default"
        this.description = product?.description ?? "Descripción por Default"
        this.code = product?.code ?? "#######"
        this.price = product?.price ?? 1
        this.stock = product?.stock ?? 1
        this.category = product?.category ?? "cuadros"
        this.thumbnail = product?.thumbnail ?? "url por default"

    }
}