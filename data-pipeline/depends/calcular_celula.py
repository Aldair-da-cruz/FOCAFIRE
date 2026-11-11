from dotenv import load_dotenv
import os 

load_dotenv()
GRID_TAMA = os.getenv("GRID_TAMA")

def calcular_celula(lat, lon):
    cell_lat = int(lat // GRID_TAMA)   
    cell_lon = int(lon // GRID_TAMA)
    return cell_lat, cell_lon