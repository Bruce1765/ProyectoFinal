import { useState } from 'react';

export default function Inicio({ productos, agregarAlCarrito }) {
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  const productosFiltrados = filtroCategoria === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === filtroCategoria);
  const ofertas = productos.slice(0, 4);
  console.log(productos[0]);

  return (
    <>
      {/* Sección Hero */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Bienvenidos a ElectroTech</h2>
        <p style={styles.heroSubtitle}>Donde encontrarás los mejores electrodomésticos de última generación para optimizar y modernizar tu hogar.</p>
      </div>

      {/* OFERTAS */}

      <div style={styles.ofertasContainer}>

        <h2 style={styles.ofertasTitulo}>
            🏷️ Ofertas Especiales
        </h2>

        <div style={styles.ofertasGrid}>

          {ofertas.map((p) => {

            const precioAnterior = p.precio * 1.20;

            return (

              <div
                key={p.id}
                style={styles.ofertaCard}
              >

                <span style={styles.badgeOferta}>
                  -20%
                </span>

                <img
                  src={p.img}
                  alt={p.nombre}
                  style={styles.ofertaImg}
                />

                <h4>{p.nombre}</h4>

                <p
                  style={{
                    textDecoration: "line-through",
                    color: "#7f8c8d",
                    margin: 0
                  }}
                >
                  S/. {precioAnterior.toFixed(2)}
                </p>

                <h3
                  style={{
                    color: "#e74c3c",
                    marginTop: "8px"
                  }}
                >
                  S/. {p.precio.toFixed(2)}
                </h3>

                <button
                  style={styles.btnOferta}
                  onClick={() => agregarAlCarrito(p)}
                >
                  Comprar Oferta
                </button>

              </div>

            );

          })}

        </div>

      </div>

      {/* Sección Catálogo */}
      <div style={styles.sectionContainer}>
        <div style={styles.catalogoHeader}>
          <h3 style={styles.sectionTitle}>Nuestro Catálogo de Productos</h3>
          <div style={styles.filterContainer}>
            {['Todos', 'Licuadoras', 'Refrigeradoras', 'Microondas', 'Ollas arroceras', 'Cocinas', 'Batidoras', 'Wafleras', 'Lavadoras'].map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                style={filtroCategoria === cat ? styles.btnFilterActive : styles.btnFilter}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Galería Grid de Imágenes */}
        <div style={styles.grid}>
          {productosFiltrados.map(p => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardImageContainer}>
                <img src={p.img} alt={p.nombre} style={styles.cardImage} />
                <span style={styles.badgeId}>{p.id}</span>
              </div>
              <div style={styles.cardBody}>
                <h4 style={styles.cardTitle}>{p.nombre}</h4>
                <div style={styles.cardSpecs}>
                  <span>Dimensiones: <strong>{p.ancho_cm} cm</strong></span>
                  <span>Stock: <strong>{p.stock} u.</strong></span>
                </div>
                <div style={styles.cardFooter}>
                  <span style={styles.cardPrecio}>S/. {p.precio.toFixed(2)}</span>
                  <button onClick={() => agregarAlCarrito(p)} style={styles.btnAction}>Agregar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', color: 'white', padding: '50px', borderRadius: '12px', marginBottom: '40px', textAlign: 'center' },
  heroTitle: { fontSize: '36px', margin: '0 0 15px 0', fontWeight: '700' },
  heroSubtitle: { fontSize: '18px', margin: 0, opacity: 0.9, maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' },
  sectionContainer: { marginBottom: '40px' },
  sectionTitle: { fontSize: '24px', color: '#2c3e50', margin: '0' },
  catalogoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' },
  filterContainer: { display: 'flex', gap: '10px' },
  btnFilter: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#64748b', cursor: 'pointer' },
  btnFilterActive: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #3498db', backgroundColor: '#3498db', color: '#ffffff', cursor: 'pointer', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  cardImageContainer: { position: 'relative', height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  cardImage: { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', },
  badgeId: { position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(26, 37, 47, 0.85)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  cardBody: { padding: '20px' },
  cardTitle: { fontSize: '18px', color: '#2c3e50', margin: '0 0 10px 0' },
  cardSpecs: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '20px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardPrecio: { fontSize: '20px', fontWeight: '700', color: '#27ae60' },
  btnAction: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  ofertasContainer: {marginBottom: "50px"},
  ofertasTitulo: {fontSize: "30px", color: "#e74c3c", marginBottom: "25px", fontWeight: "700"},
  ofertasGrid: {display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "25px"},
  ofertaCard: { background: "#fff", borderRadius: "15px", padding: "20px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,.08)", position: "relative", transition: "0.3s"},
  badgeOferta: { position: "absolute", top: "15px", right: "15px", background: "#e74c3c", color: "white", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold"},
  ofertaImg: { width: "180px", height: "180px", objectFit: "contain", marginBottom: "15px"},
  btnOferta: { marginTop: "15px", width: "100%", background: "#27ae60", color: "white", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"},
};

