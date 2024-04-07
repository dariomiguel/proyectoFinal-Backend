import { Router } from "express";
import { createSession } from "../controllers/payment.controller.js";

const router = Router();

router.post("/payment-intents/:cid", createSession);

export default router