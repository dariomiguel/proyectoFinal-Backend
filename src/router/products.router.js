import { Router } from "express"

const router = Router();

const pets = [];

router.get("/", (req, res) => {
    //Listamos con limites
    const limit = req.query.limit;

    if (limit) {
        const limitNumber = parseInt(limit, 10);
        if (!isNaN(limitNumber) && limitNumber >= 0) {
            productos = productos.slice(0, limitNumber);
        }
    }

    res.json(pets);
})

router.get("/:id", (req, res) => {
    const id = req.params.id
    const pet = pets.find(p => p.id == id)

    res.json(pet)
})

router.post("/", (req, res) => {
    const data = req.body

    data.id = pets.length + 1
    pets.push(data)

    res.json(data)
})

export default router