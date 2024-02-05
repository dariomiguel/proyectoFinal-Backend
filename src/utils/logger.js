import { options } from "../config/commander.js"
import winston from "winston"

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

let logger
switch (options.env) {
    case "development":
        console.log(`Entorno de desarrollo ${options.env}`)
        logger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple(),
                    level: "debug"
                }),
            ]
        })

        break;

    case "production":
        console.log(`Entorno de desarrollo ${options.env}`)
        logger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple(),
                    level: "info"
                }),
                new winston.transports.File({
                    filename: "./errors.log",
                    level: "error"
                })
            ]
        })

        break;
    default:

        throw new Error("Entorno de desarrollo no esta configurado!")
}
export { logger }

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`[${req.method}] ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}

