import express from "express";
import routerProducts from "./router/products.router.js"

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Agregamos la propiedad de Express para poder seleccionar la carpeta public
app.use("/static", express.static("../src/public"))
app.get("/", async (req, res) => res.json("OK!"))

app.use("/api/products", routerProducts)

app.listen(8080, () => console.log("En linea..."))