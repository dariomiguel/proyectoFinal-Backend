import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

productsSchema.plugin(mongoosePaginate)
const ProductsModel = mongoose.model(productsCollection, productsSchema);

export default ProductsModel;