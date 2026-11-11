# FOCAFIRE — Frontend (Next.js 16 + TypeScript)

```bash
yarn install
cp .env.example .env.local     # API_MODE=mock (default) | real
yarn dev                       # http://localhost:3000
yarn typecheck && yarn lint && yarn test && yarn build
```

## Ligar ao backend
`API_MODE=real` + `BACKEND_URL=http://localhost:8000` → o Next faz proxy de `/api/*` (sem CORS).
O contrato está em `../docs/api-contract.md` e em `lib/api/schemas.ts` (Zod). Respostas fora do contrato dão erro `CONTRACT`.

## Estrutura
- `lib/api/` contrato (schemas), cliente, hooks e mocks de TESTE
- `app/api/` route handlers mock (só usados com `API_MODE=mock`)
- `components/screens/` Home, Detalhe, Comparar, Como ler
- `components/ui/` componentes de vidro (`GlassPanel`, `FireButton`, `Segmented`…)
- Filtros (sensor, mês, vista) vivem no URL → qualquer vista é partilhável

## Regras do projecto
"detecções" (nunca contar "incêndios") · banner TESTE/REAL sempre visível (`is_sample`) · só `/api/*` · sempre `bbox` + `limit ≤ 1000` · `0` ≠ `null`.
