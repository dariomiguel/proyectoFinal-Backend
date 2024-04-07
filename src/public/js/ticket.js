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
            const timerInterval = 8000
            Swal.fire({
                title: "Redireccionando...",
                html: "Espere por favor!",
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
            const cidValue = getCIDFromURL();

            const response = await fetch(`/api/carts/${cidValue}`, {
                method: "POST",
            })
            let data = await response.json()


            const responsePaymentIntent = await fetch(`/api/payments/payment-intents/${cidValue}`, {
                method: "POST",
            })
            data = await responsePaymentIntent.json()


            window.location.href = data.url


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