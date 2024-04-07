import Stripe from "stripe"
import config from "../config/config.js"
import { cartService, paymentService } from "../repositories/index.js";

const KEY = config.stripeKey;
const stripe = new Stripe(KEY)

export const createSession = async (req, res) => {
    try {
        const cId = req.params.cid;
        const cartPorId = await cartService.get(cId);

        if (cartPorId === null) {
            logger.error("Error ")
            res
                .status(404)
                .json({ Error: "No se encontró el carrito solicitado" });
        } else {

            const cartToPay = await paymentService.get(cartPorId)
            const session = await stripe.checkout.sessions.create({
                line_items: cartToPay,
                mode: "payment",
                success_url: `http://localhost:8080/api/carts/${cId}/purchase`,
                cancel_url: "http://localhost:8080/api/payments/cancel",
            })
            return res.json(session)
        }


    } catch (error) {
        // Maneja cualquier error que ocurra durante la creación del intento de pago
        console.error("Error al crear el intento de pago:", error.message);
        return res.status(500).send("Error al procesar el pago. Por favor, inténtalo de nuevo más tarde.");
    }
}

export const cancel = (req, res) => res.send("Cancel 2")