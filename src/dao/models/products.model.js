import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    "title": String,
    "description": String,
    "code": { type: String, unique: true },
    "price": Number,
    "status": Boolean,
    "stock": Number,
    "category": {
        type: String,
        enum: ["cuadros", "artesanias", "bordados", "esculturas"],
        default: "cuadros"
    },
    "thumbnail": String
})

productsSchema.plugin(mongoosePaginate)
const ProductsModel = mongoose.model(productsCollection, productsSchema);

export default ProductsModel;