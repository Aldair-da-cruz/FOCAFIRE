"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import MapClient, { type ViewState } from "@/components/map/MapClient";
import { MobileNav } from "@/components/MobileNav";
import { TestBanner } from "@/components/TestBanner";
import { HelpLink, LangToggle, Logo } from "@/components/TopBar";
import { GlassPanel, Hero, IconLink } from "@/components/ui/glass";
import { Back, ModisDot, ViirsDiamond } from "@/components/ui/icons";
import { useDetections } from "@/lib/api/hooks";
import { ANGOLA_BBOX, matchPlaces, monthRange, nf } from "@/lib/geo";
import { useLang } from "@/lib/i18n";

export function CompararScreen() {
  const { t, lang } = useLang();
  const sp = useSearchParams();
  const month = /^\d{4}-\d{2}$/.test(sp.get("month") ?? "") ? (sp.get("month") as string) : "2024-09";
  const lat = Number(sp.get("lat")), lon = Number(sp.get("lon"));
  const hasFocus = sp.has("lat") && Number.isFinite(lat) && Number.isFinite(lon);
  const center: [number, number] = hasFocus ? [lat, lon] : [-12.2, 17.9];
  const [vs, setVs] = useState<ViewState>({ bbox: ANGOLA_BBOX, zoom: hasFocus ? 9 : 6, center });
  const [div, setDiv] = useState(52);
  const [start, end] = monthRange(month);
  const key = vs.bbox.map((n) => Math.round(n * 10) / 10) as [number, number, number, number];
  const q = useDetections({ bbox: key, startDate: start, endDate: end, limit: 1000 });
  const rows = useMemo(() => q.data?.data ?? [], [q.data]);
  const places = useMemo(() => matchPlaces(rows), [rows]);
  const n = { modis: 0, both: 0, viirs: 0 };
  places.forEach((p) => n[p.kind]++);
  const total = places.length;
  const pct = (v: number) => (total ? (v / total) * 100 : 0);
  const rings = places.filter((p) => p.kind === "both").map((p) => [p.det.latitude, p.det.longitude] as [number, number]);
  const follow = useMemo(() => ({ center: vs.center, zoom: vs.zoom }), [vs.center, vs.zoom]);

  const drag = (e: React.PointerEvent<HTMLDivElement>) => {
    const move = (ev: PointerEvent) => setDiv(Math.min(85, Math.max(15, (ev.clientX / window.innerWidth) * 100)));
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    e.preventDefault();
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      {/* Base: MODIS (segue o mapa de cima) + anéis "os dois" */}
      <div className="absolute inset-0">
        <MapClient detections={rows} mode="points" sensor="MODIS" onView={() => {}} center={center} zoom={vs.zoom} follow={follow} interactive={false} rings={rings} zoomControls={false} />
      </div>
      {/* Topo: só VIIRS, cortado pela barra; é este que o utilizador arrasta */}
      <div className="absolute inset-0" style={{ WebkitMaskImage: `linear-gradient(to right, transparent ${div}%, #000 ${div}%)`, maskImage: `linear-gradient(to right, transparent ${div}%, #000 ${div}%)` }}>
        <MapClient detections={rows} mode="points" sensor="VIIRS" onView={setVs} center={center} zoom={vs.zoom} tiles={false} />
      </div>
      {/* A máscara (ao contrário do clip-path) não bloqueia o rato: o mapa de cima ocupa tudo e arrasta os dois. */}
      <div className="pointer-events-none absolute inset-y-0 z-[900] w-[3px] bg-white/90 shadow-[0_0_24px_rgba(255,255,255,.35)]" style={{ left: `${div}%` }} />
      <div role="slider" tabIndex={0} aria-label={t.dragBar} aria-valuemin={15} aria-valuemax={85} aria-valuenow={Math.round(div)}
        onPointerDown={drag} onKeyDown={(e) => { if (e.key === "ArrowLeft") setDiv((d) => Math.max(15, d - 3)); if (e.key === "ArrowRight") setDiv((d) => Math.min(85, d + 3)); }}
        className="glass focus-ring absolute top-1/2 z-[1000] flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full border-white/60"
        style={{ left: `${div}%` }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M8 8l-5 4 5 4M16 8l5 4-5 4" /></svg>
      </div>
      <div className="glass pointer-events-none absolute top-[calc(50%+42px)] z-[1000] -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-bold" style={{ left: `${div}%` }}>{t.dragBar}</div>

      {/* Etiquetas dos lados */}
      <div className="pointer-events-none absolute top-[136px] z-[1000] flex -translate-x-full items-center gap-2.5 rounded-full px-4 py-2 text-[#2A1700] shadow-xl max-md:top-[116px]" style={{ left: `calc(${div}% - 16px)`, background: "linear-gradient(160deg,#FFD070,#F5A623)" }}>
        <ModisDot size={16} /><span className="leading-tight"><b className="block text-base font-extrabold">MODIS</b><span className="text-xs font-bold">≈ 1 km</span></span>
      </div>
      <div className="pointer-events-none absolute top-[136px] z-[1000] flex items-center gap-2.5 rounded-full px-4 py-2 text-[#032028] shadow-xl max-md:top-[116px]" style={{ left: `calc(${div}% + 16px)`, background: "linear-gradient(160deg,#8AF0F7,#2EC7DA)" }}>
        <ViirsDiamond size={12} /><span className="leading-tight"><b className="block text-base font-extrabold">VIIRS</b><span className="text-xs font-bold">≈ 375 m</span></span>
      </div>

      {/* Topo */}
      <div className="pointer-events-none absolute inset-x-4 top-4 z-[1000] flex items-start justify-between gap-3 md:inset-x-6 md:top-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <IconLink label={t.back} href={`/?month=${month}`} className="md:!hidden"><Back /></IconLink>
          <div className="hidden md:block"><Logo /></div>
        </div>
        <div className="glass pointer-events-auto flex h-[52px] items-center rounded-full px-6 text-base font-extrabold md:h-14 md:text-xl">{t.compare}</div>
        <div className="pointer-events-auto flex gap-2.5"><div className="hidden md:block"><LangToggle /></div><div className="hidden md:block"><HelpLink /></div></div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[84px] z-[1000] flex justify-center md:top-[92px]"><TestBanner className="pointer-events-auto" /></div>

      {/* Resultado */}
      <GlassPanel className="absolute inset-x-3 bottom-[88px] z-[1000] flex flex-col gap-4 p-5 md:inset-x-auto md:bottom-auto md:left-6 md:top-[104px] md:w-[304px] md:p-6">
        <a href={`/?month=${month}`} className="glass-inset focus-ring hidden w-fit items-center gap-2 rounded-full py-2.5 pl-3 pr-5 font-bold md:flex"><Back width={20} height={20} />{t.back}</a>
        <div>
          <div className="text-sm text-white/80">{new Date(`${month}-15`).toLocaleDateString(lang === "pt" ? "pt-PT" : "en-GB", { month: "long", year: "numeric" })}</div>
          <div className="flex items-baseline gap-2.5"><Hero className="text-[56px] md:text-[76px]">{q.isLoading ? "…" : nf(total)}</Hero><span className="text-base font-medium text-white/85">{t.placesWithHeat}</span></div>
        </div>
        <div className="flex h-3.5 gap-[3px] overflow-hidden rounded-full" role="img" aria-label={`${n.modis} / ${n.both} / ${n.viirs}`}>
          <span style={{ width: `${pct(n.modis)}%`, background: "#FFC247" }} /><span style={{ width: `${pct(n.both)}%`, background: "#fff" }} /><span style={{ width: `${pct(n.viirs)}%`, background: "#5FE3F0" }} />
        </div>
        <ul className="flex flex-col gap-2.5 text-[15.5px]">
          <li className="flex items-center gap-3"><ModisDot size={16} /><span className="flex-1">{t.onlyModis}</span><b className="text-2xl font-semibold">{n.modis}</b></li>
          <li className="flex items-center gap-3"><span className="h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] border-dashed border-white" /><span className="flex-1">{t.bothSaw}</span><b className="text-2xl font-semibold">{n.both}</b></li>
          <li className="flex items-center gap-3"><ViirsDiamond size={11} /><span className="flex-1">{t.onlyViirs}</span><b className="text-2xl font-semibold">{n.viirs}</b></li>
        </ul>
        <div className="glass-inset hidden rounded-2xl p-4 text-sm leading-snug md:block"><b>{t.whyViirs}</b><br />{t.whyViirsBody}</div>
        {q.data?.truncated && <p className="text-xs text-amber-100">{t.truncated.replace("{n}", "1000")}</p>}
      </GlassPanel>
      <MobileNav />
    </main>
  );
}
