package app.services

import app.modelos.Usuario

object LoginService {

  private val usuarios = List(
    Usuario("admin", "123456"),
    Usuario("jordan", "abc123"),
    Usuario("bruce", "985680"),
    Usuario("cliente", "1234")
  )

  def autenticar(usuario: String, password: String): Boolean = {
    usuarios.exists(u =>
      u.usuario == usuario &&
      u.password == password
    )
  }
}
