const loginForm = document.getElementById("sessionForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.querySelector("#emailLogin").value;
    const password = document.querySelector("#passLogin").value;

    Swal.fire({
        title: "Login",
        html: "Iniciando sesión",
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
        fetch("/api/session/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" }
        })
            .then(r => r.json())
            .then(data => console.log(data))

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
            // Swal.fire({
            //     icon: "success",
            //     title: "Producto Eliminado!",
            //     text: "🗑️",
            //     confirmButtonColor: "#3085d6",
            //     confirmButtonText: "Aceptar"
            // });

            //.then(() => {

            window.location.href = "/products";
            // });
        }

    } catch (error) {
        console.error("Error en el login:", error);
    }
});