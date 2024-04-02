import { Router } from "express";
import PaymentService from "../repositories/services/payment.repository.js";

const router = Router();

router.get("/tarjeta-credito", (req, res) => {
    // Suponiendo que tienes un objeto con los datos de la tarjeta de crédito
    const tarjetaData = {
        numero: '1234 5678 9012 3456',
        titular: 'Nombre del Titular',
        expiracion: '01/25',
        codigo: '123'
    };

    // Renderizar la vista de Handlebars y pasarle los datos de la tarjeta de crédito
    res.render('tarjeta', tarjetaData);
});

router.post("/payment-intents", async (req, res) => {
    const productRequested = products.find(p => p.id == req.query.id)

    if (!productRequested) return res.status(404).send("Product not found!");

    const paymentIntentInfo = {
        amount: productRequested.price,
        currency: "usd",
        payment_method_types: ["card"]
    }


    const service = new PaymentService();
    const result = await service.createPaymentIntent(paymentIntentInfo)

    console.log(result);
    return res.send({ status: "success", payload: result })
})

export default router