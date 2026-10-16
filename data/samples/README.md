# Amostras de dados

Pasta para ficheiros pequenos de demonstração (máx 500 linhas por sensor).

## Ficheiros esperados (M2)
- `modis_sample.csv`
- `viirs_sample.csv`
- `detections_mock.json` (20 registos para desbloquear M3/M4)

## Regras
- Não commitar ficheiros grandes (>1MB).
- Todo ficheiro real deve indicar: fonte, produto, versão, satélite, período, bbox, data de acesso.
- Todo ficheiro sintético deve ter prefixo `mock_` ou `synthetic_` e `is_sample: true`.
- Ficheiros grandes ou sujeitos a restrição: manter local, não subir ao Git.

## Metadados a registar por ficheiro
| Ficheiro | Fonte | Produto/Versão | Período | BBox | Data acesso | Real/Sintético |
|---|---|---|---|---|---|---|
| exemplo.csv | FIRMS | a confirmar | a confirmar | Angola | a confirmar | a confirmar |
