import ProductManager from "../../DAO/mongo/ProductManager.mongo.js"
const productManager = new ProductManager();

export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    create = async (role) => {
        let result = await this.dao.createCart()
        console.log("Carrito creado con id: 🛒 ", result._id.toString());

        return result
    }

    getCarts = async () => {
        const result = await this.dao.getCarts()

        return result
    }

    get = async (cId) => {
        const result = await this.dao.getCartById(cId)

        return result
    }

    productToCart = async (cId, pId, quantity) => {

        console.log("La cantidad de productos que se va a agregar al carrito es: ", quantity);

        const existingCart = await this.dao.getCartById(cId);
        if (!existingCart) {
            const error = new Error(`No se encontró el carrito con id: ${cId}`);
            error.statusCode = 4001;
            throw error;
        }
        const existingProduct = await productManager.getProductById(pId);
        if (!existingProduct) {
            const error = new Error(`No se encontró el producto con id: ${pId}`);
            error.statusCode = 4002;
            throw error;
        }

        const productsIds = existingCart.products.map(product => {
            if (product.product && product.product._id) {
                const productObject = product.product.toJSON();
                return productObject._id.toString();
            }
            return null;
        });

        // Busca el índice del _id en la lista de _id
        const productIndex = productsIds.indexOf(pId);


        if (productIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad
            existingCart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no existe, agregarlo al carrito con la cantidad especificada
            existingCart.products.push({ product: pId, quantity });
        }

        // Actualizar el carrito en la base de datos
        const result = await this.dao.updateCart(cId, existingCart);
        return result
    }

    delete = async (cId) => {
        await this.dao.deleteAllProductsFromCart(cId)
    }

    deleteProduct = async (cId, pId) => {
        await this.dao.deleteProductFromCart(cId, pId)
    }

    update = async (cId, updatedProducts) => {
        // Validar si el carrito existe
        const existingCart = await this.dao.getCartById(cId);
        if (!existingCart) {
            const error = new Error(`No se encontró el carrito con id: ${cId}`);
            error.statusCode = 4003;
            throw error;
        }

        // Actualizar los productos en el carrito
        existingCart.products = updatedProducts;

        // Actualizar el carrito en la base de datos
        const result = await this.dao.updateCart(cId, existingCart);
        return result
    }

    updateQuantity = async (cId, pId, newQuantity) => {
        console.log("La nueva cantidad que se va a usar para actualizar es: ", newQuantity);
        const existingCart = await this.dao.getCartById(cId);
        if (!existingCart) {
            const error = new Error(`No se encontró el carrito con id: ${cId}`);
            error.statusCode = 4003;
            throw error;
        }

        const productIndex = existingCart.products.findIndex(product => product.product === pId);

        if (!(productIndex !== -1)) {
            const error = new Error(`No se encontró el producto con id:${pId} en el carrito con id:${cId}`);
            error.statusCode = 4004;
            throw error;
        }
        // Actualiza solo la cantidad del producto en el carrito
        existingCart.products[productIndex].quantity = newQuantity;

        // Actualiza el carrito en la base de datos
        const result = await this.dao.updateProductQuantity(cId, existingCart, newQuantity, pId);
        return result
    }
}
