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
    this.timeout(10000); // Aumenta el tiempo de espera máximo a 5000ms (5 segundos)

    it("El Dao debe poder obtener los products en formato de Array", async () => {
        const productDao = new ProductManagerMongo();
        const result = await productDao.getProducts()

        assert.strictEqual(Array.isArray(result.payload), true)

    })
})