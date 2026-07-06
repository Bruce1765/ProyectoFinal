import { useState } from "react";
import "./Login.css";

function Registro({ volver }) {

    const [nombre, setNombre] = useState("");
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const registrar = async () => {

        if (!nombre.trim() || !usuario.trim() || !password.trim()) {

            setTipoMensaje("error");
            setMensaje("Completa todos los campos.");
            return;

        }

        if (password.length < 4) {

            setTipoMensaje("error");
            setMensaje("La contraseña debe tener al menos 4 caracteres.");
            return;

        }

        setCargando(true);
        setMensaje("");

        try {

            const response = await fetch(
                "http://localhost:6060/api/registrar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre,
                        usuario,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                setTipoMensaje("success");
                setMensaje("✅ " + data.message);

                setNombre("");
                setUsuario("");
                setPassword("");

                setTimeout(() => {
                    volver();
                }, 1500);

            } else {

                setTipoMensaje("error");
                setMensaje("❌ " + data.message);

            }

        } catch (error) {

            console.error(error);

            setTipoMensaje("error");
            setMensaje("Servidor Python no disponible.");

        } finally {

            setCargando(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-container">

                <h2>Crear Cuenta</h2>

                <p className="login-subtitle">
                    Registra una nueva cuenta para acceder al sistema.
                </p>

                <input
                    type="text"
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={registrar}
                    disabled={cargando}
                >
                    {cargando ? "Registrando..." : "Crear Cuenta"}
                </button>

                <button
                    onClick={volver}
                    style={{
                        marginTop: "10px",
                        backgroundColor: "#7f8c8d"
                    }}
                >
                    Volver al Inicio de Sesión
                </button>

                {mensaje && (

                    <p
                        style={{
                            marginTop: "15px",
                            color: tipoMensaje === "success"
                                ? "green"
                                : "red",
                            fontWeight: "bold",
                            textAlign: "center"
                        }}
                    >
                        {mensaje}
                    </p>

                )}

            </div>

        </div>

    );

}

export default Registro;