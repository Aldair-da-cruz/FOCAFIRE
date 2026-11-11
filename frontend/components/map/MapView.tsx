"use client";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { CircleMarker, MapContainer, Marker, Rectangle, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Detection } from "@/lib/api/schemas";
import { ANGOLA_CENTER, aggregate } from "@/lib/geo";
import { Minus, Plus } from "@/components/ui/icons";

const TILES = process.env.NEXT_PUBLIC_TILE_URL ?? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
const ATTR = '&copy; OpenStreetMap &copy; <a href="https://carto.com/attributions">CARTO</a>';
const HEAT = ["#6B3320", "#A4411F", "#E0561F", "#FF8A2A", "#FFD166"];
export const heatColor = (n: number) => HEAT[n <= 3 ? 0 : n <= 7 ? 1 : n <= 13 ? 2 : n <= 20 ? 3 : 4];
const diamond = L.divIcon({ className: "", html: '<div class="diamond"></div>', iconSize: [12, 12], iconAnchor: [6, 6] });

export type ViewState = { bbox: [number, number, number, number]; zoom: number; center: [number, number] };

function ViewWatcher({ onView }: { onView: (v: ViewState) => void }) {
  const map = useMap();
  const emit = () => {
    const b = map.getBounds();
    const c = map.getCenter();
    onView({ bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], zoom: map.getZoom(), center: [c.lat, c.lng] });
  };
  useMapEvents({ moveend: emit, zoomend: emit });
  useEffect(emit, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** Faz este mapa seguir outro (usado no comparador). */
function Follow({ to }: { to: { center: [number, number]; zoom: number } }) {
  const map = useMap();
  useEffect(() => {
    const c = map.getCenter();
    if (Math.abs(c.lat - to.center[0]) > 1e-6 || Math.abs(c.lng - to.center[1]) > 1e-6 || map.getZoom() !== to.zoom)
      map.setView(to.center, to.zoom, { animate: false });
  }, [map, to.center, to.zoom]);
  return null;
}

function Zoom({ labelIn, labelOut }: { labelIn: string; labelOut: string }) {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) L.DomEvent.disableClickPropagation(ref.current); }, []);
  return (
    <div ref={ref} className="glass absolute bottom-6 right-6 z-[1000] hidden flex-col overflow-hidden rounded-full md:flex">
      <button aria-label={labelIn} onClick={() => map.zoomIn()} className="focus-ring flex h-[52px] w-[52px] items-center justify-center"><Plus /></button>
      <div className="h-px bg-white/20" />
      <button aria-label={labelOut} onClick={() => map.zoomOut()} className="focus-ring flex h-[52px] w-[52px] items-center justify-center"><Minus /></button>
    </div>
  );
}

export type MapViewProps = {
  detections: Detection[];
  mode: "squares" | "points";
  sensor: "all" | "MODIS" | "VIIRS";
  selectedId?: string;
  onView: (v: ViewState) => void;
  onSelect?: (d: Detection) => void;
  center?: [number, number];
  zoom?: number;
  /** false = sem mapa-base (camada transparente por cima de outro mapa) */
  tiles?: boolean;
  /** false = não recebe rato/toque (segue outro mapa) */
  interactive?: boolean;
  follow?: { center: [number, number]; zoom: number };
  /** anéis tracejados (locais vistos pelos dois satélites) */
  rings?: [number, number][];
  zoomControls?: boolean;
};

export default function MapView({ detections, mode, sensor, selectedId, onView, onSelect, center = ANGOLA_CENTER, zoom = 6, tiles = true, interactive = true, follow, rings, zoomControls = true }: MapViewProps) {
  const rows = useMemo(() => detections.filter((d) => sensor === "all" || d.sensor === sensor), [detections, sensor]);
  const cells = useMemo(() => (mode === "squares" ? aggregate(rows, 0.5) : []), [rows, mode]);
  return (
    <MapContainer center={center} zoom={zoom} minZoom={4} maxZoom={12} zoomControl={false} className={`h-full w-full ${tiles ? "" : "!bg-transparent"} ${interactive ? "" : "pointer-events-none"}`} attributionControl={tiles}>
      {tiles && <TileLayer url={TILES} attribution={ATTR} />}
      {follow && <Follow to={follow} />}
      {rings?.map((r, i) => (
        <CircleMarker key={i} center={r} radius={13} pathOptions={{ color: "#fff", weight: 1.5, dashArray: "3 4", fillOpacity: 0 }} interactive={false} />
      ))}
      <ViewWatcher onView={onView} />
      {mode === "squares" &&
        cells.map((c) => (
          <Rectangle key={`${c.lat}:${c.lon}`} bounds={[[c.lat, c.lon], [c.lat + 0.5, c.lon + 0.5]]}
            pathOptions={{ color: heatColor(c.n), fillColor: heatColor(c.n), fillOpacity: 0.78, weight: 1, opacity: 0.9 }} />
        ))}
      {mode === "points" &&
        rows.map((d) =>
          d.sensor === "MODIS" ? (
            <CircleMarker key={d.id} center={[d.latitude, d.longitude]} radius={selectedId === d.id ? 10 : 7}
              pathOptions={{ color: "#FFC247", weight: 3, fillOpacity: 0 }} eventHandlers={{ click: () => onSelect?.(d) }} />
          ) : (
            <Marker key={d.id} position={[d.latitude, d.longitude]} icon={diamond} eventHandlers={{ click: () => onSelect?.(d) }} />
          ),
        )}
      {zoomControls && <Zoom labelIn="Aproximar" labelOut="Afastar" />}
    </MapContainer>
  );
}
