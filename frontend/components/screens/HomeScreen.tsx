"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MapClient, { type ViewState } from "@/components/map/MapClient";
import { Legend } from "@/components/Legend";
import { MobileNav } from "@/components/MobileNav";
import { StatsPanel } from "@/components/StatsPanel";
import { TestBanner } from "@/components/TestBanner";
import { Timeline } from "@/components/Timeline";
import { HelpLink, LangToggle, LocateButton, Logo, SearchPill } from "@/components/TopBar";
import { FireButton, GhostButton, GlassPanel, Segmented } from "@/components/ui/glass";
import { ModisDot, Next, Swap, ViirsDiamond } from "@/components/ui/icons";
import { useDetections } from "@/lib/api/hooks";
import type { Detection } from "@/lib/api/schemas";
import { useFilters, type SensorFilter } from "@/lib/filters";
import { ANGOLA_BBOX, matchPlaces, monthRange } from "@/lib/geo";
import { useLang } from "@/lib/i18n";

const YEAR = 2024;

export function HomeScreen() {
  const { t, fmt } = useLang();
  const { sensor, month, view, set } = useFilters();
  const router = useRouter();
  const [vs, setVs] = useState<ViewState>({ bbox: ANGOLA_BBOX, zoom: 6, center: [-12.2, 17.9] });
  const [start, end] = monthRange(month);
  // Regra do projecto: sempre bbox + limit ≤ 1000.
  const bboxKey = vs.bbox.map((n) => Math.round(n * 10) / 10) as [number, number, number, number];
  const det = useDetections({ bbox: bboxKey, startDate: start, endDate: end, limit: 1000 });
  const rows = useMemo(() => det.data?.data ?? [], [det.data]);
  const truncated = det.data?.truncated ?? false;
  const places = useMemo(() => matchPlaces(rows), [rows]);
  const squares = !truncated && det.data ? new Set(rows.map((d) => `${Math.floor(d.latitude / 0.5)}:${Math.floor(d.longitude / 0.5)}`)).size : null;
  const both = !truncated && det.data ? places.filter((p) => p.kind === "both").length : null;
  const mode = view === "points" || vs.zoom >= 9 ? "points" : "squares";
  const onMonth = useCallback((ym: string) => set({ month: ym }), [set]);
  const onSelect = (d: Detection) => router.push(`/detalhe?lat=${d.latitude.toFixed(4)}&lon=${d.longitude.toFixed(4)}&date=${d.acq_date}&sensor=${d.sensor}&month=${month}`);

  const sensorOpts = [
    { value: "all" as const, label: t.both },
    { value: "MODIS" as const, label: <><ModisDot />MODIS</> },
    { value: "VIIRS" as const, label: <><ViirsDiamond />VIIRS</> },
  ];

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <MapClient detections={rows} mode={mode} sensor={sensor} onView={setVs} onSelect={onSelect} />
      </div>

      {/* Topo */}
      <div className="pointer-events-none absolute inset-x-4 top-4 z-[1000] flex items-start justify-between gap-3 md:inset-x-6 md:top-6">
        <div className="pointer-events-auto hidden md:block"><Logo /></div>
        <div className="pointer-events-auto min-w-0 flex-1 md:w-[520px] md:flex-none"><SearchPill className="w-full" /></div>
        <div className="pointer-events-auto flex gap-2.5">
          <div className="hidden md:block"><LangToggle /></div>
          <HelpLink />
          <div className="hidden md:block"><LocateButton /></div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[84px] z-[1000] flex justify-center md:top-[92px]"><TestBanner className="pointer-events-auto" /></div>

      {/* Painel esquerdo (desktop) */}
      <div className="absolute left-6 top-[104px] z-[1000] hidden w-[304px] flex-col gap-4 md:flex">
        <GlassPanel className="flex flex-col gap-4 p-6">
          <h2 className="text-xl font-extrabold">{t.whatToSee}</h2>
          <Segmented value={sensor} onChange={(v: SensorFilter) => set({ sensor: v === "all" ? null : v })} options={sensorOpts} />
          <ul className="flex flex-col gap-2 text-sm text-white/90">
            <li className="flex items-center gap-3"><span className="flex w-5 justify-center"><ModisDot size={14} /></span>MODIS · ≈ 1 km</li>
            <li className="flex items-center gap-3"><span className="flex w-5 justify-center"><ViirsDiamond size={10} /></span>VIIRS · ≈ 375 m</li>
          </ul>
          <Segmented value={view} onChange={(v) => set({ view: v === "points" ? "points" : null })}
            options={[{ value: "squares", label: t.squares }, { value: "points", label: t.points }]} />
          <FireButton href={`/comparar?month=${month}`} className="!h-auto justify-between rounded-3xl px-5 py-4 text-left text-base">
            <Swap /><span className="flex-1 leading-tight">{t.compare}</span><Next />
          </FireButton>
        </GlassPanel>
        <Legend />
      </div>

      {/* Painel direito (desktop) */}
      <GlassPanel className="absolute right-6 top-[104px] z-[1000] hidden w-[340px] flex-col gap-4 p-6 md:flex">
        <StatsPanel year={YEAR} month={month} sensor={sensor} squares={squares} both={both} onMonth={onMonth} />
        <div className="glass-inset rounded-2xl p-4 text-[13.5px] leading-snug">
          <b>{t.whatIsDetection}</b><br />{t.whatIsDetectionBody}
        </div>
        {truncated && <p className="text-xs text-amber-100">{fmt(t.truncated, { n: 1000 })}</p>}
        <GhostButton href={`/?view=points&month=${month}`}>{t.seePoints}</GhostButton>
      </GlassPanel>

      {/* Linha do tempo (desktop) */}
      <div className="absolute inset-x-0 bottom-6 z-[1000] hidden justify-center md:flex"><Timeline year={YEAR} month={month} onChange={onMonth} /></div>

      {/* Folha inferior (telemóvel) */}
      <GlassPanel className="absolute inset-x-3 bottom-[88px] z-[1000] flex flex-col gap-3 !rounded-[32px] p-5 pt-3 md:hidden">
        <div className="mx-auto h-1 w-10 rounded bg-white/35" />
        <StatsPanel year={YEAR} month={month} sensor={sensor} squares={squares} both={both} onMonth={onMonth} compact />
        <Segmented value={sensor} onChange={(v: SensorFilter) => set({ sensor: v === "all" ? null : v })} options={sensorOpts} />
        <Timeline year={YEAR} month={month} onChange={onMonth} compact />
      </GlassPanel>
      <MobileNav />
    </main>
  );
}
