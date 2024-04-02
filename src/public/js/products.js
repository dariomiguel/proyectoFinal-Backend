let cartId

document.addEventListener("DOMContentLoaded", () => {
    // Selecciona todos los botones con la clase "btnAddCart"
    let btnsAddCart = document.querySelectorAll(".btnAddCart");

    // Agrega un listener a cada botón
    btnsAddCart.forEach(btnAddCart => {
        btnAddCart.addEventListener("click", async (event) => {
            event.preventDefault();

            const timerInterval = 8000
            Swal.fire({
                title: "Procesando...",
                timer: timerInterval,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            })

            let productId = event.target.getAttribute("data-product-id");

            const responseGet = await fetch(`/api/products/${productId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const existCartInUserData = await existCartInUserResponse.json();

                if (!existCartInUserData.payload) {
                    let responseCreateCart = await fetch(`/api/carts/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const responseData = await responseCreateCart.json();
                    cartId = responseData.payload._id;

                } else cartId = existCartInUserData.payload

                await fetch(`/api/users/cart/${cartId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const responsePost = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const responseDataPost = await responsePost.json();
                const isOwnerOfProduct = responseDataPost.payload;

                if (!isOwnerOfProduct) {
                    Swal.fire({
                        icon: "error",
                        title: "Error agregando producto",
                        text: "Usted es dueño del producto, no puede agregar al carrito.",
                        confirmButtonColor: "#d33",
                        confirmButtonText: "Cerrar"
                    });
                    return
                }

                Swal.fire({
                    icon: "success",
                    title: "Producto Agregado",
                    text: "El producto se ha agregado correctamente al carrito.",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar"
                })

            } catch (error) {
                logger.error("Hubo un error al realizar la solicitud POST:", error);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const btnSeeCart = document.getElementById("btnSeeCart");

    if (btnSeeCart) {
        btnSeeCart.addEventListener("click", async (event) => {
            event.preventDefault();

            try {
                const existCartInUserResponse = await fetch(`/api/users/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const existCartInUserData = await existCartInUserResponse.json();

                if (!existCartInUserData.payload) {
                    // Si no tiene un carrito existente, crea uno nuevo
                    const responseCreateCart = await fetch("/api/carts/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const responseData = await responseCreateCart.json();
                    cartId = responseData.payload._id;
                } else cartId = existCartInUserData.payload;

                await fetch(`/api/users/cart/${cartId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                window.location.href = `/api/carts/${cartId}`;
            } catch (error) {
                logger.error("Hubo un error al realizar la solicitud:", error);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const btnChangeRole = document.getElementById("btnChangeRole");
    if (btnChangeRole) {
        btnChangeRole.addEventListener("click", async () => {
            const url = window.location.href;
            const segments = url.split("/");
            const uid = segments[segments.length - 1];

            try {
                const response = await fetch(`/api/users/premium/${uid}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();

                if (data) {
                    Swal.fire({
                        icon: "success",
                        title: "Cambio Completado!",
                        text: "El cambio de rol se ha producido correctamente.",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Aceptar"
                    })
                        .then(() => window.location.reload())
                    return
                }

                Swal.fire({
                    icon: "error",
                    title: "Hubo un error",
                    text: "El rol no se ha podido cambiar.",
                    confirmButtonColor: "#d33",
                    confirmButtonText: "Cerrar"
                })
                    .then(() => window.location.reload())
                return
            } catch (error) {
                console.error("Error al cambiar el rol de usuario:", error);
            }
        });
    }
});
