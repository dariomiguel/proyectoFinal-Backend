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
function sendAddProducts(title, price, description, code, stock, category, img) {
    socket.emit("clientAddProduct", {
        title: title,
        price: price,
        description: description,
        code: code,
        stock: stock,
        category: category,
        img: img
    });
}
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
        const imgInput = document.getElementById('imgAdd').value;

        sendAddProducts(titleInput, priceInput, descriptionInput, codeInput, stockAdd, categoryInput, imgInput);

    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
})


document.querySelector('#btnDelete').addEventListener('click', (event) => {
    event.preventDefault();
    const titleInput = document.getElementById('titleDelete').value;
    sendDelete(titleInput);
});
