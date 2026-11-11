import type { z } from "zod";
import {
  ApiErrorBodySchema,
  DetectionsQuerySchema,
  DetectionsResponseSchema,
  HealthSchema,
  MetaSchema,
  TimeseriesSchema,
  type DetectionsQuery,
} from "./schemas";

/** Sempre /api/*: em modo mock responde o próprio Next; em modo real o Next faz proxy ao backend. */
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

async function request<T extends z.ZodTypeAny>(path: string, schema: T): Promise<z.infer<T>> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { headers: { Accept: "application/json" } });
  } catch {
    throw new ApiError(0, "NETWORK", "Sem ligação ao servidor");
  }
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const body = ApiErrorBodySchema.safeParse(json);
    throw body.success
      ? new ApiError(res.status, body.data.code, body.data.error, body.data.details)
      : new ApiError(res.status, "UNKNOWN", `Erro ${res.status}`);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // Backend devolveu algo fora do contrato: falha cedo e com detalhe.
    throw new ApiError(502, "CONTRACT", "Resposta fora do contrato", parsed.error.issues);
  }
  return parsed.data;
}

export const api = {
  health: () => request("/api/health", HealthSchema),
  meta: () => request("/api/meta", MetaSchema),
  timeseries: (year: number, sensor?: string) =>
    request(`/api/stats/timeseries?year=${year}&granularity=month${sensor ? `&sensor=${sensor}` : ""}`, TimeseriesSchema),
  detections: (q: DetectionsQuery) => {
    const v = DetectionsQuerySchema.parse(q);
    const p = new URLSearchParams({ bbox: v.bbox.join(",") });
    if (v.startDate) p.set("startDate", v.startDate);
    if (v.endDate) p.set("endDate", v.endDate);
    if (v.sensor) p.set("sensor", v.sensor);
    if (v.limit) p.set("limit", String(v.limit));
    return request(`/api/detections?${p}`, DetectionsResponseSchema);
  },
};
