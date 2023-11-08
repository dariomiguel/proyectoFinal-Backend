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

socket.on("ServerAddProducts", datos => {
    console.log(datos);

    const div = document.createElement("div");

    div.innerHTML = `
        <h3>${datos.title}</h3>
        <ul>
            <li>$ ${datos.price}</li>
            <li>N° Id: ${datos.id}</li>
            <li>${datos.description}</li>
            <li>Código de producto: ${datos.code}</li>
            <li>Stock: ${datos.stock}</li>
            <li>Categoría: ${datos.category}</li>
            <li>${datos.thumbnails}</li>
        </ul>
        <hr />
    `;

    //Agregamos en la parte superior
    nuevoProducto.insertBefore(div, nuevoProducto.firstChild)
});

// function sendDelete(id) {
//     socket.emit("inputDeleteProduct", id)
// }

// socket.on("serverShowProducts", data)


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
