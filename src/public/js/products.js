let cartId

document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones con la clase 'btnAddCart'
    let btnsAddCart = document.querySelectorAll('.btnAddCart');

    // Agrega un listener a cada botón
    btnsAddCart.forEach(btnAddCart => {
        btnAddCart.addEventListener('click', async (event) => {
            event.preventDefault();
            let productId = event.target.getAttribute('data-product-id');

            const responseGet = await fetch(`/api/products/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseGetData = await responseGet.json();
            const productoGet = responseGetData.payload;

            if (productoGet.stock === 0) {
                return Swal.fire({
                    icon: "error",
                    title: "Producto no agregado!",
                    text: "El producto no posee stock.",
                    confirmButtonColor: "#d33",
                    confirmButtonText: "Cerrar"
                });
            }
            try {
                const existCartInUserResponse = await fetch(`/api/users/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const existCartInUserData = await existCartInUserResponse.json();

                if (!existCartInUserData.payload) {
                    let responseCreateCart = await fetch(`/api/carts/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const responseData = await responseCreateCart.json();
                    cartId = responseData.payload._id;

                } else cartId = existCartInUserData.payload

                await fetch(`/api/users/cart/${cartId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                Swal.fire({
                    icon: "success",
                    title: "Producto Agregado",
                    text: "El producto se ha agregado correctamente al carrito.",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar"
                })

                await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            } catch (error) {
                logger.error('Hubo un error al realizar la solicitud POST:', error);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const btnSeeCart = document.getElementById('btnSeeCart');

    btnSeeCart.addEventListener('click', async (event) => {
        event.preventDefault();

        try {
            const existCartInUserResponse = await fetch(`/api/users/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const existCartInUserData = await existCartInUserResponse.json();

            if (!existCartInUserData.payload) {
                // Si no tiene un carrito existente, crea uno nuevo
                const responseCreateCart = await fetch('/api/carts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const responseData = await responseCreateCart.json();
                cartId = responseData.payload._id;
            } else cartId = existCartInUserData.payload;

            await fetch(`/api/users/cart/${cartId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            window.location.href = `/api/carts/${cartId}`;
        } catch (error) {
            logger.error('Hubo un error al realizar la solicitud:', error);
        }
    });
});
