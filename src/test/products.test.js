import ProductManagerMongo from "../DAO/mongo/ProductManager.mongo.js"
import mongoose from "mongoose"
import Assert from "assert"
import config from "../config/config.js";

const urlMongo = config.urlMongo;

mongoose.connect(urlMongo, {
    dbName: "test"
})

const assert = Assert.strict

describe("Testing Product DAO mongo", function () {
    this.timeout(10000); // Aumenta el tiempo a 10 segundos.

    it("El Dao debe poder obtener los products en formato de Array", async () => {
        const productDao = new ProductManagerMongo();
        const result = await productDao.getProducts();

        assert.strictEqual(Array.isArray(result.payload), true)
    })

    it("El Dao debe poder agregar un producto a la base de datos", async () => {
        const productDao = new ProductManagerMongo();
        const result = await productDao.addProduct("title test", "description test", "code0test", 1, 1, "cuadros", "thumbnail.test", "admin");

        assert.strictEqual((typeof result === 'object' && result !== null), true)
    })

    it("El Dao debe poder obtener el último producto agregado por ID", async () => {
        const productDao = new ProductManagerMongo();
        const id = await productDao.findLastId()
        const result = await productDao.getProductById(id._id)

        assert.strictEqual(result !== null, true)
    })

    it("El Dao debe poder eliminar el último producto agregado por ID", async () => {
        const productDao = new ProductManagerMongo();
        const id = await productDao.findLastId()
        const userTest = { role: "admin" }
        const result = await productDao.deleteProduct(id._id, userTest)

        assert.strictEqual(result, true)
    })

})