def normalizar_confidence(valor, sensor):
    if sensor == "MODIS":
        try:
            n = float(valor)
            if n < 30:   return "low"
            if n < 80:   return "nominal"
            return "high"
        except (TypeError, ValueError):
            return "low"          

    else:  # VIIRS
        v = str(valor).lower().strip()
        
        if v in ("l", "low"): 
            return "low"
        elif v in ("n", "nominal"): 
            return "nominal"
        elif v in ("h", "high"): 
            return "high"
        else:
            return "low" 