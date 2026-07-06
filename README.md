# 🚀 Sistema de Gestión de Electrodomésticos

Proyecto de arquitectura distribuida que conecta un catálogo web interactivo en **React** con un servidor backend de alta concurrencia en **Scala** utilizando el framework **Cask**.

---

## 🛠️ Requisitos Previos

Para ejecutar este proyecto, asegúrate de tener instalados los siguientes componentes:

- **Node.js** (versión 18 o superior).
- **Java JDK** (versión 17 o 21). 
- **SBT (Scala Build Tool)**.

---

## 💻 Instrucciones para Levantar el Proyecto

Para que el sistema funcione correctamente, se deben abrir **dos terminales independientes**:

### 1. Levantar el Backend (Scala)
Abre una terminal, navega a la carpeta del servidor y arráncalo:
\`\`\`bash
cd scala
sbt run
\`\`\`
> 💡 *El servidor se mantendrá escuchando peticiones en http://localhost:8080. Mantén esta terminal abierta.*

### 2. Levantar el Frontend (React)
Abre una segunda terminal, navega a la carpeta de la interfaz web y arranca el entorno de desarrollo:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
> 🌐 *Accede a tu navegador en http://localhost:5173 para visualizar e interactuar con el catálogo.*

---

## 📡 Endpoints del Servidor (API REST)

El backend expone los siguientes servicios en http://localhost:8080:

- **GET /api/productos**: Retorna la lista completa de electrodomésticos en formato JSON.
- **POST /api/vender**: Procesa la venta de un producto (requiere el id en el cuerpo de la petición).

---

## 📁 Estructura del Proyecto

- **/frontend**: Interfaz de usuario desarrollada en React.
- **/scala**: Lógica del servidor backend y servicios de inventario.
- **/data**: Carpeta de persistencia para reportes.
- **/prolog**: Base de conocimientos y reglas lógicas.
EOF