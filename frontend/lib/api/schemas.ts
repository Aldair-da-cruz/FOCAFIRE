import { z } from "zod";

/**
 * CONTRATO DA API (fonte única da verdade no frontend).
 * Se o backend mudar algo, muda-se AQUI e o TypeScript aponta tudo o que parte.
 * Documentação para o backend: docs/api-contract.md
 */

export const SensorSchema = z.enum(["MODIS", "VIIRS"]);
export type Sensor = z.infer<typeof SensorSchema>;

export const DetectionSchema = z.object({
  id: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  acq_date: z.string(), // YYYY-MM-DD
  acq_time: z.string(), // HHMM (UTC)
  sensor: SensorSchema,
  frp: z.number().nullable(), // MW; null = sem valor (diferente de 0)
  confidence: z.string().nullable(), // MODIS 0-100 ou VIIRS l/n/h
  daynight: z.enum(["D", "N"]).nullable(),
});
export type Detection = z.infer<typeof DetectionSchema>;

export const DetectionsResponseSchema = z.object({
  data: z.array(DetectionSchema),
  count: z.number().int(),
  truncated: z.boolean(), // true se bateu no limit
});
export type DetectionsResponse = z.infer<typeof DetectionsResponseSchema>;

export const MetaSchema = z.object({
  periodo: z.object({ inicio: z.string(), fim: z.string() }),
  produtos: z.array(z.string()),
  last_import: z.string().nullable(),
  is_sample: z.boolean(), // true => banner TESTE; false => REAL
});
export type Meta = z.infer<typeof MetaSchema>;

export const HealthSchema = z.object({ status: z.literal("ok") });

export const ApiErrorBodySchema = z.object({
  error: z.string(),
  code: z.string(),
  details: z.unknown().optional(),
});

/** Parâmetros de /api/detections. bbox é OBRIGATÓRIO; limit 1..1000 (default 100). */
export const DetectionsQuerySchema = z.object({
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]), // minLon,minLat,maxLon,maxLat
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sensor: SensorSchema.optional(),
  limit: z.number().int().min(1).max(1000).optional(),
});
export type DetectionsQuery = z.infer<typeof DetectionsQuerySchema>;

/** PROPOSTA ao backend: GET /api/stats/timeseries?bbox&sensor&year&granularity=month */
export const TimeseriesSchema = z.object({
  granularity: z.enum(["month", "day"]),
  data: z.array(
    z.object({
      period: z.string(), // YYYY-MM ou YYYY-MM-DD
      modis: z.number().int().nullable(), // null = sem dados; 0 = zero detecções
      viirs: z.number().int().nullable(),
    }),
  ),
});
export type Timeseries = z.infer<typeof TimeseriesSchema>;
