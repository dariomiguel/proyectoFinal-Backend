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

        if (response.status === 400) {
            Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: 'Usuario incorrecto',
            })
        }
        else if (response.status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: 'La contraseña es incorrecta',
            })
        }
        else if (response.status === 500) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: 'ha ocurrido un error en el sistema!!',
            })
        }
        else if (response.status === 200) {
            window.location.href = "/products";
        }

    } catch (error) {
        console.error("Error en el login:", error);
    }
});