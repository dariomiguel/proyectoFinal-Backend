const btnGoToRestore = document.getElementById("goToRestorePass");
if (btnGoToRestore) {
    try {
        btnGoToRestore.addEventListener("click", async (event) => {
            event.preventDefault();

            window.location.href = "http://localhost:8080/recoverpass"
        })
    } catch (error) {
        logger.error("Hubo un error al redireccionar la página", error);
    }
}

const btnResetPass = document.getElementById("resetPassForm")
if (btnResetPass) {
    try {
        btnResetPass.addEventListener("click", async (event) => {
            event.preventDefault();

            Swal.fire({
                icon: "success",
                title: "Mensaje de restauración enviado!",
                text: "Revise su casilla de correo para restablecer su contraseña.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Volver a inicio"
            }).then(() => {
                window.location.href = "http://localhost:8080/"
            })
        })
    } catch (error) {
        logger.error("Hubo un error al realizar la solicitud: ", error);
    }
}