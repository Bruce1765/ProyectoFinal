from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import uuid

from validador_tarjeta import validar_tarjeta

app = Flask(__name__)
CORS(app)

# =========================
# ARCHIVOS
# =========================

BASE_DIR = os.path.dirname(__file__)
USUARIOS_FILE = os.path.join(BASE_DIR, "data", "usuarios.json")

os.makedirs(os.path.dirname(USUARIOS_FILE), exist_ok=True)

# =========================
# UTILIDAD USUARIOS
# =========================

def leer_usuarios():
    if not os.path.exists(USUARIOS_FILE):
        return []
    with open(USUARIOS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def guardar_usuarios(data):
    with open(USUARIOS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

# =========================
# REGISTRO
# =========================

@app.route("/api/registrar", methods=["POST"])
def registrar():
    data = request.json

    nombre = data.get("nombre")
    usuario = data.get("usuario")
    password = data.get("password")

    usuarios = leer_usuarios()

    # validar duplicado
    for u in usuarios:
        if u["usuario"] == usuario:
            return jsonify({
                "success": False,
                "message": "Usuario ya existe"
            }), 400

    usuarios.append({
        "id": str(uuid.uuid4()),
        "nombre": nombre,
        "usuario": usuario,
        "password": password
    })

    guardar_usuarios(usuarios)

    return jsonify({
        "success": True,
        "message": "Usuario registrado correctamente"
    })

# =========================
# LOGIN
# =========================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json

    usuario = data.get("usuario")
    password = data.get("password")

    usuarios = leer_usuarios()

    for u in usuarios:
        if u["usuario"] == usuario and u["password"] == password:
            return jsonify({
                "success": True,
                "usuario": u["usuario"]
            })

    return jsonify({
        "success": False,
        "message": "Credenciales incorrectas"
    }), 401

# =========================
# PAGOS (tu código)
# =========================

@app.route("/api/pago", methods=["POST"])
def procesar_pago():

    data = request.get_json()

    numero = str(data.get("numero_tarjeta", "")).replace(" ", "")
    vencimiento = str(data.get("vencimiento", ""))
    cvv = str(data.get("cvv", ""))
    titular = str(data.get("titular", ""))

    try:
        monto = float(data.get("monto", 0))
    except:
        monto = 0.0

    validacion = validar_tarjeta(numero, vencimiento, cvv, titular, monto)

    resultado = {
        "estado": "success" if validacion["valido"] else "error",
        "mensaje": validacion["mensaje"],
        "monto": monto,
        "tarjeta": validacion["tarjeta_enmascarada"],
        "autorizacion": str(uuid.uuid4())[:8]
    }

    return jsonify(resultado)

# =========================
# RUN
# =========================

if __name__ == "__main__":
    print("Servidor Python en http://localhost:6060")
    app.run(port=6060, debug=True)