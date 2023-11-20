import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    "id": Number,
    "title": String,
    "description": String,
    "code": { type: String, unique: true },
    "price": Number,
    "status": Boolean,
    "stock": Number,
    "category": String,
    "thumbnail": String
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;