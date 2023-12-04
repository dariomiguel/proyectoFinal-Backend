document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones con la clase 'btnAddCart'
    let btnsAddCart = document.querySelectorAll('.btnAddCart');

    // Agrega un listener a cada botón
    btnsAddCart.forEach(btnAddCart => {
        btnAddCart.addEventListener('click', async (event) => {
            event.preventDefault();
            let productId = event.target.getAttribute('data-product-id');
            console.log("el product id es :", productId);
            try {
                let response = await fetch(`http://localhost:8080/api/carts/${0}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                let result = await response.json();

                // Puedes hacer algo con el resultado, si es necesario
                console.log(result);
            } catch (error) {
                console.error('Hubo un error al realizar la solicitud POST:', error);
            }
        });
    });
});
