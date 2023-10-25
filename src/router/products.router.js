import { Router } from "express"

const router = Router();

const products = [];

router.get("/", (req, res) => {
    //Listamos con limites
    const limit = req.query.limit;

    if (limit) {
        const limitNumber = parseInt(limit, 10);
        if (!isNaN(limitNumber) && limitNumber >= 0) {
            productos = productos.slice(0, limitNumber);
        }
    }

    res.json(products);
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