//Utilizamos una variable para manejar el formulario de adisión
const productsAddForm = document.getElementById("productForm");
const nuevoProducto = document.getElementById("nuevoProductoAgregado");

let socket;
// Función para inicializar la conexión de Socket.IO
function initIO() {
    socket = io();
}
initIO();

// Función para enviar un nuevo producto al servidor
function sendAddProducts(title, price, description, code, stock, category, thumbnail) {
    socket.emit("clientAddProduct", {
        title,
        price,
        description,
        code,
        stock,
        category,
        thumbnail
    });
}

socket.on("ServerAddProducts", (datos) => {
    const div = document.createElement("div");
    div.id = datos.id;
    div.innerHTML = `
        <h3>${datos.title}</h3>
        <ul>
            <li>$ ${datos.price}</li>
            <li>N° Id: ${datos.id}</li>
            <li>${datos.description}</li>
            <li>Código de producto: ${datos.code}</li>
            <li>Stock: ${datos.stock}</li>
            <li>Categoría: ${datos.category}</li>
            <li>${datos.thumbnail}</li>
        </ul>
        <hr />
    `;

    //Agregamos en la parte superior
    nuevoProducto.insertBefore(div, nuevoProducto.firstChild);
});

const sendDelete = async (id) => {
    await fetch(`/api/products/${id}`, {
        method: "DELETE",
    })
        .then((data) => data.json())
        .then((json) => {
            document.getElementById(id).innerHTML = "";
        });
};

productsAddForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const titleInput = document.getElementById("titleAdd");
        const priceInput = document.getElementById("priceAdd");
        const descriptionInput = document.getElementById("descriptionAdd");
        const codeInput = document.getElementById("codeAdd");
        const stockAdd = document.getElementById("stockAdd");
        const categoryInput = document.getElementById("categoryAdd");
        const thumbnailInput = document.getElementById("thumbnailAdd");

        const title = titleInput.value;
        const price = priceInput.value;
        const description = descriptionInput.value;
        const code = codeInput.value;
        const stock = stockAdd.value;
        const category = categoryInput.value;
        const thumbnail = thumbnailInput.value;

        const response = await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                price,
                description,
                code,
                stock,
                category,
                thumbnail,
            }),
        });
        if (response.ok) {
            console.log("Se agregó correctacemte un producto desde el formulario cliente!");
        } else {
            console.error("Error agregando el producto desde formulario cliente:", response.statusText);
        }

        titleInput.value = "";
        priceInput.value = "";
        descriptionInput.value = "";
        codeInput.value = "";
        stockAdd.value = "";
        categoryInput.value = "";
        thumbnailInput.value = "";
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
});

document.querySelector("#btnDelete").addEventListener("click", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("titleDelete").value;
    sendDelete(titleInput);
});
