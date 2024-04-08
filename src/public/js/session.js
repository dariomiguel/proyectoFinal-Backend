const loginForm = document.getElementById("sessionForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.querySelector("#emailLogin").value;
    const password = document.querySelector("#passLogin").value;

    const timerInterval = 8000
    Swal.fire({
        title: "Iniciando sesión",
        html: "Espere por favor...",
        timer: 8000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    })

    try {
        const response = await fetch("/api/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            }),
        });

        if (response.ok) {
            // Si la respuesta es exitosa (código de estado 200-299),
            // redirige al usuario a la página de productos.
            window.location.href = "/products";
        } else {
            // Manejo de errores según el código de estado de la respuesta.
            let errorMessage = "Ocurrió un error en el inicio de sesión.";

            if (response.status === 400) {
                errorMessage = "Usuario o contraseña incorrectos.";
            } else if (response.status === 403) {
                errorMessage = "La contraseña es incorrecta.";
            } else if (response.status === 500) {
                errorMessage = "Ocurrió un error en el sistema.";
            }

            // Muestra un mensaje de error al usuario.
            Swal.fire({
                icon: "error",
                title: "Error de inicio de sesión",
                text: errorMessage,
            });
        }


    } catch (error) {
        console.error("Error en el login:", error);
    }
});