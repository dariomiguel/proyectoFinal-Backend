import passport from "passport";
import local from "passport-local";
import UserModel from "../dao/models/user.model.js"
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("login", new LocalStrategy({
        usernameField: "email",
    }, async (username, password, done) => {
        try {
            if (!username || !password) {
                console.error("Nombre de usuario o contraseña no proporcionados");
                return done(null, false, { message: "Nombre de usuario o contraseña no proporcionados" });
            }

            if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
                const user = {
                    first_name: "admin",
                    last_name: "admin",
                    email: "adminCoder@coder.com",
                    age: 0,
                    password: "adminCod3r123",
                    role: "admin",
                    _id: 0
                }

                return done(null, user)
            }
            const user = await UserModel.findOne({ email: username }).lean().exec()
            if (!user) {
                console.error("Usuario inexistente!");

                return done({ status: 400 }, false, { message: "Usuario no encontrado" });
            }
            if (!isValidPassword(user, password)) {
                const errorObject = { status: 403, message: "Contraseña incorrecta!" };
                console.error("Error:", errorObject.status, errorObject.message);

                return done(errorObject);
            }

            done(null, user)
        } catch (error) {
            return done("Error Login", error)
        }
    }))

    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
    }, async (req, username, password, done) => {

        const { first_name, last_name, email, age } = req.body;
        if (!first_name || !last_name || !age || !email || !password) {
            console.log("Faltan completar los campos");

            return done(null, false)
        }
        try {
            const user = await UserModel.findOne({ email: username })

            if (user || username === "adminCoder@coder.com") {
                console.log("El usuario ya existe");

                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: createHash(password)
            }

            const result = await UserModel.create(newUser)

            return done(null, result)
        } catch (error) {
            done(null, error)
        }
    }))

    passport.use("github", new GitHubStrategy({

        clientID: "Iv1.4763c46764a986a4",
        clientSecret: "1bf47184d80ecf091248828135bcffbe7e1075cf",
        callbackURL: "http://127.0.0.1:8080/api/session/githubcallback",

    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) {
                console.log("Ya se encuentra registrado");
                return done(null, user)
            }

            const newUser = {
                first_name: profile._json.name,
                last_name: "",
                age: 0,
                email: profile._json.email,
                password: ""
            }
            const result = await UserModel.create(newUser);

            return done(null, result)

        } catch (error) { return done("Error login con github", error) }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport