import mongoose from "mongoose";

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
    "id": Number,
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ],
        default: []
    }
});

const CartModel = mongoose.model(cartCollection, cartSchema);

export default CartModel;