document.getElementById("generarProductos").addEventListener("click", async (event) => {
    event.preventDefault();

    const responseDataCreator = await fetch(`/mockingproducts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const responseData = await responseDataCreator.json();
    const responseDataString = JSON.stringify(responseData);

    console.log("el product name es: ", responseDataString);

    const newProductBox = document.getElementById("newProductGenerated");
    newProductBox.textContent = "";
    newProductBox.textContent += `${responseDataString} `
})