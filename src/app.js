import express from "express";
import routerProducts from "./router/products.router.js"
import routerCarts from "./router/carts.router.js"

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Agregamos la propiedad de Express para poder seleccionar la carpeta public
app.use("/static", express.static("../src/public"))
app.get("/", async (req, res) => res.json("OK!"))

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.listen(8080, () => console.log("En linea..."));