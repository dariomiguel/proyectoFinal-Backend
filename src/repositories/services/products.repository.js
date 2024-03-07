import productInsertDTO from "../../DTO/products.dto.js";

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async (limit, page, query, category, stockAvailability, priceOrder) => {
        const result = await this.dao.getProducts(limit, page, query, category, stockAvailability, priceOrder)

        return result
    }

    create = async (title, description, code, price, stock, category, thumbnail, owner) => {
        const productToInsert = new productInsertDTO({ title, description, code, price, stock, category, thumbnail, owner })

        //Manejo de excepciones para no permitir valores incorrectos
        const algunaPropiedadVacia = await this.dao.isNotValidCode(productToInsert);

        if (isNaN(productToInsert.price)) {
            const error = new Error("El precio debe ser un valor numérico.");
            error.statusCode = 4001; // Asigna un código de estado 404 al error
            throw error;
        }
        if (isNaN(productToInsert.stock)) {
            const error = new Error("El stock debe ser un valor numérico.");
            error.statusCode = 4002; // Asigna un código de estado 404 al error
            throw error;
        }
        if (productToInsert.category !== "cuadros" && productToInsert.category !== "artesanias" && productToInsert.category !== "bordados" && productToInsert.category !== "esculturas") {
            const error = new Error("La categoría no es válida");
            error.statusCode = 4003; // Asigna un código de estado 404 al error
            throw error;
        }
        if (algunaPropiedadVacia) {
            const error = new Error("Hubo un error al obtener los valores, asegúrese de haber completado todos los campos.😶");
            error.statusCode = 4004; // Asigna un código de estado 404 al error
            throw error;

        } else {
            const productoAgregado = await this.dao.addProduct(title, description, code, price, stock, category, thumbnail, owner);
            return productoAgregado
        }
    }

    getProduct = async (pId) => {
        const result = await this.dao.getProductById(pId)

        return result
    }

    update = async (productId, key, value) => {
        const productPorId = await this.dao.getProductById(productId);

        if (productPorId === null) {
            const error = new Error(`No se encontro el producto con id: ${productId}.`);
            error.statusCode = 404; // Asigna un código de estado 404 al error
            throw error;
        }

        const resultOfValid = await this.dao.validateProperty(productId, key);

        if (resultOfValid === undefined) {
            const error = new Error(`No se encontró la propiedad "${[key]}".`);
            error.statusCode = 400; // Asigna un código de estado 404 al error
            throw error;
        }

        await this.dao.updateProductById(productId, key, value)
    }

    delete = async (productId, userSession) => {
        const result = await this.dao.deleteProduct(productId, userSession);
        logger.info(`Producto con id:${productId} se eliminó correctamente!`);

        return result

    }

    lastId = async () => {
        const result = await this.dao.findLastId()
        return result
    }
}