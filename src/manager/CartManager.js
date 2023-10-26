import fs from 'fs'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager()

export class CartManager {
    constructor() {
        this.path = './src/files/carts.json',
            this.carts = []
    }

    createCart = async () => {
        try {
            if (!fs.existsSync(this.path)) {
                const cart = {
                    id: this.carts.length + 1,
                    productos: []
                }

                this.carts.push(cart)
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
                return 'Se creo el carrito correctamente'
            }

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)

            const cart = {
                id: this.carts.length + 1,
                productos: []
            }

            this.carts.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
            return 'Se creo el carrito correctamente'
        } catch (error) {
            return error
        }
    }

    getCarts = async () => {
        try {
            if (!fs.existsSync(this.path)) return this.carts

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)

            return this.carts
        } catch (error) {
            return error
        }
    }

    getCartById = async (cid) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.carts = JSON.parse(data)
            const carrito = this.carts.find(cart => cart.id == cid)

            return carrito ? carrito : 'Not found'
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

            const product = carrito.productos.find(p => p.pid === pid)

            if (!product) {
                carrito.productos.push({ pid: pid, quantity: 1 })
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