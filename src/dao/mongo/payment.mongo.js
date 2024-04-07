export class Product {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

export class PriceData {
    constructor(productData, currency, unitAmount) {
        this.product_data = productData;
        this.currency = currency;
        this.unit_amount = unitAmount;
    }
}

export class MainClass {
    constructor(priceData, quantity) {
        this.price_data = priceData;
        this.quantity = quantity;
    }
}

class PaymentManager {
    get = async (cart) => {
        try {
            const response = []

            for (let i = 0; i < cart.products.length; i++) {

                const product = new Product(cart.products[i].product.title, cart.products[i].product.description);
                const priceData = new PriceData(product, "usd", parseInt(cart.products[i].product.price * 100));
                const mainObject = new MainClass(priceData, cart.products[i].quantity);

                response.push(mainObject)
            }

            return response

        } catch (error) {
            logger.error(error)
            throw error
        }
    }
}

export default PaymentManager
