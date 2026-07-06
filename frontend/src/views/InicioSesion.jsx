import { useState } from "react";
import "./Login.css";

function InicioSesion({ onLogin, volver }) {

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const iniciarSesion = async () => {

        if (!usuario || !password) {
            setError("Complete todos los campos");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuario,
                        password
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                localStorage.setItem("usuario", data.usuario);

                onLogin(data.usuario);

            } else {

                setError(data.message);

            }

        } catch {

            setError("No se pudo conectar con Scala");

        }

    };

    return (

        <div className="login-page">

            <div className="login-container">

                <h2>Iniciar Sesión</h2>

                <input
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={iniciarSesion}>
                    Entrar
                </button>

                <button
                    onClick={volver}
                    style={{
                        marginTop:10,
                        background:"#7f8c8d"
                    }}
                >
                    Volver
                </button>

                <p style={{color:"red"}}>
                    {error}
                </p>

            </div>

        </div>

    );

}

export default InicioSesion;