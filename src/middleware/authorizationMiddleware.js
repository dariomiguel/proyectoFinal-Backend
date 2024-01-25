const authorize = (requiredRole) => {
    return (req, res, next) => {
        try {
            // Verificar si hay un usuario autenticado en la sesión
            if (!req.session.user) {
                return res.status(401).json({ error: "No hay usuario autenticado" });
            }
            const userRole = req.session.user.role;

            if (userRole === "admin" && requiredRole === "admin") {
                next();
            } else if (userRole === "user" && requiredRole === "user") {
                next();
            } else {
                console.log("Acceso no autorizado");
                return res.status(403).json({ error: "Acceso no autorizado" });
            }
        } catch (error) {
            console.error("Error en el middleware de autorización:", error);
            return res.status(500).json({ error: "Error en el servidor" });
        }
    };
};

export default authorize;
