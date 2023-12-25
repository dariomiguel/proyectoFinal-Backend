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
                let responseCreateCart = await fetch(`http://localhost:8080/api/carts/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log("La respuesta a creación de carrito:", responseCreateCart)

                let response = await fetch(`http://localhost:8080/api/carts/655bea399adbe0364abee861/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                let result = await response.json();
                console.log(result);

            } catch (error) {
                console.error('Hubo un error al realizar la solicitud POST:', error);
            }
        });
    });
});
