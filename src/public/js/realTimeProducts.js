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

socket.on("mostrandoProductos", (datos) => {
    if (datos.producto) {
        const div = document.createElement("div");
        div.id = datos.producto.id;
        div.innerHTML = `
            <h3>${datos.producto.title}</h3>
            <ul>
                <li>$ ${datos.producto.price}</li>
                <li>N° Id: ${datos.producto.id}</li>
                <li>${datos.producto.description}</li>
                <li>Código de producto: ${datos.producto.code}</li>
                <li>Stock: ${datos.producto.stock}</li>
                <li>Categoría: ${datos.producto.category}</li>
                <li>${datos.producto.thumbnail}</li>
            </ul>
            <hr />
        `;

        //Agregamos en la parte superior
        nuevoProducto.insertBefore(div, nuevoProducto.firstChild);
    } else {
        console.error("No se recibió un producto válido:", datos);
    }
});

const sendDelete = async (id) => {
    try {
        await fetch(`/api/products/${id}`, {
            method: "DELETE",
        });
        document.getElementById(id).innerHTML = "";
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
    }
};


productsAddForm.addEventListener("submit", async (event) => {

    event.preventDefault();

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

    try {
        const response = await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title, price, description, code, stock, category, thumbnail,
            }),
        });

        if (response.ok) {
            let lastAddedProduct;
            const obtainID = await fetch("http://localhost:8080/api/lastProduct", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (obtainID.ok) {
                const responseData = await obtainID.json();
                lastAddedProduct = responseData.payload;
                console.log("Esto es con obtainId:", lastAddedProduct);
            } else {
                console.error("Error al obtener el último producto. Código de estado:", obtainID.status);
            }
            console.log("Se agregó correctacemte un producto desde el formulario cliente!");
            sendProduct(lastAddedProduct)
            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: 'El producto se ha agregado correctamente.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            });


        } else {
            console.error("Error agregando el producto desde formulario cliente:", response);//.statusText);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar el producto. Ya existe un producto con ese código.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Cerrar'
            });
        }

        //!Para agregar en un boton de limpiar
        // titleInput.value = "";
        // priceInput.value = "";
        // descriptionInput.value = "";
        // codeInput.value = "";
        // stockAdd.value = "";
        // categoryInput.value = "";
        // thumbnailInput.value = "";

    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
});

document.querySelector("#btnDelete").addEventListener("click", (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("titleDelete");
    const title = titleInput.value
    sendDelete(title);
    titleInput.value = "";
});


function sendProduct(producto) {
    console.log("Este es el útimo producto agregado desde la función donde esta el emit", producto);
    socket.emit("ClienteEnvioProducto", { producto })
}

