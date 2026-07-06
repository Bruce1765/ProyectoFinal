import { useState } from 'react';

// Función para detectar la marca de la tarjeta
function detectarMarca(numeroRaw) {
  const numero = (numeroRaw || '').replace(/\s/g, '');
  if (/^4\d{0,15}$/.test(numero) && numero.length > 0) return { marca: 'Visa', color: '#1a1f71', label: 'VISA' };
  if (/^5[1-5]\d{0,14}$/.test(numero)) return { marca: 'Mastercard', color: '#eb001b', label: 'MASTERCARD' };
  if (/^3\d{0,13}$/.test(numero)) return { marca: 'American Express', color: '#2e77bc', label: 'AMEX' };
  return numero.length > 0 ? { marca: 'Desconocida', color: '#95a5a6', label: '?' } : null;
}

export default function Carrito({ carrito, eliminarDelCarrito, setCarrito }) {
  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [resultadoPago, setResultadoPago] = useState(null);
  const [comprobante, setComprobante] = useState(null);

  const [tarjeta, setTarjeta] = useState({
    numero_tarjeta: '', vencimiento: '', cvv: '', titular: ''
  });

  const actualizarCampo = (campo, valor) => setTarjeta({ ...tarjeta, [campo]: valor });
  const marcaDetectada = detectarMarca(tarjeta.numero_tarjeta);

  const procesarPago = async () => {
    setProcesando(true);
    setResultadoPago(null);
    try {
      const response = await fetch('http://localhost:6060/api/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_tarjeta: tarjeta.numero_tarjeta.replace(/\s/g, ''),
          vencimiento: tarjeta.vencimiento,
          cvv: tarjeta.cvv,
          titular: tarjeta.titular,
          monto: totalCarrito
        }),
      });

      const data = await response.json();

      if (data.estado === 'success') {
        setComprobante({
          id: data.autorizacion,
          fecha: new Date().toLocaleString(),
          productos: [...carrito],
          total: totalCarrito,
          titular: tarjeta.titular
        });
        setCarrito([]);
        setMostrarFormulario(false);
        setTarjeta({ numero_tarjeta: '', vencimiento: '', cvv: '', titular: '' });
      } else {
        setResultadoPago({ ok: false, mensaje: data.mensaje || 'Pago rechazado.' });
      }
    } catch (err) {
      setResultadoPago({ ok: false, mensaje: 'Error: Verifica que el servidor de pagos (6060) esté corriendo.' });
    } finally {
      setProcesando(false);
    }
  };

  // --- VISTA DE LA BOLETA (SÓLO PDF) ---
  // --- VISTA DE LA BOLETA (SÓLO PDF) ---
