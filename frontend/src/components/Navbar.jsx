export default function Navbar({

  seccion,
  setSeccion,
  cantidadCarrito,

  usuario,
  irLogin,
  irRegistro,
  cerrarSesion

}) {

  return (

    <nav style={styles.navbar}>

      <div style={styles.navBrand}>
        🚀 ElectroTech
      </div>

      <div style={styles.navLinks}>

        <button
          onClick={() => setSeccion("inicio")}
          style={
            seccion === "inicio"
              ? styles.navLinkActive
              : styles.navLink
          }
        >
          🏠 Inicio
        </button>

        <button
          onClick={() => setSeccion("recomendaciones")}
          style={
            seccion === "recomendaciones"
              ? styles.navLinkActive
              : styles.navLink
          }
        >
          🤖 Recomendaciones
        </button>

        <button
          onClick={() => setSeccion("carrito")}
          style={
            seccion === "carrito"
              ? styles.navLinkActive
              : styles.navLink
          }
        >
          🛒 Carrito

          <span style={styles.cartBadge}>
            {cantidadCarrito}
          </span>

        </button>

      </div>

      <div style={styles.usuario}>

        {

          usuario ?

          <>

            <span style={styles.nombreUsuario}>
              👤 {usuario}
            </span>

            <button
              style={styles.logout}
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>

          </>

          :

          <>

            <button
              style={styles.login}
              onClick={irLogin}
            >
              Iniciar Sesión
            </button>

            <button
              style={styles.registro}
              onClick={irRegistro}
            >
              Registrarse
            </button>

          </>

        }

      </div>

    </nav>

  );

}

const styles = {

  navbar:{

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    background:"#1a252f",

    padding:"15px 40px",

    boxShadow:"0 2px 8px rgba(0,0,0,.15)",

    position:"sticky",

    top:0,

    zIndex:1000

  },

  navBrand:{

    color:"white",

    fontSize:24,

    fontWeight:"bold"

  },

  navLinks:{

    display:"flex",

    gap:"15px"

  },

  navLink:{

    background:"transparent",

    color:"#d5d8dc",

    border:"none",

    cursor:"pointer",

    padding:"10px 16px",

    borderRadius:"8px",

    fontSize:"15px"

  },

  navLinkActive:{

    background:"#34495e",

    color:"white",

    border:"none",

    cursor:"pointer",

    padding:"10px 16px",

    borderRadius:"8px",

    fontSize:"15px"

  },

  usuario:{

    display:"flex",

    gap:"12px",

    alignItems:"center"

  },

  nombreUsuario:{

    color:"white",

    fontWeight:"bold"

  },

  login:{

    background:"#2980b9",

    color:"white",

    border:"none",

    padding:"10px 18px",

    borderRadius:"8px",

    cursor:"pointer",

    fontWeight:"bold"

  },

  registro:{

    background:"#27ae60",

    color:"white",

    border:"none",

    padding:"10px 18px",

    borderRadius:"8px",

    cursor:"pointer",

    fontWeight:"bold"

  },

  logout:{

    background:"#e74c3c",

    color:"white",

    border:"none",

    padding:"10px 18px",

    borderRadius:"8px",

    cursor:"pointer",

    fontWeight:"bold"

  },

  cartBadge:{

    background:"#e74c3c",

    color:"white",

    borderRadius:"50%",

    padding:"2px 7px",

    marginLeft:"8px",

    fontSize:"12px",

    fontWeight:"bold"

  }

};