import type { NextConfig } from "next";

/**
 * Modo da API:
 *  - mock (default): /api/* é respondido pelas route handlers em app/api (dados de TESTE).
 *  - real: /api/* é reencaminhado para o backend em BACKEND_URL (sem CORS, sem mudar código).
 */
const mode = process.env.API_MODE ?? "mock";
const backend = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    if (mode !== "real") return [];
    return { beforeFiles: [{ source: "/api/:path*", destination: `${backend}/api/:path*` }], afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
