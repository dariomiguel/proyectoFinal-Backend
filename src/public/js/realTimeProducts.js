//Utilizamos una variable para manejar el formulario de adisión
const productsAddForm = document.getElementById("productForm");
const nuevoProducto = document.getElementById("nuevoProductoAgregado")


let socket;
// Función para inicializar la conexión de Socket.IO
function initIO() {
    socket = io();
}
initIO();

// Función para enviar un nuevo producto al servidor
function sendAddProducts(title, price, description, code, stock, category, thumbnails) {
    socket.emit("clientAddProduct", {
        title,
        price,
        description,
        code,
        stock,
        category,
        thumbnails
    });
}

const productList = document.getElementById("productList");

socket.on("productos", (productos) => {
    while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
    }

    productos.forEach((producto) => {
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `
        <h3>${producto.title}</h3>
        <ul>
            <li>$ ${producto.price}</li>
            <li>N° Id: ${producto.id}</li>
            <li>${producto.description}</li>
            <li>Código de producto: ${producto.code}</li>
            <li>Stock: ${producto.stock}</li>
            <li>Categoría: ${producto.category}</li>
            <li>${producto.thumbnails}</li>
        </ul>
        <hr />
    `;
        productList.appendChild(productDiv);
    });
});


function sendDelete(id) {
    socket.emit("clientDeleteProduct", id)
    console.log();
}

productsAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        const titleInput = document.getElementById('titleAdd');
        const priceInput = document.getElementById('priceAdd');
        const descriptionInput = document.getElementById('descriptionAdd');
        const codeInput = document.getElementById('codeAdd');
        const stockAdd = document.getElementById('stockAdd');
        const categoryInput = document.getElementById('categoryAdd');
        const thumbnailsInput = document.getElementById('thumbnailsAdd');


        const title = titleInput.value;
        const price = priceInput.value;
        const description = descriptionInput.value;
        const code = codeInput.value;
        const stock = stockAdd.value;
        const category = categoryInput.value;
        const thumbnails = thumbnailsInput.value;

        sendAddProducts(title, price, description, code, stock, category, thumbnails);

        titleInput.value = "";
        priceInput.value = "";
        descriptionInput.value = "";
        codeInput.value = "";
        stockAdd.value = "";
        categoryInput.value = "";
        thumbnailsInput.value = "";

    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
})


document.querySelector('#btnDelete').addEventListener('click', (event) => {
    event.preventDefault();
    const titleInput = document.getElementById('titleDelete').value;
    sendDelete(titleInput);
});
