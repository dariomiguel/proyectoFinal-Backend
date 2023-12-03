const loginForm = document.getElementById("sessionForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const emailInput = document.getElementById("emailLogin");
    const passInput = document.getElementById("passLogin");

    const email = emailInput.value;
    const password = passInput.value;

    try {
        const response = await fetch("/api/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email, password
            }),
        });
        console.log("Respuesta del servidor:", response);
        if (response.status === 401) {
            Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: 'El usuario o la contraseña son incorrectos',
            })
        } else if (response.status === 200) {
            // Redirige al usuario a la página deseada
            window.location.href = "/products";
        }


    } catch (error) {
        console.error("Error en el login:", error);
    }
});