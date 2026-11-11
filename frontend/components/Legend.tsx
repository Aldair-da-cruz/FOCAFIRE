"use client";
import { useLang } from "@/lib/i18n";
const HEAT = ["#6B3320", "#A4411F", "#E0561F", "#FF8A2A", "#FFD166"];
const LABELS = ["1–3", "4–7", "8–13", "14–20", "21+"];

export function Legend({ className = "" }: { className?: string }) {
  const { t } = useLang();
  return (
    <div className={`glass-panel rounded-3xl p-4 ${className}`}>
      <div className="mb-2 flex justify-between text-xs font-semibold text-white/85"><span>{t.legendLow}</span><span>{t.legendHigh}</span></div>
      <div className="flex gap-1" role="img" aria-label={`${t.legendLow} → ${t.legendHigh}`}>
        {HEAT.map((c, i) => (<div key={c} className="flex-1"><div className="h-3 rounded" style={{ background: c }} /><div className="mt-1 text-center text-[11px] text-white/80">{LABELS[i]}</div></div>))}
      </div>
      <div className="mt-2 text-[11.5px] text-white/65">≈ 50 km · NASA FIRMS (MODIS, VIIRS)</div>
    </div>
  );
}
