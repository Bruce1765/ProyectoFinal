import "./Login.css";

function Login({ irLogin, irRegistro }) {

  return (
    <div className="login-page">

      <div className="login-brand">
        <span className="login-brand-icon">🚀</span>
        <span>ElectroTech</span>
      </div>

      <div className="login-container">

        <h1>Bienvenido</h1>

        <p className="login-subtitle">
          Sistema Inteligente de Gestión de Electrodomésticos
        </p>

        <button onClick={irLogin}>
          Iniciar Sesión
        </button>

        <button
          onClick={irRegistro}
          style={{
            marginTop: "15px",
            background: "#3498db"
          }}
        >
          Registrarse
        </button>

      </div>

      <p className="login-footer">
        © 2026 ElectroTech
      </p>

    </div>
  );
}

export default Login;