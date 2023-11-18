import mongoose from "mongoose"
import ProductModel from "../models/products.model.js"
import __dirname from "../../utils.js"

const urlMongo = "mongodb+srv://darioemiguel:GcY3pZnnUc67DfFj@cluster0.7tlrgmb.mongodb.net/"

class ProductManagerMongo {

    constructor() {
        this.products = this.getProducts();
        this.counter = 0;
        this.memoria = 0;
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

            const productToAdd = {
                id: 88,
                title: title,
                description: description,
                code: code,
                price: price,
                status: true,
                stock: stock,
                category: category,
                thumbnails: thumbnails,
            }

            console.log("El número del ID es: \n", productToAdd.id)

            const result = await ProductModel.create(productToAdd);

            console.log('Producto creado:', result);
            console.log("El producto se agregó con éxito !!!!");
            console.log("¿Qué es result?", result);
            this.memoria = productToAdd.id;
            console.log("El número en memoria es: \n", this.memoria);

            return result;

        } catch (error) {
            throw error
        }
    }

    createID = async () => {
        // Verificar si hay productos en el array
        const resolvedProducts = await this.products;

        if (resolvedProducts.length === 0) {
            this.counter = 0;
        } else {
            // Obtener el ID más grande del array de productos
            const maxID = Math.max(...resolvedProducts.map((product) => product.id));
            // Incrementar el contador en 1 y devolverlo como el próximo ID
            this.counter = maxID + 1;
        }

        return this.counter;
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