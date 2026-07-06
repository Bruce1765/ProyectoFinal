from datetime import datetime
import re


def _algoritmo_luhn(numero: str) -> bool:
    if not numero.isdigit():
        return False

    digitos = [int(d) for d in numero]
    digitos.reverse()

    total = 0
    for i, d in enumerate(digitos):
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        total += d

    return total % 10 == 0


def _detectar_marca(numero: str) -> str:
    if re.match(r"^4\d{12}(\d{3})?$", numero):
        return "Visa"
    if re.match(r"^5[1-5]\d{14}$", numero):
        return "Mastercard"
    if re.match(r"^3[47]\d{13}$", numero):
        return "American Express"
    return "Desconocida"


def _enmascarar(numero: str) -> str:
    if len(numero) < 4:
        return "****"
    return "**** **** **** " + numero[-4:]


def validar_tarjeta(
    numero: str,
    vencimiento: str,
    cvv: str,
    titular: str,
    monto: float,
) -> dict:
    enmascarada = _enmascarar(numero)

    if not titular:
        return {
            "valido": False,
            "mensaje": "El nombre del titular es obligatorio.",
            "tarjeta_enmascarada": enmascarada,
        }

    if monto <= 0:
        return {
            "valido": False,
            "mensaje": "El monto a pagar debe ser mayor que 0.",
            "tarjeta_enmascarada": enmascarada,
        }

    if not numero.isdigit() or not (13 <= len(numero) <= 19):
        return {
            "valido": False,
            "mensaje": "Numero de tarjeta invalido.",
            "tarjeta_enmascarada": enmascarada,
        }

    if not _algoritmo_luhn(numero):
        return {
            "valido": False,
            "mensaje": "Numero de tarjeta no supera la validacion (Luhn).",
            "tarjeta_enmascarada": enmascarada,
        }

    marca = _detectar_marca(numero)
    if marca == "Desconocida":
        return {
            "valido": False,
            "mensaje": "Marca de tarjeta no soportada (usa Visa, Mastercard o Amex).",
            "tarjeta_enmascarada": enmascarada,
        }

    if not re.match(r"^(0[1-9]|1[0-2])\/\d{2}$", vencimiento):
        return {
            "valido": False,
            "mensaje": "Formato de vencimiento invalido. Usa MM/AA.",
            "tarjeta_enmascarada": enmascarada,
        }

    mes, anio = vencimiento.split("/")
    expiracion = datetime(2000 + int(anio), int(mes), 1)
    ahora = datetime.now()

    if expiracion.year < ahora.year or (
        expiracion.year == ahora.year and expiracion.month < ahora.month
    ):
        return {
            "valido": False,
            "mensaje": "La tarjeta esta vencida.",
            "tarjeta_enmascarada": enmascarada,
        }

    cvv_len = 4 if marca == "American Express" else 3
    if not (cvv.isdigit() and len(cvv) == cvv_len):
        return {
            "valido": False,
            "mensaje": f"El CVV debe tener {cvv_len} digitos para {marca}.",
            "tarjeta_enmascarada": enmascarada,
        }

    return {
        "valido": True,
        "mensaje": "Pago autorizado correctamente.",
        "tarjeta_enmascarada": enmascarada,
        "marca": marca,
    }