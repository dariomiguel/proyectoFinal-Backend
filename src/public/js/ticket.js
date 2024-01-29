document.querySelector("#current").onclick = (e) => {
    fetch("/api/session/current", {
        headers: { "Content-Type": "application/json" }
    })
        .then(r => r.json())
        .then(data => {
            document.querySelector("#result").innerHTML = JSON.stringify(data)
        })
}

document.getElementById("comprarButton").addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        const cidValue = getCIDFromURL();
        console.log("El valor del CID en el front es:", cidValue);

        const response = await fetch(`/api/carts/${cidValue}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Extraer el payload del response como JSON para poder utilizar los valores qe dio el post
        const responseData = await response.json();
        const ticket = responseData.payload;
        console.log("El ticket creado es: ", ticket);

        Swal.fire({
            title: "Compra exitosa",
            html: `
                <p>Fecha: ${ticket.purchase_datetime}</p>
                <p>Comprador: ${ticket.purchaser}</p>
                <p>Código: ${ticket.code}</p>
                <p>Total: $${ticket.amount}</p>
            `,
            icon: "success",
            buttons: {
                confirm: {
                    text: "Cerrar",
                    value: true,
                    visible: true,
                    className: "btn btn-success"
                }
            }
        }).then(() => {
            window.location.reload();
        });

    } catch (error) {
        console.error("Error en la compra:", error);
    }


});

function getCIDFromURL() {
    const url = window.location.href;
    const segments = url.split("/");
    return segments[segments.length - 1] || "No se encontró CID";
}