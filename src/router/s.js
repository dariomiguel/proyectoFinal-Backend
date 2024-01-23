// Middleware de autorización
const authorize = (role) => {
    return (req, res, next) => {
        // Verificar si el usuario tiene el rol necesario
        if (req.session && req.session.user && req.session.user.role === role) {
            // Si tiene el rol, permite el acceso
            next();
        } else {
            // Si no tiene el rol, devuelve un error de acceso no autorizado
            res.status(403).json({ error: "Acceso no autorizado" });
        }
    };
};

// Middleware para restringir a administradores
const isAdmin = authorize("admin");

// Middleware para restringir a usuarios
const isUser = authorize("user");

// Ejemplo de uso en rutas
app.post("/productos", isAdmin, (req, res) => {
    // Solo el administrador puede crear productos
    // Tu lógica para crear productos va aquí
    res.status(201).json({ message: "Producto creado correctamente" });
});

app.put("/productos/:id", isAdmin, (req, res) => {
    // Solo el administrador puede actualizar productos
    // Tu lógica para actualizar productos va aquí
    res.status(200).json({ message: "Producto actualizado correctamente" });
});

app.delete("/productos/:id", isAdmin, (req, res) => {
    // Solo el administrador puede eliminar productos
    // Tu lógica para eliminar productos va aquí
    res.status(200).json({ message: "Producto eliminado correctamente" });
});

app.post("/chat", isUser, (req, res) => {
    // Solo el usuario puede enviar mensajes al chat
    // Tu lógica para enviar mensajes al chat va aquí
    res.status(201).json({ message: "Mensaje enviado correctamente" });
});

app.post("/carrito", isUser, (req, res) => {
    // Solo el usuario puede agregar productos a su carrito
    // Tu lógica para agregar productos al carrito va aquí
    res.status(201).json({ message: "Producto agregado al carrito correctamente" });
});
