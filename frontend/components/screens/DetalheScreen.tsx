"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import MapClient from "@/components/map/MapClient";
import { MobileNav } from "@/components/MobileNav";
import { TestBanner } from "@/components/TestBanner";
import { LangToggle, Logo } from "@/components/TopBar";
import { FireButton, GlassPanel, Hero, IconLink } from "@/components/ui/glass";
import { Back, Link as LinkIcon, ModisDot, Pin, Swap, ViirsDiamond } from "@/components/ui/icons";
import { useDetections } from "@/lib/api/hooks";
import type { Detection } from "@/lib/api/schemas";
import { cellKey, matchPlaces } from "@/lib/geo";
import { useLang } from "@/lib/i18n";

const R = 36, C = 2 * Math.PI * R;
function Ring({ pct, color, children }: { pct: number | null; color: string; children: React.ReactNode }) {
  return (
    <div className="relative h-[76px] w-[76px] shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="7" />
        {pct !== null && <circle cx="40" cy="40" r={R} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`} />}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{children}</div>
    </div>
  );
}

/** MODIS: 0–100. VIIRS: l / n / h (baixa, nominal, alta). */
function confidence(raw: string | null): { pct: number | null; label: string | null } {
  if (raw === null) return { pct: null, label: null };
  if (/^\d+$/.test(raw)) { const n = Number(raw); return { pct: n / 100, label: n >= 80 ? "Alta" : n >= 50 ? "Média" : "Baixa" }; }
  return { l: { pct: 0.33, label: "Baixa" }, n: { pct: 0.66, label: "Média" }, h: { pct: 1, label: "Alta" } }[raw] ?? { pct: null, label: raw };
}

export function DetalheScreen() {
  const { t, lang } = useLang();
  const sp = useSearchParams();
  const lat = Number(sp.get("lat")), lon = Number(sp.get("lon"));
  const date = sp.get("date") ?? "";
  const sensor = sp.get("sensor") === "MODIS" ? "MODIS" : "VIIRS";
  const month = sp.get("month") ?? "2024-09";
  const valid = Number.isFinite(lat) && Number.isFinite(lon) && sp.has("lat") && /^\d{4}-\d{2}-\d{2}$/.test(date);
  const [copied, setCopied] = useState(false);

  // Procura vizinhança (±0,06°) nesse dia: descobre se o outro satélite viu o mesmo local.
  const q = useDetections({ bbox: [lon - 0.06, lat - 0.06, lon + 0.06, lat + 0.06], startDate: date, endDate: date, limit: 100 });
  const near = (q.data?.data ?? []) as Detection[];
  const me = near.find((d) => d.sensor === sensor && Math.abs(d.latitude - lat) < 1e-3 && Math.abs(d.longitude - lon) < 1e-3) ?? near[0];
  const place = me ? matchPlaces(near.filter((d) => cellKey(d) === cellKey(me))) [0] : undefined;
  const both = place?.kind === "both";
  const conf = confidence(me?.confidence ?? null);
  const frpPct = me?.frp == null ? null : Math.min(me.frp / 80, 1);

  if (!valid)
    return (
      <main className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-ink p-6 text-center">
        <p className="max-w-sm text-lg">{lang === "pt" ? "Escolha um ponto no mapa para ver os detalhes." : "Pick a point on the map to see its details."}</p>
        <FireButton href="/?view=points">{t.seePoints}</FireButton>
      </main>
    );

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <MapClient detections={near} mode="points" sensor="all" center={[lat, lon]} zoom={11} selectedId={me?.id} onView={() => {}} />
      </div>
      <div className="pointer-events-none absolute inset-x-4 top-4 z-[1000] flex items-center justify-between gap-3 md:inset-x-6 md:top-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <IconLink label={t.back} href={`/?month=${month}&view=points`}><Back /></IconLink>
          <div className="hidden md:block"><Logo /></div>
        </div>
        <div className="pointer-events-auto hidden md:block"><LangToggle /></div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[84px] z-[1000] flex justify-center md:top-6"><TestBanner className="pointer-events-auto" /></div>

      <GlassPanel className="absolute inset-x-3 bottom-[88px] top-[300px] z-[1000] flex flex-col gap-4 overflow-y-auto p-5 md:inset-x-auto md:bottom-auto md:right-6 md:top-[104px] md:w-[360px] md:p-6">
        {!me ? (
          <p>{q.isLoading ? t.loading : t.errorTitle}</p>
        ) : (
          <>
            <div>
              <h1 className="text-[26px] font-extrabold leading-tight">{t.heatDetection}</h1>
              <p className="mt-1 flex items-center gap-1.5 font-semibold"><Pin width={17} height={17} className="text-fire-400" />{me.latitude.toFixed(2)}° · {me.longitude.toFixed(2)}°</p>
              <p className="text-[13px] text-white/75">{me.acq_date} · {me.acq_time.slice(0, 2)}:{me.acq_time.slice(2)} UTC</p>
            </div>
            <div className="rounded-3xl border border-fire-300/40 bg-fire-400/15 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 font-extrabold">
                {both ? t.seenByBoth : t.seenByOne}
                <span className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-0.5 text-[13px] font-semibold"><ModisDot />MODIS {place?.kind !== "viirs" ? "✓" : "—"}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-0.5 text-[13px] font-semibold"><ViirsDiamond />VIIRS {place?.kind !== "modis" ? "✓" : "—"}</span>
              </div>
              <p className="text-[13.5px] leading-snug text-white/90">{t.notConfirmed}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="glass-inset flex items-center gap-4 rounded-3xl p-3">
                <Ring pct={frpPct} color="#FFA445"><span className="text-xs">{me.frp === null ? "—" : `${Math.round((frpPct ?? 0) * 100)}%`}</span></Ring>
                <div><div className="text-xs text-white/80">{t.intensity}</div><Hero className="text-2xl">{me.frp === null ? t.unknown : `${me.frp} MW`}</Hero></div>
              </div>
              <div className="glass-inset flex items-center gap-4 rounded-3xl p-3">
                <Ring pct={conf.pct} color="#FFD070"><span className="text-xs">{conf.pct === null ? "—" : `${Math.round(conf.pct * 100)}%`}</span></Ring>
                <div><div className="text-xs text-white/80">{t.confidence}</div><div className="text-xl font-light">{conf.label ?? t.unknown}</div></div>
              </div>
            </div>
            <p className="text-xs text-white/65">NASA FIRMS · {me.sensor}</p>
            <div className="sticky -bottom-5 -mx-5 mt-auto flex gap-2 bg-[#1a120e]/90 px-5 pb-5 pt-3 backdrop-blur md:-bottom-6 md:-mx-6 md:px-6 md:pb-6">
              <FireButton href={`/comparar?month=${month}&lat=${lat}&lon=${lon}`} className="flex-1"><Swap />{t.seeInCompare}</FireButton>
              <button aria-label={t.copyLink} onClick={() => { navigator.clipboard?.writeText(location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="glass focus-ring flex h-14 w-14 items-center justify-center rounded-full">{copied ? "✓" : <LinkIcon />}</button>
            </div>
          </>
        )}
      </GlassPanel>
      <MobileNav />
      <Link href="/" className="sr-only">{t.back}</Link>
    </main>
  );
}
