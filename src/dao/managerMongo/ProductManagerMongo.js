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
            //Antes de agregar verifica si es válido o no
            if (await this.isNotValidCode(title, description, code, price, stock, category, thumbnails)) {
                return console.log("Atención: Verifique que todos los datos se hayan cargado correctamente o que el código de producto no se repita!");
            }

            const productToAdd = this.add(
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails);

            console.log("Producto para agregar", productToAdd);
            await ProductModel.create(productToAdd);
            console.log("El producto se agrego con exito !!!!");

        } catch (error) {
            if (error.code === 11000) {
                console.log(`No se pudo agregar el producto.Ya existe un producto con el código: ${error.keyValue.code}`);

            } else {
                console.error("Hubo un error en la escritura de mongo, el producto no se agregó!\n", error);
            }
        }
    }

    isNotValidCode = async (title, description, code, price, stock, category, thumbnails) => {
        this.products = await this.getProducts();
        //Verificamos que existe un codigo con el mismo nombre.
        const checker = this.products.some((product) => product.code === code);
        //Verificamos que esten todos los productos en la carga de datos.
        const someValid = !title || !description || !price || !thumbnails || !code || !stock || !category;

        return checker || someValid;
    }

    add(title, description, code, price, stock, category, thumbnails) {
        const product = {
            id: this.createID(),
            title: title,
            description: description,
            code: code,
            price: price,
            status: true,
            stock: stock,
            category: category,
            thumbnails: thumbnails,
        };
        this.memoria = product.id;

        return product
    }

    createID() {
        // Verificar si hay productos en el array
        if (this.products.length === 0) {
            this.counter = 0;
        } else {
            // Obtener el ID más grande del array de productos
            const maxID = Math.max(...this.products.map((product) => product.id));
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