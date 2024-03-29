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
                <li>N° Id: ${datos.producto._id}</li>
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
        const response = await fetch(`/api/products/${id}`, {
            method: "DELETE",
        });
        const responseData = await response.json();

        if (response.ok) {
            if (responseData.payload) {
                Swal.fire({
                    icon: "success",
                    title: "Producto Eliminado!",
                    text: "🗑️",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Aceptar"
                });
                document.getElementById(id).innerHTML = "";

            } else {
                console.error("Error elimando el producto, se necesitan permisos.");
                Swal.fire({
                    icon: "error",
                    title: "Atención!!",
                    text: "Usted no tiene el permiso para eliminar este producto!",
                    confirmButtonColor: "#d33",
                    confirmButtonText: "Cerrar"
                });
            }

        } else {
            console.error("Error elimando el producto desde formulario cliente:", response);
            Swal.fire({
                icon: "error",
                title: "Id no encontrado",
                text: "No se pudo eliminar el producto.",
                confirmButtonColor: "#d33",
                confirmButtonText: "Cerrar"
            });
        }
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
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title, price, description, code, stock, category, thumbnail
            }),
        });

        if (response.ok) {
            let lastAddedProduct;
            const obtainID = await fetch("/api/lastProduct", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (obtainID.ok) {
                const responseData = await obtainID.json();
                lastAddedProduct = responseData.payload;
            } else {
                console.error("Error al obtener el último producto. Código de estado:", obtainID.status);
            }
            sendProduct(lastAddedProduct)
            Swal.fire({
                icon: "success",
                title: "Producto Agregado",
                text: "El producto se ha agregado correctamente.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar"
            });

        } else {
            console.error("Error agregando el producto desde formulario cliente:", response);
            Swal.fire({
                icon: "error",
                title: "Código incorrecto!",
                text: "No se pudo agregar el producto. Ya existe un producto con ese código.",
                confirmButtonColor: "#d33",
                confirmButtonText: "Cerrar"
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
    socket.emit("ClienteEnvioProducto", { producto })
}

