import TicketModel from "../models/ticket.model.js";
import CartModel from "../models/carts.model.js";
import ProductsModel from "../models/products.model.js";
import UserModel from "../models/user.model.js";

class TicketManager {

    createTicket = async (cId, user) => {
        const totalT = await this.totalTicket(cId)

        const ticketToAdd = {
            amount: totalT,
            purchaser: user.email,
        }

        const result = await TicketModel.create(ticketToAdd);
        return result;

    }

    totalTicket = async (cId) => {

        const carrito = await CartModel.findOne({ "_id": cId }).lean();
        let total = 0;
        let buyCart = []
        let amountBuyCart = []
        let rejectedCart = []

        for (let i = 0; i < carrito.products.length; i++) {
            const producto = await ProductsModel.findOne({ "_id": carrito.products[i].product.toString() }).lean();

            if (carrito.products[i].quantity <= producto.stock) {

                buyCart.push(producto._id);

                const subTotal = carrito.products[i].quantity * producto.price
                amountBuyCart.push(subTotal)

                await this.updateStock(cId, producto._id.toString(), carrito.products[i].quantity)
            } else {
                rejectedCart.push(producto._id);
            }
        }

        total = amountBuyCart.reduce((act, curr) => act + curr, 0)
        return total
    }

    updateStock = async (cId, pId, quantity) => {

        const cartId = cId;
        const productId = pId;
        const quantityToUpdate = -quantity;

        const productToUpdate = await ProductsModel.findOne({ "_id": productId }).lean();
        const newQuantity = productToUpdate.stock + quantityToUpdate;

        await ProductsModel.updateOne(
            { _id: productId },
            { $set: { stock: newQuantity } }
        )
        await CartModel.updateOne(
            { _id: cartId },
            { $pull: { products: { product: productId } } }
        );
    }

    lastTicket = async (email) => {

        const cantDocument = await TicketModel.countDocuments();
        const ultimoTicket = await TicketModel.findOne().sort({ $natural: -1 });

        return ultimoTicket

    }
}


export default TicketManager