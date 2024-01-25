document.getElementById("comprarButton").addEventListener("click", async (event) => {
    event.preventDefault();
    const cidValue = getCIDFromURL();
    console.log("El valor del CID en el front es:", cidValue);

    await fetch(`http://localhost:8080/api/carts/${cidValue}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

});

function getCIDFromURL() {
    const url = window.location.href;
    const segments = url.split("/");
    return segments[segments.length - 1] || "No se encontró CID";
}