import CartManagerMongo from "../dao/mongo/cartmanager.mongo.js";
import UserManagerMongo from "../dao/mongo/usermanager.mongo.js";
import mongoose from "mongoose";
import { expect } from "chai";
import UserModel from "../dao/models/user.model.js";
import Assert from "assert"
import config from "../config/config.js";

const urlMongo = config.urlMongo;

mongoose.connect(urlMongo, {
    dbName: "test"
});

const assert = Assert.strict

describe("Testing Session and User DAOs Mongo", function () {
    this.timeout(10000); // Aumenta el tiempo a 10 segundos.

    afterEach(async () => {
        // Limpiar la base de datos después de cada prueba
        await UserModel.deleteMany({});
    });

    it("Debe buscar un usuario por su ID", async () => {
        const newUser = {
            first_name: "test",
            last_name: "test",
            age: "5",
            email: "test",
            password: 0
        }
        const user = await UserModel.create(newUser);
        const userDao = new UserManagerMongo();
        const result = await userDao.getUser(user._id);

        expect(result._id).to.deep.equal(user._id);
    });

    it("Debe agregar un carrito a un usuario", async () => {
        const user = await UserModel.create({ email: "example@example.com", password: 0 });
        const cartDao = new CartManagerMongo();
        const cart = await cartDao.createCart();
        const userDao = new UserManagerMongo();
        const result = await userDao.addCartInUser(user._id, cart._id);

        assert.strictEqual(Array.isArray(result.carts), true)

    });

    it("Debe buscar un usuario por su correo electrónico", async () => {
        const user = await UserModel.create({ email: "example@example.com", password: 0 });
        const userDao = new UserManagerMongo();
        const result = await userDao.searchUser("example@example.com");

        expect(result).to.be.true;
    });

    it("Debe verificar si la nueva contraseña de un usuario es igual o no a la anterior", async () => {
        await UserModel.create({ email: "example@example.com", password: 0 });
        const userDao = new UserManagerMongo();
        const result = await userDao.searchUserAndPass("example@example.com", "0");

        expect(result).to.be.true;
    });

    it("Debe actualizar el rol de un usuario", async () => {
        const user = await UserModel.create({ role: "user", password: 0 });
        const userDao = new UserManagerMongo();
        const result = await userDao.updateUser(user._id);

        expect(result).to.equal("premium");
    });
});
