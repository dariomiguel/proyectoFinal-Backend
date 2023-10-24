import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => res.json("OK!"))

app.listen(8080, () => console.log("En linea..."))