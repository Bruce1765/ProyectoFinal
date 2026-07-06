import { useState } from 'react';

export default function Recomendaciones({ productos, agregarAlCarrito }) {
  const [presupuesto, setPresupuesto] = useState('');
  const [ancho, setAncho] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [filtrados, setFiltrados] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Extraer categorías únicas
  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];

  const manejarConsulta = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const res = await fetch("http://localhost:5050/prolog/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_precio: Number(presupuesto) || 99999,
          max_ancho: Number(ancho) || 999
        })
      });

          const data = await res.json();

    // NUEVA LÓGICA: Buscar si existe un "Match Perfecto" con el presupuesto exacto
    const presupuestoNum = Number(presupuesto);
    
    // 1. Primero filtramos todos los que cumplen las reglas de Prolog
    const posiblesResultados = productos.filter(p => 
      data.nombres.includes(p.nombre) && 
      (categoriaSeleccionada === 'Todos' || p.categoria === categoriaSeleccionada)
    );

    // 2. Buscamos si alguno coincide EXACTAMENTE con el precio ingresado
    const matchPerfecto = posiblesResultados.find(p => p.precio === presupuestoNum);

    if (matchPerfecto) {
      // SI HAY PRECIO EXACTO: Mostramos solo ese como "La mejor opción para tu dinero"
      setFiltrados([matchPerfecto]); 
    } else {
      // SI NO HAY EXACTO: Los ordenamos por el más barato primero
      const ordenados = posiblesResultados.sort((a, b) => a.precio - b.precio);
      setFiltrados(ordenados);
    }

    } catch (error) {
      console.error("Error en el asistente:", error);
      alert("Error: Asegúrate de que el servidor de Prolog (puerto 5050) esté encendido.");
    } finally {
      setCargando(false);
    }
  };

  // TU APORTE: Función para limpiar el asistente
  const limpiarAsistente = () => {
    setPresupuesto('');
    setAncho('');
    setCategoriaSeleccionada('Todos');
    setFiltrados([]);
  };


  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#1a2a3a', marginBottom: '5px' }}>Asistente de Compra Inteligente</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>
        Nuestro sistema experto evaluará tus restricciones para calcular tu electrodoméstico ideal.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
        
        {/* Formulario */}
        <form onSubmit={manejarConsulta} style={styles.card}>
          <div style={styles.formGroup}>
            <label style={styles.label}>¿Qué tipo de producto buscas?:</label>
            <select 
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              style={styles.input}
            >
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Presupuesto Máximo (S/.):</label>
            <input type="number" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} placeholder="Ej. 1500" style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Ancho Máximo (cm):</label>
            <input type="number" value={ancho} onChange={(e) => setAncho(e.target.value)} placeholder="Ej. 80" style={styles.input} />
          </div>

          <button type="submit" disabled={cargando} style={styles.btnPrimary}>
            {cargando ? 'Consultando...' : 'Consultar Asistente'}
          </button>
          
          <button type="button" onClick={limpiarAsistente} style={styles.btnSecondary}>
            Limpiar Filtros
          </button>
        </form>

        {/* Resultados */}
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>📍 Recomendación Estructurada:</h3>
          
          {filtrados.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888' }}>
              <p>No hay resultados que coincidan exactamente.</p>
              <p style={{fontSize: '12px'}}>Prueba ajustando el presupuesto o el espacio.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filtrados.map((p, index) => (
                <div key={p.id} style={{...styles.itemResult, border: index === 0 ? '2px solid #f39c12' : '1px solid #e3e8ee'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={p.img} alt={p.nombre} style={styles.thumb} />
                    <div>
                      <h4 style={{ margin: 0, color: index === 0 ? '#d35400' : '#0070f3' }}>
                        {index === 0 && '⭐ Recomendado: '} {p.nombre}
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                        S/. {p.precio} - Ancho: {p.ancho_cm}cm
                      </p>
                    </div>
                  </div>
                  <button onClick={() => agregarAlCarrito(p)} style={styles.btnAdd}>🛒</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: 'fit-content' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', fontWeight: '600', marginBottom: '8px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' },
  btnPrimary: { width: '100%', padding: '12px', backgroundColor: '#00a65a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  btnSecondary: { width: '100%', marginTop: '10px', padding: '10px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' },
  itemResult: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '8px', background: '#fcfdfe' },
  thumb: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' },
  btnAdd: { padding: '10px', backgroundColor: '#1a2a3a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};
