//Importamos el módulo para interactuar con archivos
import fs from 'fs';
import __dirname from '../utils.js';

//Creamos la clase ProductManager que contendra los productos y metodos que necesitemos para la actividad.
class ProductManager {

    //Se construye el elemento inicial (un array vacío).
    constructor() {
        this.path = __dirname + "/api/productos.json";
        this.products = this.getProducts() || [];

        this.counter = 0;
    }

    //Se crea el retorno de los productos ingresados en el archivo database.json .
    getProducts = async () => {
        //Verificamos que exista el archivo antes de leerlo
        try {
            if (!fs.existsSync(this.path)) return [];

            const lectura = await fs.promises.readFile(this.path, "utf-8");
            if (!lectura) return this.products;

            return this.products = JSON.parse(lectura) || [];

        } catch (error) {
            console.log("Hubo un error en el READ", error);
            throw error;
        }
    }

    //Se crea el método para agregar productos validando previamente.
    addProduct = async (title, description, code, price, stock, category, thumbnail) => {

        try {
            if (!fs.existsSync(this.path)) await fs.promises.writeFile(this.path, JSON.stringify([]), "utf-8");
            //Antes de agregar verifica si es válido o no
            if (await this.isNotValidCode(title, description, code, price, stock, category, thumbnail)) {
                return console.log("Atención: Verifique que todos los datos se hayan cargado correctamente o que el código de producto no se repita!");
            }

            //Si es válido la agrega al array de lista de productos.
            const lectura = await fs.promises.readFile(this.path, "utf-8");
            this.products = JSON.parse(lectura);
            this.add(title, description, code, price, stock, category, thumbnail);

            const data = JSON.stringify(this.products, null, "\t");
            await fs.promises.writeFile(this.path, data, "utf-8");
        }
        catch (error) {
            console.log("Hubo un error en el proceso", error);
            throw error;
        }
    }

    //Se crea un método para agregar un nuevo producto a la lista de productos.
    add(title, description, code, price, stock, category, thumbnail) {
        const product = {
            id: this.createID(),
            title: title,
            description: description,
            code: code,
            price: price,
            status: true,
            stock: stock,
            category: category,
            thumbnail: thumbnail,
        };
        this.products.push(product);
    }

    //Validación para verificar que el código no se repita o que no se hayan cargado todos los datos.
    isNotValidCode = async (title, description, code, price, stock, category, thumbnail) => {
        this.products = await this.getProducts();
        //Verificamos que existe un codigo con el mismo nombre.
        const checker = this.products.some((product) => product.code === code);
        //Verificamos que esten todos los productos en la carga de datos.
        const someValid = !title || !description || !price || !thumbnail || !code || !stock || !category;

        return checker || someValid;
    }

    //Verificación si existe un producto con el ID
    getProductById = async (id) => {
        try {
            this.products = await this.getProducts();
            const product = this.products.find((product) => product.id == id);

            if (!product) return `No hay un producto con el número de ID ${id}.`
            return product
        } catch (error) {
            return error
        }
    }

    //Método para buscar un ID especificado, con la clave y el valor a actualizar 
    updateProduct = async (id, key, newValue) => {
        try {
            const product = await this.getProductById(id);
            if (typeof product === "string") return console.log(product);

            this.products = await this.getProducts();
            //Buscamos en que indice el id coincide
            const indice = this.products.findIndex((objeto) => objeto.id === parseInt(id, 10));
            if (indice == -1) return console.log("No se encontro id");

            // Registra lo que se va a actualizar
            product[key] = newValue;
            this.products[indice] = product;

            const data = JSON.stringify(this.products, null, "\t");
            await fs.promises.writeFile(this.path, data, "utf-8");

        } catch (error) {
            console.log("Hubo un error en el proceso de actualización:", error);
        }
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

    //Método para borrar uno de los productos
    deleteProduct = async (id) => {
        try {
            const product = await this.getProductById(id);

            this.products = await this.getProducts();
            //Buscamos en que indice el id coincide
            const indice = this.products.findIndex((objeto) => objeto.id === id);

            for (const key in product) {
                if (key !== 'id') product[key] = '';
            }

            this.products[indice] = product;

            const data = JSON.stringify(this.products, null, "\t");
            await fs.promises.writeFile(this.path, data, "utf-8");
        } catch (error) {
            console.log("Hubo un error al intentar eliminar el producto ", error);
        }
    }
}

export default ProductManager