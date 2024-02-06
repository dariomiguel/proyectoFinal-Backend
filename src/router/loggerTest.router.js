import express from "express"
import { logger } from "../utils/logger.js"

const router = express.Router();


router.get("/", (req, res) => {
    logger.debug("debug")
    logger.http("This is http")
    logger.info("This is the info")
    logger.warning("WARNING")
    //Error de prueba
    const errorTest = new Error("Este es un error intencional")
    logger.error("ERROR ", errorTest)
    logger.fatal("Error FATAL!! ")

    res.send("Test Logger complete!")
})

export default router