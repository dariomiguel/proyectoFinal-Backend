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
    // if (Object.keys(datos).length === 0) {
    //     console.error("Atención: Verifique que todos los datos se hayan cargado correctamente o que el código de producto no se repita!");
    // } else {
    console.log(datos);
    const div = document.createElement("div");
    nuevoProducto.append(
        div.innerHTML = `  <div> ${datos}   </div>
        `)

    // }
})
// function sendDelete(id) {
//     socket.emit("inputDeleteProduct", id)
// }

// socket.on("serverShowProducts", data)


productsAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        const titleInput = document.getElementById('titleAdd').value;
        const priceInput = document.getElementById('priceAdd').value;
        const descriptionInput = document.getElementById('descriptionAdd').value;
        const codeInput = document.getElementById('codeAdd').value;
        const stockAdd = document.getElementById('stockAdd').value;
        const categoryInput = document.getElementById('categoryAdd').value;
        const thumbnailsInput = document.getElementById('thumbnailsAdd').value;

        sendAddProducts(titleInput, priceInput, descriptionInput, codeInput, stockAdd, categoryInput, thumbnailsInput);

    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
})


document.querySelector('#btnDelete').addEventListener('click', (event) => {
    event.preventDefault();
    const titleInput = document.getElementById('titleDelete').value;
    sendDelete(titleInput);
});
