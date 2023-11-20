import mongoose from "mongoose"
import ProductModel from "../models/products.model.js"
import ProductManagerMongo from "./ProductManagerMongo.js";
import __dirname from "../../utils.js"
import CartModel from "../models/carts.model.js";

// const productManager = new ProductManager()
const productManagerMongo = new ProductManagerMongo();

const urlMongo = "mongodb+srv://darioemiguel:GcY3pZnnUc67DfFj@cluster0.7tlrgmb.mongodb.net/";

class CartManagerMongo {

    createCart = async () => {
        try {
            const newId = await this.createID();
            const cartToAdd = {
                id: newId,
                products: []
            }

            const result = await CartModel.create(cartToAdd);
            return result;

        } catch (error) {
            throw error
        }
    }

    createID = async () => {
        try {
            //*Buscamos el resultado que sea mas grande en la base de datos.
            const valorMaximo = await CartModel.findOne().sort("-id").exec();
            if (!valorMaximo) return 0;

            //*Obtenemos todos los "products" para saber cuantos hay y verificar que coincida con el valor máximo (.lean se usa para convertilo en un objeto javascript)
            const todosLosCarritos = await CartModel.find({}, "id").lean();
            if (valorMaximo.id === todosLosCarritos.length - 1) return valorMaximo.id + 1

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
            const todosLosCarritos = await CartModel.find({}, "id").lean();
            // Extraer todos los IDs existentes en un array
            const idsExistente = todosLosCarritos.map(carrito => carrito.id);

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

















    // createID() {
    //     // Verificar si hay productos en el array
    //     if (this.carts.length === 0) {
    //         this.counter = 0;
    //     } else {
    //         // Obtener el ID más grande del array de productos
    //         const maxID = Math.max(...this.carts.map((cart) => cart.id));
    //         // Incrementar el contador en 1 y devolverlo como el próximo ID
    //         this.counter = maxID + 1;
    //     }

    //     return this.counter;
    // }

    // getCarts = async () => {
    //     //Verificamos que exista el archivo antes de leerlo
    //     try {
    //         if (!fs.existsSync(this.path)) return [];

    //         const lectura = await fs.promises.readFile(this.path, "utf-8");
    //         if (!lectura) return this.carts;

    //         return this.carts = JSON.parse(lectura) || [];

    //     } catch (error) {
    //         console.log("Hubo un error en el READ", error);
    //         throw error;
    //     }
    // }

    // getCartById = async (id) => {
    //     try {
    //         const data = await fs.promises.readFile(this.path, 'utf-8')
    //         this.carts = JSON.parse(data)
    //         const carrito = this.carts.find(cart => cart.id == id)

    //         if (!carrito) return `No hay un producto con el número de ID ${id}.`
    //         return carrito
    //     } catch (error) {
    //         return error
    //     }
    // }

    // addProductInCart = async (cid, pid) => {
    //     try {
    //         const data = await fs.promises.readFile(this.path, 'utf-8')
    //         this.carts = JSON.parse(data)
    //         const carrito = this.carts.find(cart => cart.id === cid)
    //         const prod = await productManager.getProductById(pid)

    //         if (prod === 'Not found') return 'Producto not found'
    //         if (!carrito) return 'Carrito not found'

    //         const product = carrito.products.find(p => p.pid === pid)

    //         if (!product) {
    //             carrito.products.push({ pid: pid, quantity: 1 })
    //         } else {
    //             product.quantity++
    //         }

    //         await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
    //         return 'Se agrego el producto correctamente'
    //     } catch (error) {
    //         return error
    //     }
    // }
}

mongoose.connect(urlMongo, { dbName: "ecommerce" })
    .then(() => {
        console.log("CartDB connected.");
    })
    .catch(() => {
        console.error("Error conecting to CartDB");
    })

export default CartManagerMongo