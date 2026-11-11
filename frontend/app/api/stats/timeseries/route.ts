import { NextResponse, type NextRequest } from "next/server";
import { mockTimeseries } from "@/lib/api/mock";
import { SensorSchema } from "@/lib/api/schemas";
import { err } from "../../_lib";

export function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const year = Number(p.get("year") ?? 2024);
  if (!Number.isInteger(year)) return err(400, "YEAR_INVALID", "year inválido");
  const s = p.get("sensor");
  const sensor = s ? SensorSchema.safeParse(s) : null;
  if (sensor && !sensor.success) return err(400, "SENSOR_INVALID", "sensor deve ser MODIS ou VIIRS");
  return NextResponse.json(mockTimeseries(year, sensor?.success ? sensor.data : undefined));
}
