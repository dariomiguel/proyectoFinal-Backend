const listaProductos = document.querySelector("#notes");

const appendProduct = product => {
    listaProductos.innerHTML += `
        <div>
            <div>
                <h1>${product.title}</h1>
                <div>
                    <button> delete </button>
                    <button> update </button>
                </div>
            </div>
            <p>${product.description}</p>
        </div>`

}