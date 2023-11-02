// Inicializamos la conexión de Socket.IO
let socket;

// Función para enviar un nuevo producto al servidor
function sendMessage(title, price, description, code, stock, category, img) {
    socket.emit("addProduct", {
        title: title,
        price: price,
        description: description,
        code: code,
        stock: stock,
        category: category,
        img: img
    });
}

function sendDelete(id) {
    socket.emit("inputDeleteProduct", id)
}

// Función para inicializar la conexión de Socket.IO
function initIO() {
    socket = io();
}

// Esta función se ejecuta después de que la página se ha cargado y Socket.IO está inicializado.
initIO();


document.querySelector('#btnAdd').addEventListener('click', (event) => {
    try {
        const titleInput = document.getElementById('titleAdd').value;
        const priceInput = document.getElementById('priceAdd').value;
        const descriptionInput = document.getElementById('descriptionAdd').value;
        const codeInput = document.getElementById('codeAdd').value;
        const stockAdd = document.getElementById('stockAdd').value;
        const categoryInput = document.getElementById('categoryAdd').value;
        const imgInput = document.getElementById('imgAdd').value;

        sendMessage(titleInput, priceInput, descriptionInput, codeInput, stockAdd, categoryInput, imgInput);
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
});


document.querySelector('#btnDelete').addEventListener('click', (event) => {
    const titleInput = document.getElementById('titleDelete').value;
    sendDelete(titleInput);
});
