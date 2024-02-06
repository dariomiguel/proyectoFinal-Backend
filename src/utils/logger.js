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

logger.info(`Entorno de desarrollo ${options.env}`)

export const addLogger = (req, res, next) => {
    req.logger = logger
    logger.http(`[${req.method}] ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}

