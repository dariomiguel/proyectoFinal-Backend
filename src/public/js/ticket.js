const actualTicket = document.querySelector("#current")

if (actualTicket) {
    actualTicket.onclick = (e) => {
        e.preventDefault();
        fetch("/api/session/current", {
            headers: { "Content-Type": "application/json" }
        })
            .then(r => r.json())
            .then(data => {
                document.querySelector("#result").innerHTML = JSON.stringify(data)
            })
    }
}

const buyBtn = document.getElementById("comprarButton")
if (buyBtn) {
    buyBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            const cidValue = getCIDFromURL();

            const response = await fetch(`/api/carts/${cidValue}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Extraer el payload del response como JSON para poder utilizar los valores qe dio el post
            const responseData = await response.json();
            const ticket = responseData.payload;

            Swal.fire({
                title: "Compra exitosa",
                html: `
                <p>Fecha: ${ticket.purchase_datetime}</p>
                <p>Comprador: ${ticket.purchaser}</p>
                <p>Código: ${ticket.code}</p>
                <p>Total: $${ticket.amount}</p>
            `,
                icon: "success"
            }).then(() => {
                window.location.href = `/api/carts/${cidValue}/purchase`;
            });

            const responseGet = await fetch(`/api/carts/${cidValue}/purchase`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        } catch (error) {
            console.error("Error en la compra:", error);
        }
    });
}
function getCIDFromURL() {
    const url = window.location.href;
    const segments = url.split("/");
    return segments[segments.length - 1] || "No se encontró CID";
}