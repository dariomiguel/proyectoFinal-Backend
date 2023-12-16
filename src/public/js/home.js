// Función para obtener los valores de los elementos
const getFormValues = (ordenDePrecios) => {
    return {
        limit: document.querySelector("#limit").value,
        query: document.querySelector("#query").value,
        category: document.querySelector("#category").value,
        stockAvailability: document.querySelector("#stockAvailability").value,
        priceOrder: ordenDePrecios || document.querySelector("#priceOrder").value,
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
    const nextPage = document.querySelector("#page").value;
    const values = getFormValues();
    redirectToPage(nextPage, values);
};


function orderPriceSelected() {
    let orderLista = document.getElementById("priceOrder");
    let opcionSeleccionada = orderLista.options[orderLista.selectedIndex].value;

    const values = getFormValues(opcionSeleccionada);
    redirectToPage(1, values);
}