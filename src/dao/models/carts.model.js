import mongoose from "mongoose";

const cartCollection = "cart";

const cartProductSchema = new mongoose.Schema({
    "product": Number,
    "quantity": Number
})

const cartSchema = new mongoose.Schema({
    "id": Number,
    "products": [cartProductSchema]
})

const CartModel = mongoose.model(cartCollection, cartSchema);

export default CartModel;