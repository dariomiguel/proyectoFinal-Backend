const createProduct = (title, description) => {
    socket.emit("clientNewProduct", {
        title,
        description
    })
}

const deleteProduct = id => {
    console.log("data", id);
    socket.emit("clientDelete", id);
}

socket.on("serverLoadProducts", renderProducts)

socket.on("serverNewProduct", appendProduct);
