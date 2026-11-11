"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "@/components/ui/icons";
import { useLang } from "@/lib/i18n";
import { MONTHS_EN, MONTHS_PT } from "@/lib/geo";

/** Linha do tempo mensal: play percorre os meses; clicar num mês escolhe-o. */
export function Timeline({ year, month, onChange, compact = false }: { year: number; month: string; onChange: (ym: string) => void; compact?: boolean }) {
  const { lang } = useLang();
  const names = lang === "pt" ? MONTHS_PT : MONTHS_EN;
  const idx = Number(month.slice(5, 7)) - 1;
  const [playing, setPlaying] = useState(false);
  const active = playing && idx < 11; // chegou a dezembro → pára sozinho
  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => onChange(`${year}-${String(idx + 2).padStart(2, "0")}`), 1000);
    return () => clearTimeout(id);
  }, [active, idx, year, onChange]);
  const toggle = () => {
    if (active) return setPlaying(false);
    if (idx >= 11) onChange(`${year}-01`); // recomeça em janeiro
    setPlaying(true);
  };
  const pct = (idx / 11) * 100;
  return (
    <div className={`flex items-center gap-4 ${compact ? "" : "glass h-[76px] w-[620px] rounded-full pl-3 pr-6"}`}>
      <button aria-label={active ? "Pausar" : "Reproduzir mês a mês"} onClick={toggle}
        className="btn-fire focus-ring flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full">
        {active ? <Pause /> : <Play />}
      </button>
      <div className="relative h-11 flex-1">
        <div className="absolute left-2.5 right-2.5 top-3 h-1 rounded bg-white/30" />
        <div className="absolute left-2.5 top-3 h-1 rounded bg-fire-400" style={{ width: `calc((100% - 20px) * ${pct / 100})` }} />
        <div className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_0_0_5px_rgba(255,138,43,.35)]" style={{ left: `calc(10px + (100% - 20px) * ${pct / 100} - 10px)` }} />
        <div className="absolute inset-x-0 top-6 flex justify-between">
          {names.map((n, i) => (
            <button key={n} aria-label={`${n} ${year}`} aria-pressed={i === idx} onClick={() => onChange(`${year}-${String(i + 1).padStart(2, "0")}`)}
              className={`focus-ring w-7 rounded text-center text-[11.5px] ${i === idx ? "font-extrabold text-white" : "font-medium text-white/70"}`}>{compact ? n[0].toUpperCase() : n}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
