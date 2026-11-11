import { NextResponse, type NextRequest } from "next/server";
import { SensorSchema } from "@/lib/api/schemas";
import { mockDetections } from "@/lib/api/mock";
import { err } from "../_lib";

export function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const raw = p.get("bbox");
  if (!raw) return err(400, "BBOX_REQUIRED", "O parâmetro bbox é obrigatório", { param: "bbox" });
  const bbox = raw.split(",").map(Number);
  if (bbox.length !== 4 || bbox.some(Number.isNaN))
    return err(400, "BBOX_INVALID", "bbox deve ser minLon,minLat,maxLon,maxLat", { received: raw });
  const limit = p.get("limit") ? Number(p.get("limit")) : 100;
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000)
    return err(400, "LIMIT_INVALID", "limit deve estar entre 1 e 1000", { received: p.get("limit") });
  const s = p.get("sensor");
  if (s && !SensorSchema.safeParse(s).success) return err(400, "SENSOR_INVALID", "sensor deve ser MODIS ou VIIRS");
  return NextResponse.json(
    mockDetections({
      bbox: bbox as [number, number, number, number],
      startDate: p.get("startDate") ?? undefined,
      endDate: p.get("endDate") ?? undefined,
      sensor: (s as "MODIS" | "VIIRS" | null) ?? undefined,
      limit,
    }),
  );
}
