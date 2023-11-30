document.addEventListener('DOMContentLoaded', () => {
    const btnAddCart = document.querySelector('#btnAddCart');

    btnAddCart.addEventListener('click', async (event) => {
        const productId = event.target.getAttribute('data-product-id');

        try {
            const response = await fetch(`http://localhost:8080/api/carts/${0}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            // Puedes hacer algo con el resultado, si es necesario
            console.log(result);
        } catch (error) {
            console.error('Hubo un error al realizar la solicitud POST:', error);
        }
    });
});
