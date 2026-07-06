from flask import Flask, request, jsonify
from flask_cors import CORS
from pyswip import Prolog
import os

app = Flask(__name__)
CORS(app)
prolog = Prolog()

ruta = os.path.join(os.path.dirname(__file__), "reglas.pl")
prolog.consult(ruta)

@app.route("/prolog/recomendar", methods=["POST", "OPTIONS"])
def recomendar():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.json
    max_precio = data.get("max_precio", 9999)
    max_ancho  = data.get("max_ancho", 999)
    resultados = list(prolog.query(
        f"recomendar_ideal({max_precio}, {max_ancho}, Nombre)"
    ))
    nombres = [str(r["Nombre"]) for r in resultados]
    return jsonify({"nombres": nombres})

if __name__ == "__main__":
    print("Motor Prolog corriendo en http://localhost:5050")
    app.run(host="0.0.0.0", port=5050, debug=True)