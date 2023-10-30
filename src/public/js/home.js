const socket = io();

// Escuchar eventos de actualización
socket.on("updateProductList", (newProduct) => {
    // Agregar el nuevo producto a la lista
    const productList = document.getElementById("product-list");
    const newProductItem = document.createElement("li");
    newProductItem.textContent = `Producto: ${newProduct.title}, Precio: $${newProduct.price}`;
    productList.appendChild(newProductItem);
});

socket.on("removeProduct", (deletedProductId) => {
    // Eliminar el producto de la lista
    const productList = document.getElementById("product-list");
    const productItem = productList.querySelector(`li[data-product-id="${deletedProductId}"]`);
    if (productItem) {
        productList.removeChild(productItem);
    }
});