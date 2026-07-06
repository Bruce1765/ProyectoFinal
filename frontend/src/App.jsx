import './App.css';
import { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Inicio from './views/Inicio';
import Recomendaciones from './views/Recomendaciones';
import Carrito from './views/Carrito';

import Login from './views/Login';
import InicioSesion from './views/InicioSesion';
import Registro from './views/Registro';

function App() {

  // ==========================
  // LOGIN
  // ==========================

  const [usuario, setUsuario] = useState(
    localStorage.getItem("usuario")
  );

  // inicio | login | registro
  const [pantalla, setPantalla] = useState("tienda");

  // ==========================
  // SISTEMA
  // ==========================

  const [seccion, setSeccion] = useState("inicio");

  const [carrito, setCarrito] = useState([]);

  const [productos, setProductos] = useState([]);

  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {

    fetch("http://localhost:8080/api/productos")

      .then((response) => {

        if (!response.ok) {

          throw new Error(
            "No se pudo conectar con Scala"
          );

        }

        return response.json();

      })

      .then((data) => {

        setProductos(data);

      })

      .catch((err) => {

        console.error(err);

        setErrorCarga(
          "No se pudo conectar con el servidor Scala."
        );

      });

  }, []);

  // ==========================
  // CARRITO
  // ==========================

  const agregarAlCarrito = (producto) => {

    fetch("http://localhost:8080/api/vender", {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({

        id: producto.id

      })

    })

      .then(async (response) => {

        const texto = await response.text();

        return JSON.parse(texto);

      })

      .then((data) => {

        if (data.status === "success") {

          const existe = carrito.find(

            item => item.id === producto.id

          );

          if (existe) {

            setCarrito(

              carrito.map(item =>

                item.id === producto.id

                  ? {

                    ...item,

                    cantidad: item.cantidad + 1

                  }

                  : item

              )

            );

          }

          else {

            setCarrito([

              ...carrito,

              {

                ...producto,

                cantidad: 1

              }

            ]);

          }

          alert(data.message);

        }

        else {

          alert(data.message);

        }

      })

      .catch(() => {

        alert(

          "No se pudo realizar la venta."

        );

      });

  };

  const eliminarDelCarrito = (id) => {

    setCarrito(

      carrito.filter(

        item => item.id !== id

      )

    );

  };

  const cantidadTotalProductos = carrito.reduce(

    (a, b) => a + b.cantidad,

    0

  );

  // ======================================================
  // PANTALLAS ANTES DEL LOGIN
  // ======================================================

  if (pantalla === "login") {

    return (

      <InicioSesion

        onLogin={(usuarioLogeado) => {

          localStorage.setItem(
            "usuario",
            usuarioLogeado
          );

          setUsuario(usuarioLogeado);

          setPantalla("tienda");

        }}

        volver={() =>
          setPantalla("tienda")
        }

      />

    );

  }

  if (pantalla === "registro") {

    return (

      <Registro

        volver={() =>
          setPantalla("tienda")
        }

      />

    );

  }

  // ======================================================
  // SISTEMA PRINCIPAL
  // ======================================================

  return (

    <div

      style={{

        fontFamily: "'Segoe UI', sans-serif",

        backgroundColor: "#f4f6f9",

        minHeight: "100vh",

        display: "flex",

        flexDirection: "column"

      }}

    >

      <Navbar

        seccion={seccion}

        setSeccion={setSeccion}

        cantidadCarrito={cantidadTotalProductos}

        usuario={usuario}

        irLogin={() =>
          setPantalla("login")
        }

        irRegistro={() =>
          setPantalla("registro")
        }

        cerrarSesion={() => {

          localStorage.removeItem(
            "usuario"
          );

          setUsuario(null);

        }}

      />

      <main

        style={{

          flex: 1,

          padding: "40px 50px"

        }}

      >

        {errorCarga && (

          <div

            style={{

              background: "#ffdddd",

              padding: "15px",

              marginBottom: "20px",

              borderRadius: "8px",

              color: "#b00020"

            }}

          >

            {errorCarga}

          </div>

        )}

        {

          seccion === "inicio"

          &&

          <Inicio

            productos={productos}

            agregarAlCarrito={agregarAlCarrito}

          />

        }

        {

          seccion === "recomendaciones"

          &&

          <Recomendaciones

            productos={productos}

            agregarAlCarrito={agregarAlCarrito}

          />

        }

        {

          seccion === "carrito"

          &&

          <Carrito

            carrito={carrito}

            eliminarDelCarrito={eliminarDelCarrito}

            setCarrito={setCarrito}

          />

        }

      </main>

      <Footer />

    </div>

  );

}

export default App;