import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    "id": Number,
    "title": String,
    "description": String,
    "code": {
        type: String,
        unique: true,
    },
    "price": Number,
    "status": Boolean,
    "stock": Number,
    "category": String,
    "thumbnails": String
})

export const userModel = mongoose.model(productsCollection, productsSchema);