const socket = io();

document.querySelector("#sendMensaje").onclick = () => {
    const value = document.querySelector("#mensaje").value;

    socket.emit("message", value);
}

socket.on("mensaje_al_resto", (data) => {
    console.log(data);
})