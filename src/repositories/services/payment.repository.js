import Stripe from "stripe"

//PRIVATE KEY
const key = "sk_test_51P094KEPX0bJa8Kh4SLPibF9A0yz0eH0ITwZMpfz0SZplLUCEceDRAWIIlUHHYtOwOIqabYSVghLyBwEmJqw474900ohtmhYOc"

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe(key)
    }

    createPaymentIntent = async (data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data);

        return paymentIntent
    }
}