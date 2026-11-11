from dotenv import load_dotenv
import os
import datetime

load_dotenv()
LAT_MIN = float(os.getenv("LAT_MIN"))
LAT_MAX = float(os.getenv("LAT_MAX"))
LON_MIN = float(os.getenv("LON_MIN"))
LON_MAX = float(os.getenv("LON_MAX"))


def validar_linha(row):
    erros = []

    #  Validar Latitude 
    try:
        lat = float(row["latitude"])
        if not (LAT_MIN <= lat <= LAT_MAX):
            erros.append("latitude_fora_limites")
    except (KeyError, TypeError, ValueError):
        erros.append("latitude_ausente_ou_invalida")

    # Validar Longitude 
    try:
        lon = float(row["longitude"])
        if not (LON_MIN <= lon <= LON_MAX):
            erros.append("longitude_fora_limites")
    except (KeyError, TypeError, ValueError):
        erros.append("longitude_ausente_ou_invalida")

    # Validar Data 
    try:
        datetime.datetime.strptime(str(row["acq_date"]), "%Y-%m-%d")
    except (KeyError, ValueError):
        erros.append("data_invalida")

    return erros