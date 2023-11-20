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
            const valorMaximo = await ProductModel.findOne().sort('-id').exec();
            if (!valorMaximo) return 0;

            //*Obtenemos todos los "products" para saber cuantos hay y verificar que coincida con el valor máximo (.lean se usa para convertilo en un objeto javascript)
            const todosLosProductos = await ProductModel.find({}, 'id').lean();
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
            const todosLosProductos = await ProductModel.find({}, 'id').lean();
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

            if (keyUpdate === "id") return undefined;
            if (validador !== null) return validador;

        } catch (error) {
            console.error('No se pudo validar el documento:\n', error);
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
}

mongoose.connect(urlMongo, { dbName: "ecommerce" })
    .then(() => {
        console.log("ProductDB connected.");
    })
    .catch(() => {
        console.error("Error conecting to DB");
    })

export default ProductManagerMongo