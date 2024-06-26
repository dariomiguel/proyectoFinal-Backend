// Función para obtener los valores de los elementos
const getFormValues = (ordenDePrecios) => {

    const urlParams = new URLSearchParams(window.location.search);
    const categoryElement = document.querySelector("#category");
    const selectedCategory = categoryElement ? categoryElement.value : null;

    return {
        limit: document.querySelector("#limit").value,
        query: document.querySelector("#query").value,
        category: selectedCategory || urlParams.get("category") || "",
        stockAvailability: document.querySelector("#stockAvailability").value,
        priceOrder: ordenDePrecios || document.querySelector("#priceOrder").value || urlParams.get("priceOrder"),
    };
};

// Función para construir la URL y redireccionar
const redirectToPage = (page, values) => {
    //Construye una ruta relativa para reutilizar
    const currentPath = window.location.pathname;

    const url = `${currentPath}?page=${page}&limit=${values.limit}&query=${values.query}&category=${values.category}&stockAvailability=${values.stockAvailability}&priceOrder=${values.priceOrder}`;

    document.location.href = url;
};

// Evento para el botón "Prev"
document.querySelector("#btnPrev").onclick = () => {
    const prevPage = document.querySelector("#prevPage").value;
    const values = getFormValues();
    redirectToPage(prevPage, values);
};

// Evento para el botón "Next"
document.querySelector("#btnNext").onclick = () => {
    const nextPage = document.querySelector("#nextPage").value;
    const values = getFormValues();
    redirectToPage(nextPage, values);
};

// Evento para el botón "Search"
document.querySelector("#btnSearch").onclick = () => {
    const values = getFormValues();
    redirectToPage(1, values);
};


function orderPriceSelected() {
    let listOrder = document.getElementById("priceOrder");
    let selectedOption = listOrder.options[listOrder.selectedIndex].value;

    const values = getFormValues(selectedOption);
    redirectToPage(1, values);
}

const categoryElement = document.querySelector("#category")
categoryElement.addEventListener("change", () => {
    const values = getFormValues();
    redirectToPage(1, values)
})

const uploadForm = document.getElementById("uploadForm");

if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById("fileInput");
        const selectFileType = document.getElementById("fileType");

        const formData = new FormData();
        const docs = document.querySelector('input[type="file"]').files;

        for (let i = 0; i < docs.length; i++) {
            formData.append(selectFileType.value, docs[i]);
        }

        try {
            const responseGet = await fetch("/api/users/uid", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const { payload: userId } = await responseGet.json();

            const response = await fetch(`/api/users/${userId}/documents`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();

            document.getElementById("message").textContent = data.message;
            fileInput.value = ""; // Limpiar el campo de entrada de archivos después de la carga

        } catch (error) {
            console.error("Error:", error);
            document.getElementById("message").textContent = "Error al subir archivo(s)";
        }
    });
}
