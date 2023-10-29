const socket = io();

document.querySelector("#sendMensaje").onclick = () => {
    const value = document.querySelector("#mensaje").value;

    socket.emit("message", value);
}