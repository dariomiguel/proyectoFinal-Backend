let cartId

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
                const existCartInUserResponse = await fetch(`http://localhost:8080/api/users/`, {
                    method: 'GET',
                });
                const existCartInUserData = await existCartInUserResponse.json();

                if (!existCartInUserData.payload) {
                    let responseCreateCart = await fetch(`http://localhost:8080/api/carts/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const responseData = await responseCreateCart.json();
                    cartId = responseData.payload._id;

                } else cartId = existCartInUserData.payload

                await fetch(`http://localhost:8080/api/users/cart/${cartId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error('Hubo un error al realizar la solicitud POST:', error);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const btnSeeCart = document.getElementById('btnSeeCart');

    btnSeeCart.addEventListener('click', async () => {
        try {

            const existCartInUserResponse = await fetch('http://localhost:8080/api/users/');
            const existCartInUserData = await existCartInUserResponse.json();

            let cartId;

            if (!existCartInUserData.payload) {
                // Si no tiene un carrito existente, crea uno nuevo
                const responseCreateCart = await fetch('http://localhost:8080/api/carts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const responseData = await responseCreateCart.json();
                cartId = responseData.payload._id;
            } else {
                cartId = existCartInUserData.payload;
            }

            window.location.href = `http://localhost:8080/api/carts/${cartId}`;
        } catch (error) {
            console.error('Hubo un error al realizar la solicitud:', error);
        }
    });
});