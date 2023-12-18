import ProductModel from "../models/products.model.js"
import __dirname from "../../utils.js"
//Import para validar imagenes
import axios from "axios";

class ProductManagerMongo {

    constructor() {
        this.counter;
    }

    getProducts = async (limit = 10, page = 1, query = "", category = "", stockAvailability = "all", priceOrder = "ascending") => {
        try {
            const search = {};

            if (query) search.title = { "$regex": query, "$options": "i" };
            if (category) search.category = category;
            if (stockAvailability !== "all") search.stock = (stockAvailability === "inStock");

            const sort = {};
            if (priceOrder === "ascending") sort.price = 1;
            else if (priceOrder === "descending") sort.price = -1;

            if (limit <= 0) limit = 10;

            const result = await ProductModel.paginate(search, {
                page: page,
                limit: limit,
                lean: true,
                sort: sort
            })

            let status = "success";

            if (page > result.totalPages || page < 1 || (isNaN(page)) || result.docs.length === 0) status = "404"

            //Iteramos en cada objeto y verificamos que la url es valida para usar
            const resultWithImageResult = await Promise.all(result.docs.map(async (doc) => {
                const validUrl = await this.validateImage(doc.thumbnail);
                return { ...doc, imageValidationResult: validUrl };
            }));

            const response = {
                status: status,
                payload: resultWithImageResult,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
                nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null,
                totalDocs: result.totalDocs, //?Agregado para ver la cantidad de productos preguntar si eliminar o no
                limit: result.limit //?Agregado para saber el límite actual
            };

            return response;

        } catch (error) {
            console.log("Hubo un error en la lectura de la base de datos.", error);
            throw error;
        }
    }

    addProduct = async (title, description, code, price, stock, category, thumbnail) => {
        try {
            const newId = await this.createID()
            const productToAdd = {
                id: newId,
                title: title,
                description: description,
                code: code,
                price: price,
                status: true,
                stock: stock,
                category: category,
                thumbnail: thumbnail,
            }

            const result = await ProductModel.create(productToAdd);
            return result;

        } catch (error) {
            throw error
        }
    }

    createID = async () => {
        try {
            //*Buscamos el resultado que sea mas grande en la base de datos.
            const valorMaximo = await ProductModel.findOne().sort("-id").exec();
            if (!valorMaximo) return 0;

            //*Obtenemos todos los "products" para saber cuantos hay y verificar que coincida con el valor máximo (.lean se usa para convertilo en un objeto javascript)
            const todosLosProductos = await ProductModel.find({}, "id").lean();
            if (valorMaximo.id === todosLosProductos.length - 1) return valorMaximo.id + 1

            //*Buscamos cual id falta en la sucesión de números ID.
            return await this.findID();
        } catch (error) {
            console.error("Hubo un error en la creación del ID❗❗❗\n", error);
            throw error;
        }
    }

    findID = async () => {
        try {
            // Obtener todos los documentos de la colección "products" 
            const todosLosProductos = await ProductModel.find({}, "id").lean();
            // Extraer todos los IDs existentes en un array
            const idsExistente = todosLosProductos.map(producto => producto.id);

            let idFaltante = 0;
            for (let i = 0; i < idsExistente.length; i++) {
                if (!idsExistente.includes(i)) {
                    idFaltante = i;
                    break;
                }
            }
            return idFaltante
        } catch (error) {
            console.error("Error al encontrar el ID que falta:\n", error);
        }
    };

    isNotValidCode = async (title, description, code, price, stock, category, thumbnail) => {
        //Verificamos que esten todos los productos en la carga de datos no estan vacíos.
        const someValid = !title || !description || !price || !thumbnail || !code || !stock || !category;
        //Si envía true significa que uno de los elementos está vacío.
        return someValid;
    }

    getProductById = async (pId) => {
        try {
            //* Buscamos elementos por Id en base de datos
            const productoBuscado = await ProductModel.findOne({ _id: pId });
            return productoBuscado;
        } catch (error) {
            console.error("\n🤔No se encontró el producto solicitado\n", error);
            return false;
        }
    }

    updateProductById = async (productId, keyUpdate, newValue) => {
        const idProducto = productId;
        const nuevosDatos = { [keyUpdate]: newValue }

        try {
            await ProductModel.updateOne({ id: idProducto }, { $set: nuevosDatos })
            console.log(`Se actualizó la propiedad "${[keyUpdate]}" del producto con id:"${idProducto}" correctamente!`);

        } catch (error) {
            console.error("Error al actualizar el documento:\n", error);
            throw error;
        }
    }

    validateProperty = async (productId, keyUpdate) => {
        try {
            const idProducto = productId;
            const validador = await ProductModel.findOne({ id: idProducto, [keyUpdate]: { $exists: true } });

            if (keyUpdate === "id") return undefined;
            if (validador !== null) return validador;

        } catch (error) {
            console.error("No se pudo validar el documento:\n", error);
            throw error;
        }
    }

    deleteProduct = async (pid) => {
        try {
            await ProductModel.deleteOne({ id: pid })
            console.log(`Producto con id:${pid} se eliminó correctamente!`);
        } catch (error) {
            throw error;
        }
    }

    findLastId = async () => {
        try {
            // Intenta encontrar el último producto que se agregó a la base de datos.
            const ultimoProducto = await ProductModel.findOne().sort({ $natural: -1 });
            if (!ultimoProducto) {
                // Manejar el caso en el que no se encuentre ningún producto
                console.log("No se encontró ningún producto");
                return null;
            }

            return ultimoProducto
        } catch (error) {
            // Manejar errores
            console.error("Error al obtener el último ID:", error);
            throw error;
        }
    }

    validateImage = async (url) => {
        try {
            await axios({
                method: 'get',
                url: url,
                responseType: 'arraybuffer',
            });

            return url
        } catch (error) {
            console.error("No se encontró : ", url, error.message);
            return false
        }
    }
}


export default ProductManagerMongo