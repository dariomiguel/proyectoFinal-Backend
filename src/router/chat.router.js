import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("chat", {
        style: "chat.css"
    })
});

export default router