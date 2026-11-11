"use client";
import { Area, AreaChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Hero, Inset } from "@/components/ui/glass";
import { ModisDot, ViirsDiamond } from "@/components/ui/icons";
import { useTimeseries } from "@/lib/api/hooks";
import { MONTHS_EN, MONTHS_PT, nf } from "@/lib/geo";
import { useLang } from "@/lib/i18n";
import type { SensorFilter } from "@/lib/filters";

const sum = (a: number | null, b: number | null) => (a === null && b === null ? null : (a ?? 0) + (b ?? 0));

export function StatsPanel({ year, month, sensor, squares, both, onMonth, compact = false }: {
  year: number; month: string; sensor: SensorFilter; squares: number | null; both: number | null;
  onMonth: (ym: string) => void; compact?: boolean;
}) {
  const { t, fmt, lang } = useLang();
  const { data, isLoading, isError, refetch } = useTimeseries(year);
  const names = lang === "pt" ? MONTHS_PT : MONTHS_EN;
  const idx = Number(month.slice(5, 7)) - 1;
  const row = data?.data[idx];
  const modis = row?.modis ?? null, viirs = row?.viirs ?? null;
  const total = sensor === "MODIS" ? modis : sensor === "VIIRS" ? viirs : sum(modis, viirs);
  const series = (data?.data ?? []).map((r, i) => ({
    i, label: names[i],
    v: sensor === "MODIS" ? r.modis : sensor === "VIIRS" ? r.viirs : sum(r.modis, r.viirs), // null = sem dados (≠ 0)
  }));
  const monthName = new Date(`${month}-15`).toLocaleDateString(lang === "pt" ? "pt-PT" : "en-GB", { month: "long", year: "numeric" });

  if (isError)
    return (
      <div role="alert" className="flex flex-col items-start gap-3 text-sm">
        <b>{t.errorTitle}</b>
        <button onClick={() => refetch()} className="glass focus-ring rounded-full px-5 py-2 font-bold">{t.retry}</button>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm text-white/80">Angola · {monthName}</div>
        <div aria-live="polite" className="flex items-baseline gap-2.5">
          <Hero className={compact ? "text-[56px]" : "text-[84px]"}>{isLoading ? "…" : total === null ? "—" : nf(total)}</Hero>
          <span className="text-base font-medium text-white/85">{t.detections}</span>
        </div>
        {squares !== null && <p className="mt-1 text-[13.5px] leading-snug text-white/85">{fmt(t.inSquares, { n: squares })}</p>}
      </div>

      {!compact && (
        <div className="grid grid-cols-3 gap-2">
          <Tile icon={<ModisDot />} label="MODIS" value={modis} />
          <Tile icon={<ViirsDiamond />} label="VIIRS" value={viirs} />
          <Tile label={t.both} value={both} />
        </div>
      )}

      <div className={compact ? "h-[70px]" : "h-[110px]"} role="img" aria-label={`${t.detections} / ${year}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} onClick={(e) => { const i = e?.activeTooltipIndex; if (typeof i === "number") onMonth(`${year}-${String(i + 1).padStart(2, "0")}`); }}>
            <defs><linearGradient id="fireFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF9B3D" stopOpacity={0.55} /><stop offset="1" stopColor="#FF9B3D" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="label" hide />
            <Tooltip cursor={false} contentStyle={{ background: "rgba(30,20,14,.9)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 14, color: "#fff" }}
              formatter={(v) => [v === null || v === undefined ? "—" : nf(Number(v)), t.detections]} />
            <Area type="monotone" dataKey="v" stroke="#FFB35C" strokeWidth={2.2} fill="url(#fireFill)" connectNulls={false} isAnimationActive={false} />
            {series[idx]?.v != null && <ReferenceDot x={series[idx].label} y={series[idx].v as number} r={7} fill="#fff" stroke="rgba(255,138,43,.5)" strokeWidth={6} />}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Tile({ icon, label, value }: { icon?: React.ReactNode; label: string; value: number | null }) {
  return (
    <Inset className="flex flex-col gap-1 !rounded-2xl px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-[13px] font-medium text-white/80">{icon}{label}</span>
      <span className="text-2xl font-semibold">{value === null ? "—" : nf(value)}</span>
    </Inset>
  );
}