if (comprobante) {
    return (
      <>
        <style>
          {`
            /* Estilos de visualización en pantalla */
            .wrapper-boleta {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background-color: #f0f2f5;
              padding: 20px;
            }

            /* Configuración estricta de IMPRESIÓN */
            @media print {
              @page {
                size: portrait;
                margin: 0; /* Elimina márgenes físicos de página */
              }
              
              html, body {
                height: 100%;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden; /* Evita que contenido invisible cree hojas extra */
              }

              body * { visibility: hidden; } /* Oculta todo el sitio */
              
              #boleta-imprimir, #boleta-imprimir * { 
                visibility: visible; 
              }

              #boleta-imprimir { 
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%); /* Centrado matemático en la hoja */
                width: 90%;
                max-width: 450px;
                border: 2px solid #27ae60;
                padding: 30px;
                background: white;
                box-shadow: none;
                page-break-inside: avoid; /* No permite romperse entre hojas */
                page-break-after: avoid;  /* Evita crear hoja siguiente */
              }

              .btn-accion { display: none !important; } /* No sale en el PDF */
            }
          `}
        </style>

        <div className="wrapper-boleta">
          <div id="boleta-imprimir" style={{...styles.ticketCard, margin: 0, border: '1px solid #ddd'}}>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <h2 style={{color: '#27ae60', margin: 0}}>✅ COMPROBANTE ELECTRÓNICO</h2>
              <p style={{fontSize: '12px', color: '#666', margin: '5px 0'}}>ElectroTech S.A.C. | RUC: 20601234567</p>
            </div>
            
            <hr style={{border: '0', borderTop: '1px solid #eee'}} />
            
            <div style={{...styles.ticketInfo, margin: '20px 0'}}>
              <p style={{margin: '5px 0'}}><strong>Orden:</strong> {comprobante.id}</p>
              <p style={{margin: '5px 0'}}><strong>Fecha:</strong> {comprobante.fecha}</p>
              <p style={{margin: '5px 0'}}><strong>Cliente:</strong> {comprobante.titular}</p>
            </div>

            <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #27ae60'}}>
                  <th style={{padding: '10px 5px'}}>Producto</th>
                  <th style={{padding: '10px 5px'}}>Cant.</th>
                  <th style={{padding: '10px 5px', textAlign: 'right'}}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {comprobante.productos.map((p, i) => (
                  <tr key={i} style={{borderBottom: '1px solid #f1f1f1'}}>
                    <td style={{padding: '10px 5px'}}>{p.nombre}</td>
                    <td style={{padding: '10px 5px'}}>{p.cantidad}</td>
                    <td style={{padding: '10px 5px', textAlign: 'right'}}>S/. {(p.precio * p.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{marginTop: '25px', borderTop: '2px solid #27ae60', paddingTop: '15px', textAlign: 'right'}}>
              <h3 style={{margin: 0}}>TOTAL PAGADO: S/. {comprobante.total.toFixed(2)}</h3>
            </div>
            
            <div className="btn-accion" style={{marginTop: '30px', display: 'flex', gap: '10px'}}>
               <button style={{...styles.btnPay, backgroundColor: '#2980b9', flex: 1}} onClick={() => window.print()}>
                📥 Descargar PDF
              </button>
              <button style={{...styles.btnPay, backgroundColor: '#95a5a6', width: 'auto'}} onClick={() => setComprobante(null)}>
                Regresar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={styles.sectionContainer}>
      <h3 style={styles.sectionTitle}>Tu Carrito de Compras</h3>

      {carrito.length > 0 ? (
        <div style={styles.carritoLayout}>
          <div>
            {carrito.map(item => (
              <div key={item.id} style={styles.carritoItem}>
                <img src={item.img} alt={item.nombre} style={styles.resultThumb} />
                <div style={{ flex: 1 }}>
                  <h4>{item.nombre}</h4>
                  <p>S/. {item.precio.toFixed(2)} x {item.cantidad}</p>
                </div>
                <button onClick={() => eliminarDelCarrito(item.id)} style={styles.btnDelete}>Quitar</button>
              </div>
            ))}
          </div>

          <div style={styles.resumenCard}>
            <h4>Resumen de Orden</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
              <span>Total:</span>
              <span style={{ color: '#27ae60', fontWeight: 'bold' }}>S/. {totalCarrito.toFixed(2)}</span>
            </div>

            {!mostrarFormulario ? (
              <button style={styles.btnPay} onClick={() => setMostrarFormulario(true)}>Proceder al Pago</button>
            ) : (
              <div style={styles.formPago}>
                <input style={styles.input} type="text" placeholder="Titular de la tarjeta" value={tarjeta.titular} onChange={(e) => actualizarCampo('titular', e.target.value)} />
                <div style={{position: 'relative'}}>
                  <input style={styles.input} type="text" placeholder="Número de tarjeta" value={tarjeta.numero_tarjeta} onChange={(e) => actualizarCampo('numero_tarjeta', e.target.value)} />
                  {marcaDetectada && <span style={{...styles.badgeMarca, backgroundColor: marcaDetectada.color}}>{marcaDetectada.label}</span>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input style={{ ...styles.input, flex: 1 }} type="text" placeholder="MM/AA" value={tarjeta.vencimiento} onChange={(e) => actualizarCampo('vencimiento', e.target.value)} />
                  <input style={{ ...styles.input, flex: 1 }} type="text" placeholder="CVV" value={tarjeta.cvv} onChange={(e) => actualizarCampo('cvv', e.target.value)} />
                </div>
                {resultadoPago && !resultadoPago.ok && <p style={{color: 'red', fontSize: '12px'}}>{resultadoPago.mensaje}</p>}
                <button style={styles.btnPay} onClick={procesarPago} disabled={procesando}>{procesando ? 'Procesando...' : 'Pagar Ahora'}</button>
                <button style={styles.btnCancelar} onClick={() => setMostrarFormulario(false)}>Cancelar</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.emptyResults}>¡Tu carrito está vacío!</div>
      )}
    </div>
  );
}

const styles = {
  sectionContainer: { padding: '20px' },
  sectionTitle: { fontSize: '24px', marginBottom: '20px' },
  carritoLayout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
  carritoItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#fff', borderRadius: '8px', marginBottom: '10px', border: '1px solid #ddd' },
  resultThumb: { width: '50px', height: '50px', objectFit: 'cover' },
  resumenCard: { background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', height: 'fit-content' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  btnPay: { width: '100%', padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnDelete: { padding: '5px 10px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnCancelar: { width: '100%', marginTop: '10px', background: 'none', border: '1px solid #ccc', padding: '10px', cursor: 'pointer' },
  badgeMarca: { position: 'absolute', right: '10px', top: '10px', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' },
  ticketContainer: { display: 'flex', justifyContent: 'center', padding: '40px' },
  ticketCard: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', border: '2px solid #27ae60', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '450px', width: '100%' },
  ticketInfo: { textAlign: 'left', margin: '20px 0', fontSize: '14px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' },
  emptyResults: { textAlign: 'center', padding: '50px', color: '#999' }
};