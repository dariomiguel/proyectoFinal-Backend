import express from "express";
import routerProducts from "./router/products.router.js"
import routerCarts from "./router/carts.router.js"
import __dirname from "./utils.js"

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Configuramos el motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "views");
app.set("view engine", "handlebars");

//Agregamos la propiedad de Express para poder seleccionar la carpeta public
app.use(express.static(__dirname + "/public"))
app.get("/", async (req, res) => res.json("OK!"))

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.listen(8080, () => console.log("En linea..."));