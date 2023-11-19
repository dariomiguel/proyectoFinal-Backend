import mongoose from "mongoose"
import ProductModel from "../models/products.model.js"
import __dirname from "../../utils.js"

const urlMongo = "mongodb+srv://darioemiguel:GcY3pZnnUc67DfFj@cluster0.7tlrgmb.mongodb.net/";

class ProductManagerMongo {

    constructor() {
        this.products = this.getProducts();
        this.counter;
    }

    getProducts = async () => {
        try {
            const lectura = await ProductModel.find();
            return lectura || []

        } catch (error) {
            console.log("Hubo un error en la lectura de la base de datos.", error);
            throw error;
        }
    }

    addProduct = async (title, description, code, price, stock, category, thumbnails) => {
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
                thumbnails: thumbnails,
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
            const valorMaximo = await ProductModel.findOne().sort('-id').exec();
            if (!valorMaximo) return 0;

            //*Buscamos si hay alguna id que falta en la sucesión de números ID.
            const valorIdFaltante = await this.encontrarIdFaltante();

            if (valorMaximo.id + 1 !== valorIdFaltante) return valorIdFaltante;
            return valorMaximo.id + 1;

        } catch (error) {
            console.error("Hubo un error en la creación del ID❗❗❗\n", error);
            throw error;
        }
    }

    encontrarIdFaltante = async () => {
        try {
            // Obtener todos los documentos de la colección "products" (.lean se usa para convertilo en un objeto javascript)
            const todosLosProductos = await ProductModel.find({}, 'id').lean();
            // Extraer todos los IDs existentes en un array
            const idsExistente = todosLosProductos.map(producto => producto.id);

            let idFaltante;
            for (let i = 0; i < idsExistente.length; i++) {
                if (!idsExistente.includes(i)) {
                    idFaltante = i;
                    break;
                }
            }

            return idFaltante
        } catch (error) {
            console.error("Error al encontrar el ID que falta:", error);
        }
    };

    getProductById = async (pId) => {
        try {
            //* Buscamos elementos por Id en base de datos
            const productoBuscado = await ProductModel.findOne({ id: pId });
            return productoBuscado;
        } catch (error) {
            console.error("No se encontró el producto solicitado\n", error);
            throw error;
        }
    }

    updateProductById = async (productId, keyUpdate, newValue) => {
        const idProducto = productId;
        const nuevosDatos = { [keyUpdate]: newValue }

        try {
            await ProductModel.updateOne({ id: idProducto }, { $set: nuevosDatos })
            console.log(`Se actualizó la propiedad '${[keyUpdate]}' del producto con id:'${idProducto}' correctamente!`);

        } catch (error) {
            console.error('Error al actualizar el documento:\n', error);
            throw error;
        }
    }

    validateProperty = async (productId, keyUpdate) => {
        try {
            const idProducto = productId;
            const validador = await ProductModel.findOne({ id: idProducto, [keyUpdate]: { $exists: true } });
            if (validador !== null) return validador;
        } catch (error) {
            console.error('No se pudo validar el documento:\n', error);
            throw error;
        }
    }
}

mongoose.connect(urlMongo, { dbName: "ecommerce" })
    .then(() => {
        console.log("DB connected.");
    })
    .catch(() => {
        console.error("Error conecting to DB");
    })

export default ProductManagerMongo