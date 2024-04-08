import CartManagerMongo from "../dao/mongo/CartManager.mongo.js"
import mongoose from "mongoose"
import Assert from "assert"
import config from "../config/config.js";
import { expect } from "chai";

import CartModel from "../dao/models/carts.model.js";



const urlMongo = config.urlMongo;

mongoose.connect(urlMongo, {
    dbName: "test"
})

const assert = Assert.strict



describe("Testing Cart DAO Mongo", function () {
    this.timeout(10000); // Aumenta el tiempo a 10 segundos.

    afterEach(async () => {
        // Limpiar la base de datos después de cada prueba
        await CartModel.deleteMany({});
    });

    it("Debe crear un nuevo carrito", async () => {

        const CartDao = new CartManagerMongo();
        const result = await CartDao.createCart();

        assert.strictEqual(Array.isArray(result.products), true)

    });

    it("Debe encontrar el ID que falta", async () => {
        const CartDao = new CartManagerMongo();
        await CartModel.create([{ id: "1" }, { id: "2" }]);
        const result = await CartDao.findID();

        expect(result).to.equal(0);
    });

    it("Debe mostrar todos los carritos", async () => {
        const CartDao = new CartManagerMongo();
        const result = await CartDao.getCarts();

        assert.strictEqual(Array.isArray(result), true)
    });
});

