import productInsertDTO from "../../DTO/products.dto.js";

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async (limit, page, query, category, stockAvailability, priceOrder) => {
        const result = await this.dao.getProducts(limit, page, query, category, stockAvailability, priceOrder)

        return result
    }

    create = async (title, description, code, price, stock, category, thumbnail) => {
        const productToInsert = new productInsertDTO({ title, description, code, price, stock, category, thumbnail })
        console.log("El valor del precio es: ", productToInsert.price);

        //Manejo de excepciones para no permitir valores incorrectos
        const algunaPropiedadVacia = await this.dao.isNotValidCode(productToInsert);

        if (isNaN(productToInsert.price)) {
            console.log("\nEl precio debe ser un valor numérico.\n");
            return res.status(400).json({ error: "El precio debe ser un valor numérico" });
        }
        if (isNaN(productToInsert.stock)) {
            console.log("\nEl stock debe ser un valor numérico.\n");
            return res.status(400).json({ error: "El stock debe ser un valor numérico" });
        }
        if (productToInsert.category !== "cuadros" && productToInsert.category !== "artesanias" && productToInsert.category !== "bordados" && productToInsert.category !== "esculturas") {
            console.log("La categoría no es válida");
            return res.status(400).json({ error: "Debes seleccionar una de estas categorías: cuadros-artesanias-bordados-esculturas" });
        }
        if (algunaPropiedadVacia) {
            res
                .status(400)
                .json({ Error: "Hubo un error al obtener los valores, asegúrese de haber completado todos los campos.😶" });
            console.log("\nVerifique que las propiedades no esten vacías😶.\n");

        } else {
            const productoAgregado = await this.dao.addProduct(title, description, code, price, stock, category, thumbnail);
            res
                //*201 para creaciones exitosas
                .status(201)
                .json({ message: "Producto agregado correctamente.😄", payload: productoAgregado });
        }
    }

    getProduct = async (pId) => {
        const result = await this.dao.getProductById(pId)

        if (result === null) {
            res
                .status(404)
                .json({ Error: "No se encontro el producto solicitado" });
        } else {
            res.status(200).json({ status: "success", payload: result })
        }
    }

    update = async (productId, key, value) => {
        const productPorId = await this.dao.getProductById(productId);
        if (productPorId === null) {
            console.error(`No se encontro el producto con id: ${productId}.`)
            return res
                .status(404)
                .json({ Error: `No se encontro el producto con id: ${productId}.` });
        }

        const resultOfValid = await this.dao.validateProperty(productId, key);

        if (resultOfValid === undefined) {
            console.error(`No se encontró la propiedad "${[key]}".`);
            return res
                .status(404)
                .json({ Error: `No se encontró la propiedad "${[key]}".` });
        }

        const resultOfUpdate = await this.dao.updateProductById(productId, key, value);
        if (resultOfUpdate !== null) res.status(201).json({ message: `Se actualizó la propiedad "${key}" del producto con id:"${productId}" correctamente!` });
    }

    delete = async (productId) => {
        const productPorId = await this.dao.getProductById(productId);

        if (productPorId === null) {
            console.error(`No se encontró el producto con id:"${productId}"`);
            res.status(404).json({ Error: `No se encontró el producto con id:"${productId}"` });
        } else {
            await this.dao.deleteProduct(productId);
            res.status(201).json({ message: "Producto eliminado correctamente" });
        }
    }
}