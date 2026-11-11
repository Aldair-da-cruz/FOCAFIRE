import pandas as pd


from .calcular_celula import calcular_celula
from .normalizar_confidence import normalizar_confidence
from .validar_linha import validar_linha

def normalizar(caminho_csv, sensor):
    df = pd.read_csv(caminho_csv)

    relatorio = {
        "total_lidas": len(df),
        "validas": 0,
        "rejeitadas": 0,
        "motivos_rejeicao": {},
    }

    linhas_validas = []

    for _, row in df.iterrows():
        erros = validar_linha(row)

        if erros:
            relatorio["rejeitadas"] += 1
            for e in erros:
                relatorio["motivos_rejeicao"][e] = (
                    relatorio["motivos_rejeicao"].get(e, 0) + 1
                )
            continue                       

        # --- linha válida: enriquece com campos novos ---
        lat = float(row["latitude"])
        lon = float(row["longitude"])
        cell_lat, cell_lon = calcular_celula(lat, lon)

        linha_nova = {
            "latitude": lat,
            "longitude": lon,
            "acq_date": str(row["acq_date"]),
            "sensor": row["instrument"],
            "confidence_normalizada": normalizar_confidence(row.get("confidence"), row.get("instrument")),
            "cell_lat": cell_lat,
            "cell_lon": cell_lon,
            "raw_properties": row.to_dict(),  
        }
        linhas_validas.append(linha_nova)

    relatorio["validas"] = len(linhas_validas)
    return pd.DataFrame(linhas_validas), relatorio