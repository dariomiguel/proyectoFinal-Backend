let socket

let user// = sessionStorage.getItem("user") || ""

if (user) {
    document.querySelector("#username").innerHTML = user + ": "
    initIO()
} else {
    Swal.fire({
        title: "Hola! 👋",
        input: "text",
        text: "Configura el nombre que usarás en este chat:",
        inputValidator: value => {
            return !value.trim() && "Por favor. Escriba un nombre de usuario"
        },
        allowOutsideClick: false
    }).then(result => {
        user = result.value
        sessionStorage.setItem("user", user)
        document.querySelector("#username").innerHTML = user + ": "
        initIO()
    })
}

const input = document.querySelector("#chatInput")
input.addEventListener("keyup", event => {
    if (event.key === "Enter") sendMessage(event.currentTarget.value)
})

document.querySelector("#send").addEventListener("click", createMessage)

async function createMessage() {
    const message = input.value;

    try {
        console.log("se mete en el try?");
        const response = await fetch("http://localhost:8080/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user, message
            }),
        });
        console.log(`Se ven los mensajes? ${user} y ${message}`);
        if (response.ok) {
            console.log("Se agregó correctacemte el mensaje desde el formulario cliente!");

        } else {
            console.error("Error agregando el producto desde formulario cliente:", response);
        }
        sendMessage(message);
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
}

function sendMessage(message) {
    if (message.trim().length > 0) {
        socket.emit("message", { user, message })
        input.value = ""
    }
}

function initIO() {
    socket = io()

    socket.on("logs", messages => {
        const box = document.querySelector("#chatBox")
        let html = ""

        messages.reverse().forEach(message => {
            html += `<p><i>${message.user}</i>: ${message.message}</p>`
        })

        box.innerHTML = html
    })
}