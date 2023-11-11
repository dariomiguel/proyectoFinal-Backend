

const createProduct = (title, description) => {
    socket.emit("clientNewProduct", {
        title,
        description
    })
}

socket.on("serverNewProduct", appendProduct);

socket.on("serverLoadProducts,", notes => {
    console.log("Hola");
    console.log(notes);
})