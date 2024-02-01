import ge from "faker/lib/locales/ge/index.js";
import { generateProduct } from "../../utils.js"

class MockingProducts {
    post = async () => {
        const cantidadProductos = 100;
        let productsGenerated = []

        for (let i = 0; i < cantidadProductos; i++) {
            productsGenerated.push(generateProduct())
        }

        return productsGenerated
    }
}

export default MockingProducts