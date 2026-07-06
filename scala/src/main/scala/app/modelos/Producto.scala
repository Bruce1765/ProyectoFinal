package app.modelos
import upickle.default.{ReadWriter => RW, macroRW}

// Definición de la estructura de un producto para el sistema
case class Producto(
    id: String,
    nombre: String,
    precio: Double,
    stock: Int,
    ancho_cm: Int,
    categoria: String,
    img: String
)

object Producto {
  // Esto permite que uPickle sepa cómo leer/escribir este objeto
  implicit val rw: RW[Producto] = macroRW
}