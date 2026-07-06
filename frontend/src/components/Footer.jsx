
export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={{ margin: '0 0 10px 0' }}>&copy; 2026 ElectroTech S.A.C. Todos los derechos reservados.</p>
      <p style={{ fontSize: '12px', color: '#95a5a6', margin: 0 }}>Diseñado bajo Arquitectura de Sistemas Multilenguaje (React + Scala + Prolog).</p>
    </footer>
  );
}

const styles = {
  footer: { backgroundColor: '#1a252f', color: '#ecf0f1', padding: '30px 50px', textAlign: 'center', marginTop: 'auto' }
};