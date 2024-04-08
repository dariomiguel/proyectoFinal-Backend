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

const resetPassForm = document.getElementById("resetPassForm")
if (resetPassForm) {
    try {
        resetPassForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.querySelector("#recoverEmail").value;

            const response = await fetch(`/recoverpass/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (data.payload) {
                await fetch(`/mail/reset-password/${email}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                Swal.fire({
                    icon: "success",
                    title: `Mensaje de restauración enviado a ${email}!`,
                    text: "Revise su casilla de correo para restablecer su contraseña.",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Volver a inicio"
                }).then(() => {
                    window.location.href = "http://localhost:8080/"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Email no encontrado!",
                    text: "El email no aparece en la base de datos, asegúrese de haber escrito bien el email e intente otra vez.",
                })
            }
        })
    } catch (error) {
        logger.error("Hubo un error al realizar la solicitud: ", error);
    }
}

const newPassForm = document.getElementById("newPassForm")
if (newPassForm) {
    try {
        newPassForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.querySelector("#emailNewPass").value;
            const pass = document.querySelector("#newPass").value;
            const tokenPass = document.querySelector("#tokenNewPass").value;


            const dataToSend = { email: email, pass: pass }
            const response = await fetch(`/recoverpass/reset/${tokenPass}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend)
            });
            const data = await response.json();

            if (data.payload) {
                Swal.fire({
                    icon: "success",
                    title: `Cambio exitoso!`,
                    text: "La contraseña se ha cambiado correctamente",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Volver a inicio"
                }).then(() => {
                    window.location.href = "http://localhost:8080/"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Contraseña incorrecta!",
                    text: "La contraseña no puede ser igual a la anterior",
                })
            }
        })
    } catch (error) {
        logger.error("Hubo un error al realizar la solicitud: ", error);
    }
}