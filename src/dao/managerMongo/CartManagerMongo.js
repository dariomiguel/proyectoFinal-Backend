import mongoose from "mongoose"
import ProductModel from "../models/products.model.js"
import __dirname from "../../utils.js"

const productManager = new ProductManager()

class CartManager {
    constructor() {
        this.path = __dirname + "/api/carrito.json";
        this.carts = [];

        this.counter = 0;
    }

    createCart = async () => {
        try {
            if (!fs.existsSync(this.path)) {
                const cart = {
                    id: this.createID(),
                    products: []
                }

                this.carts.push(cart)
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
                return 'Carrito creado con éxito'
            }

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            const cart = {
                id: this.createID(),
                products: []
            }

            this.carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
            return 'Carrito creado con éxito'
        } catch (error) {
            return error
        }
    }

    createID() {
        // Verificar si hay productos en el array
        if (this.carts.length === 0) {
            this.counter = 0;
        } else {
            // Obtener el ID más grande del array de productos
            const maxID = Math.max(...this.carts.map((cart) => cart.id));
            // Incrementar el contador en 1 y devolverlo como el próximo ID
            this.counter = maxID + 1;
        }

        return this.counter;
    }

    getCarts = async () => {
        //Verificamos que exista el archivo antes de leerlo
        try {
            if (!fs.existsSync(this.path)) return [];

            const lectura = await fs.promises.readFile(this.path, "utf-8");
            if (!lectura) return this.carts;

            return this.carts = JSON.parse(lectura) || [];

        } catch (error) {
            console.log("Hubo un error en el READ", error);
            throw error;
        }
    }

    getCartById = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            const carrito = this.carts.find(cart => cart.id == id)

            if (!carrito) return `No hay un producto con el número de ID ${id}.`
            return carrito
        } catch (error) {
            return error
        }
    }

    addProductInCart = async (cid, pid) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            const carrito = this.carts.find(cart => cart.id === cid)
            const prod = await productManager.getProductById(pid)

            if (prod === 'Not found') return 'Producto not found'
            if (!carrito) return 'Carrito not found'

            const product = carrito.products.find(p => p.pid === pid)

            if (!product) {
                carrito.products.push({ pid: pid, quantity: 1 })
            } else {
                product.quantity++
            }

            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
            return 'Se agrego el producto correctamente'
        } catch (error) {
            return error
        }
    }
}

export default CartManager