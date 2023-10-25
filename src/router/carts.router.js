import { Router } from "express"

const router = Router();

const products = [];

router.get("/", (req, res) => {
    const limit = req.query.limit;

    // if(limit) {
    //     const limit
    // }
})

export default router