import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
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

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;