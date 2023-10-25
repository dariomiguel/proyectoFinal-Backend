import { Router } from "express"
import ProductManager from "../manager/ProductManager.js";


const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    //Listamos con limites
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    // if (limit) {
    //     const limitNumber = parseInt(limit, 10);
    //     if (!isNaN(limitNumber) && limitNumber >= 0) {
    //         products = products.slice(0, limitNumber);
    //     }
    // }

    res.json(products);
    // res.send(products)
})

router.get("/:id", (req, res) => {
    const id = req.params.id
    const product = products.find(p => p.id == id)

    res.json(pet)
})

router.post("/", (req, res) => {
    const data = req.body

    data.id = products.length + 1
    products.push(data)

    res.json(data)
})

export default router