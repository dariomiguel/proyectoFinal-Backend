import express from "express"
import { addLogger } from "../utils/logger.js"

const router = express.Router();
router.use(addLogger);

router.get("/test", (req, res) => {
    req.logger.silly("silly")
    req.logger.debug("debug")
    req.logger.verbose("verbose")
    req.logger.http("This is http")
    req.logger.info("This is the info")
    req.logger.warn("WARNING")
    req.logger.error("ERROR ")
})

router.get("/", (req, res) => res.send("logger Testing"))
router.post("/", (req, res) => res.send("logger Testing con POST"))


export default router