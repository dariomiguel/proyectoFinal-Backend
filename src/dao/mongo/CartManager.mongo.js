import CartModel from "../models/carts.model.js";
import __dirname from "../../utils.js"
import { logger } from "../../utils/logger.js"

class CartManager {

    createCart = async () => {
        try {
            const cartToAdd = {
                products: []
            }

            const result = await CartModel.create(cartToAdd);
            return result;

        } catch (error) {
            logger.error(error)
            throw error
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
            return idFaltante;

        } catch (error) {
            logger.error("Error al encontrar el ID que falta:\n", error);
            throw error
        }
    };

    getCarts = async () => {
        try {
            const lectura = await CartModel.find();
            return lectura || []

        } catch (error) {
            logger.error("Hubo un error en la lectura de la base de datos.", error);
            throw error;
        }
    }

    getCartById = async (cId) => {
        try {
            //* Buscamos elementos por Id en base de datos
            const carritoBuscado = await CartModel.findOne({ _id: cId }).populate("products.product")
            return carritoBuscado;
        } catch (error) {
            logger.error("No se encontró el carrito solicitado\n", error);
            throw error;
        }
    }

    addProductInCart = async (cId, pId) => {
        try {
            const cart = await CartModel.findOne({ _id: cId });
            if (!cart) {
                logger.info("Carrito no encontrado");
                return;
            }

            logger.info("Se encontró el carrito", cart);

            if (!cart.products) {
                logger.info("El carrito no tiene productos");
                return;
            }

            const existingProduct = cart.products.find(
                (item) => item.product.toString() === pIdString
            );

            //Analizamos si existe el producto
            if (existingProduct !== -1) {
                // Si el producto ya existe, sumar al quantity
                existingProduct.quantity += 1
            } else {
                // Si el producto no existe, agregarlo al array con quantity 1
                cart.products.push({ "_id": pId, "quantity": 1 })

                // Guardar el carrito actualizado
                await cart.save();
                // Devolver el carrito actualizado
                return cart;
            }
        } catch (error) {
            logger.error(error)
            throw error;
        }
    }

    deleteCart = async (cid) => {
        try {
            await CartModel.deleteOne({ _id: cid })
            logger.info(`Carrito con id:${cid} se eliminó correctamente!`);
        } catch (error) {
            logger.error(error)
            throw error;
        }
    }

    deleteProductFromCart = async (cid, pid) => {
        try {
            const cart = await CartModel.findOne({ _id: cid });

            if (!cart) {
                logger.info(`No se encontró el carrito con id:${cid}`);
                return;
            }

            // Encuentra el índice del producto en el carrito
            const index = cart.products.findIndex(product => product.product === pid);

            if (index !== -1) {
                // Elimina el producto del array
                cart.products.splice(index, 1);

                // Actualiza el carrito en la base de datos
                await CartModel.updateOne({ _id: cid }, { $set: { products: cart.products } });

                logger.info(`Producto con id:${pid} eliminado del carrito con id:${cid} correctamente`);
            } else {
                logger.info(`No se encontró el producto con id:${pid} en el carrito con id:${cid}`);
            }
        } catch (error) {
            logger.error(error)
            throw error;
        }
    }

    updateCart = async (cId, updatedCart) => {
        try {
            await CartModel.updateOne({ _id: cId }, updatedCart);
            logger.info(`Carrito con id:${cId} actualizado correctamente!`);
            return true
        } catch (error) {
            logger.error(error)
            throw error;
        }
    }

    updateProductQuantity = async (cId, updatedCart, quantity, producttoUpdate) => {
        try {
            await CartModel.updateOne({ _id: cId }, { $set: updatedCart });
            logger.info(`Se actualizó con una cantidad de ${quantity} el producto ${producttoUpdate} del carrito con id:${cId}!`);
        } catch (error) {
            logger.error(error)
            throw error;
        }
    }

    deleteAllProductsFromCart = async (cId) => {
        try {
            await CartModel.updateOne({ _id: cId }, { $set: { products: [], total: 0 } });
            logger.info(`Todos los productos del carrito con id:${cId} se eliminaron correctamente!`);
        } catch (error) {
            logger.error(error)
            throw error;
        }
    }

}

export default CartManager