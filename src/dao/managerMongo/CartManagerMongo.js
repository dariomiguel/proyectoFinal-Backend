import CartModel from "../models/carts.model.js";
import __dirname from "../../utils.js"

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
            return idFaltante;

        } catch (error) {
            console.error("Error al encontrar el ID que falta:\n", error);
        }
    };

    getCarts = async () => {
        try {
            const lectura = await CartModel.find();
            return lectura || []

        } catch (error) {
            console.log("Hubo un error en la lectura de la base de datos.", error);
            throw error;
        }
    }

    getCartById = async (cId) => {
        try {
            //* Buscamos elementos por Id en base de datos
            const carritoBuscado = await CartModel.findOne({ id: cId });
            return carritoBuscado;
        } catch (error) {
            console.error("No se encontró el carrito solicitado\n", error);
            throw error;
        }
    }

    addProductInCart = async (cId, pId) => {
        try {

            // Buscar el carrito por su ID
            const cart = await CartModel.findOne({ id: cId });
            // Si el carrito ya existe, verificar si el producto ya está en el array
            const existingProduct = cart.products.find(
                (item) => item.product === pId
            );

            //Analizamos si existe el producto
            existingProduct ?
                // Si el producto ya existe, sumar al quantity
                existingProduct.quantity += 1 :
                // Si el producto no existe, agregarlo al array con quantity 1
                cart.products.push({ product: pId, quantity: 1 })

            // Guardar el carrito actualizado
            await cart.save();
            console.log("Producto actualizado en el carrito:", cart);
            return cart
        } catch (error) {
            throw error
        }
    }

    deleteCart = async (cid) => {
        try {
            await CartModel.deleteOne({ id: cid })
            console.log(`Carrito con id:${cid} se eliminó correctamente!`);
        } catch (error) {
            throw error;
        }
    }
}

export default CartManagerMongo