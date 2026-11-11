from depends.pipeline import normalizar
import streamlit as st


carregar_ficheiro = st.file_uploader('Coloca qualquer arquivo de MODIS ou VIIRS',type=['csv'])
dados, relatorio = normalizar(carregar_ficheiro)
df = st.dataframe(dados)

st.text('Relatorios')

rel = st.dataframe(relatorio)
