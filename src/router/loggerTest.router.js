import express from "express"
import { addLogger } from "../utils/logger.js"

const router = express.Router();
router.use(addLogger);

router.get("/", (req, res) => {
    req.logger.debug("debug")
    req.logger.http("This is http")
    req.logger.info("This is the info")
    req.logger.warning("WARNING")
    req.logger.error("ERROR ")
    req.logger.fatal("Error FATAL!! ")

    res.send("Test Logger complete!")
})

export default router