import mongoose from "mongoose"
import ProductModel from "../models/products.model.js"
import __dirname from "../../utils.js"

const urlMongo = "mongodb+srv://darioemiguel:GcY3pZnnUc67DfFj@cluster0.7tlrgmb.mongodb.net/"

class ProductManagerMongo {

    getProducts = async () => {
        try {
            const lectura = await ProductModel.find();
            return lectura
        } catch (error) {
            console.log("Hubo un error en el READ", error);
            throw error;
        }
    }


}
mongoose.connect(urlMongo, { dbName: "ecommerce" })
    .then(() => {
        console.log("DB connected.");
    })
    .catch(() => {
        console.error("Error conecting to DB");
    })

export default ProductManagerMongo