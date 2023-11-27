// Función para construir la URL y redireccionar
const redirectToPage = (page, limit, query, category, stockAvailability, priceOrder) => {
    const url = `/?page=${page}&limit=${limit}&query=${query}&category=${category}&stockAvailability=${stockAvailability}&priceOrder=${priceOrder}`;
    document.location.href = url;
};

// Evento para el botón "Prev"
document.querySelector("#btnPrev").onclick = () => {
    const prevPage = document.querySelector("#prevPage").value;
    const limit = document.querySelector("#limit").value;
    const query = document.querySelector("#query").value;
    const category = document.querySelector("#category").value;
    const stockAvailability = document.querySelector("#stockAvailability").value;
    const priceOrder = document.querySelector("#priceOrder").value;

    redirectToPage(prevPage, limit, query, category, stockAvailability, priceOrder);
};

// Evento para el botón "Next"
document.querySelector("#btnNext").onclick = () => {
    const nextPage = document.querySelector("#nextPage").value;
    const limit = document.querySelector("#limit").value;
    const query = document.querySelector("#query").value;
    const category = document.querySelector("#category").value;
    const stockAvailability = document.querySelector("#stockAvailability").value;
    const priceOrder = document.querySelector("#priceOrder").value;

    redirectToPage(nextPage, limit, query, category, stockAvailability, priceOrder);
};

// Evento para el botón "Search"
document.querySelector("#btnSearch").onclick = () => {
    const nextPage = document.querySelector("#page").value;
    const limit = document.querySelector("#limit").value;
    const query = document.querySelector("#query").value;
    const category = document.querySelector("#category").value;
    const stockAvailability = document.querySelector("#stockAvailability").value;
    const priceOrder = document.querySelector("#priceOrder").value;

    redirectToPage(nextPage, limit, query, category, stockAvailability, priceOrder);
};
