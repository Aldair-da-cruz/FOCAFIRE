import type { Detection } from "./api/schemas";

export const ANGOLA_BBOX: [number, number, number, number] = [11.6, -18.1, 24.1, -4.3];
export const ANGOLA_CENTER: [number, number] = [-12.2, 17.9];
export const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Grelha do projecto (docs/metodologia): 0,05°. Dois pontos na mesma célula e dia = mesmo local. */
export const GRID = 0.05;
export const cellKey = (d: Pick<Detection, "latitude" | "longitude" | "acq_date">) =>
  `${Math.floor(d.latitude / GRID)}:${Math.floor(d.longitude / GRID)}:${d.acq_date}`;

export type Match = "modis" | "both" | "viirs";
export function matchPlaces(rows: Detection[]) {
  const m = new Map<string, { det: Detection; sensors: Set<string> }>();
  for (const d of rows) {
    const k = cellKey(d);
    const e = m.get(k);
    if (e) e.sensors.add(d.sensor);
    else m.set(k, { det: d, sensors: new Set([d.sensor]) });
  }
  return [...m.values()].map(({ det, sensors }) => ({
    det,
    kind: (sensors.size === 2 ? "both" : sensors.has("MODIS") ? "modis" : "viirs") as Match,
  }));
}

/** Agrega pontos em quadrados de `size` graus (vistas afastadas). */
export function aggregate(rows: Detection[], size = 0.5) {
  const m = new Map<string, { lat: number; lon: number; n: number }>();
  for (const d of rows) {
    const la = Math.floor(d.latitude / size) * size, lo = Math.floor(d.longitude / size) * size;
    const k = `${la}:${lo}`;
    const e = m.get(k);
    if (e) e.n++;
    else m.set(k, { lat: la, lon: lo, n: 1 });
  }
  return [...m.values()];
}

export const nf = (n: number) => n.toLocaleString("pt-PT").replace(/ | /g, " ");
export const monthRange = (ym: string): [string, string] => [`${ym}-01`, `${ym}-31`];
