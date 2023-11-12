const listaProductos = document.querySelector("#notes");

const productUI = product => {

    const div = document.createElement("div");

    div.innerHTML = `
        <div>
            <div>
                <h1>${product.title}</h1>
                <div>
                    <button class="delete" data-id=${product.id}> delete </button>
                    <button class="update" data-id=${product.id}> update </button>
                </div>
            </div>
            <p>${product.description}</p>
        </div>`;

    const btnDelete = div.querySelector(".delete");
    btnDelete.addEventListener("click", () => {
        console.log(btnDelete.dataset.id);
        deleteProduct(btnDelete.dataset.id);
    })

    const btnUpdate = div.querySelector(".update");

    return div
}

const renderProducts = notes => {
    notes.forEach(product => listaProductos.append(productUI(product)))
}

const appendProduct = product => {
    listaProductos.append(productUI(product))
}