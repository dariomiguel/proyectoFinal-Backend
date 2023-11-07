// Inicializamos la conexión de Socket.IO
let socket;
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

socket.on("ServerAddProducts", data => {
    console.log("Esto esta en el front ahora", data);
})

function sendDelete(id) {
    socket.emit("inputDeleteProduct", id)
}

// Función para inicializar la conexión de Socket.IO
function initIO() {
    socket = io();
}




document.querySelector('#btnAdd').addEventListener('click', (event) => {
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
});


document.querySelector('#btnDelete').addEventListener('click', (event) => {
    event.preventDefault();
    const titleInput = document.getElementById('titleDelete').value;
    sendDelete(titleInput);
});
