from pathlib import Path

import pandas as pd
import streamlit as st


csv_path = Path(__file__).resolve().parent / "dados" / "fire_archive_M-C61_842915.csv"
df = pd.read_csv(csv_path)
st.dataframe(df)