import type { Detection, Meta, Sensor, Timeseries } from "./schemas";

/** Dados de TESTE determinísticos (Angola). Só usados quando API_MODE=mock. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const gauss = (r: () => number) => (r() + r() + r() + r() - 2) / 2;

const SEASON = [99, 80, 99, 199, 557, 1154, 1790, 2287, 1989, 1094, 298, 139];
const SEASON_SUM = SEASON.reduce((a, b) => a + b, 0);
const pad = (n: number) => String(n).padStart(2, "0");

const ALL: Detection[] = (() => {
  const r = rng(2024);
  const centers = Array.from({ length: 40 }, () => ({ lat: -16.5 + r() * 10, lon: 13 + r() * 10 }));
  const out: Detection[] = [];
  const EVENTS = 3000;
  for (let i = 0; i < EVENTS; i++) {
    let x = r() * SEASON_SUM, month = 0;
    while (x > SEASON[month]) { x -= SEASON[month]; month++; }
    const c = centers[Math.floor(r() * centers.length)];
    const lat = c.lat + gauss(r) * 1.6, lon = c.lon + gauss(r) * 1.6;
    const date = `2024-${pad(month + 1)}-${pad(1 + Math.floor(r() * 28))}`;
    const time = pad(Math.floor(r() * 24)) + "00";
    const k = r();
    const sensors: Sensor[] = k < 0.35 ? ["MODIS", "VIIRS"] : k < 0.9 ? ["VIIRS"] : ["MODIS"];
    for (const sensor of sensors) {
      out.push({
        id: `mock-${i}-${sensor[0]}`,
        latitude: lat + (sensors.length === 2 ? (r() - 0.5) * 0.02 : 0),
        longitude: lon + (sensors.length === 2 ? (r() - 0.5) * 0.02 : 0),
        acq_date: date, acq_time: time, sensor,
        frp: r() < 0.05 ? null : r() < 0.03 ? 0 : Math.round(r() * 80 * 10) / 10,
        confidence: sensor === "MODIS" ? String(30 + Math.floor(r() * 70)) : ["l", "n", "h"][Math.floor(r() * 3)],
        daynight: r() < 0.7 ? "D" : "N",
      });
    }
  }
  return out;
})();

export const mockMeta: Meta = {
  periodo: { inicio: "2024-01-01", fim: "2024-12-31" },
  produtos: ["MODIS_SP", "VIIRS_SNPP_SP"],
  last_import: null,
  is_sample: true,
};

export function mockDetections(o: {
  bbox: [number, number, number, number];
  startDate?: string;
  endDate?: string;
  sensor?: Sensor;
  limit: number;
}) {
  const [minLon, minLat, maxLon, maxLat] = o.bbox;
  const rows = ALL.filter(
    (d) =>
      d.longitude >= minLon && d.longitude <= maxLon && d.latitude >= minLat && d.latitude <= maxLat &&
      (!o.sensor || d.sensor === o.sensor) &&
      (!o.startDate || d.acq_date >= o.startDate) &&
      (!o.endDate || d.acq_date <= o.endDate),
  );
  return { data: rows.slice(0, o.limit), count: Math.min(rows.length, o.limit), truncated: rows.length > o.limit };
}

export function mockTimeseries(year: number, sensor?: Sensor): Timeseries {
  const data = Array.from({ length: 12 }, (_, m) => {
    const p = `${year}-${pad(m + 1)}`;
    const rows = year === 2024 ? ALL.filter((d) => d.acq_date.startsWith(p)) : [];
    const has = year === 2024;
    return {
      period: p,
      modis: has && sensor !== "VIIRS" ? rows.filter((d) => d.sensor === "MODIS").length : has ? null : null,
      viirs: has && sensor !== "MODIS" ? rows.filter((d) => d.sensor === "VIIRS").length : null,
    };
  });
  return { granularity: "month", data };
}
