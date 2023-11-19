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
            return valorMaximo.id + 1;

        } catch (error) {
            console.error("Hubo un error en la creación del ID❗❗❗\n", error);
            throw error;
        }
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
}


mongoose.connect(urlMongo, { dbName: "ecommerce" })
    .then(() => {
        console.log("DB connected.");
    })
    .catch(() => {
        console.error("Error conecting to DB");
    })

export default ProductManagerMongo