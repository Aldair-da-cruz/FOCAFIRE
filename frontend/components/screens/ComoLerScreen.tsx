"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FireButton, GlassPanel } from "@/components/ui/glass";
import { Close, Flame, Next } from "@/components/ui/icons";
import MapClient from "@/components/map/MapClient";
import { LangToggle } from "@/components/TopBar";
import { useLang } from "@/lib/i18n";
import { useDetections } from "@/lib/api/hooks";
import { ANGOLA_BBOX } from "@/lib/geo";

const HEAT = ["#6B3320", "#A4411F", "#E0561F", "#FF8A2A", "#FFD166"];

export function ComoLerScreen() {
  const { t } = useLang();
  const router = useRouter();
  const bg = useDetections({ bbox: ANGOLA_BBOX, startDate: "2024-09-01", endDate: "2024-09-30", limit: 1000 });
  const [step, setStep] = useState(0);
  const [skip, setSkip] = useState(false);
  const steps = [
    { title: t.s1t, body: t.s1b, art: (
      <svg viewBox="0 0 260 150" className="h-full w-full" role="img" aria-label={t.s1t}>
        <path d="M1 150 Q130 92 259 150Z" fill="#fff" fillOpacity=".08" />
        <circle cx="150" cy="122" r="30" fill="#FF8A2B" fillOpacity=".18" /><circle cx="150" cy="122" r="16" fill="#FF8A2B" fillOpacity=".38" /><circle cx="150" cy="122" r="6.5" fill="#FFB35C" />
        <path d="M66 44 L146 114" stroke="#FFD070" strokeOpacity=".9" strokeWidth="2" strokeDasharray="4 5" />
        <g transform="translate(62 38) rotate(-30)"><rect x="-11" y="-8" width="22" height="16" rx="4" fill="#fff" /><rect x="-36" y="-4.5" width="20" height="9" rx="2" fill="#5FE3F0" /><rect x="16" y="-4.5" width="20" height="9" rx="2" fill="#5FE3F0" /></g>
      </svg>) },
    { title: t.s2t, body: t.s2b, art: (
      <div className="flex h-full flex-col items-center justify-center gap-3" role="img" aria-label={`${t.legendLow} → ${t.legendHigh}`}>
        <div className="flex gap-1.5">{HEAT.map((c) => <span key={c} className="h-10 w-10 rounded-xl" style={{ background: c, boxShadow: `0 0 16px ${c}99` }} />)}</div>
        <div className="flex w-[230px] justify-between text-sm font-semibold text-white/85"><span>{t.legendLow}</span><span>{t.legendHigh}</span></div>
      </div>) },
    { title: t.s3t, body: t.s3b, art: (
      <div className="flex h-full flex-col items-start justify-center gap-2 px-5">
        {[["#FFD070", "Queimada controlada"], ["#FF7A2B", "Incêndio"]].map(([c, l]) => (
          <span key={l} className="glass-inset flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"><Flame width={18} height={18} style={{ color: c }} />{l}</span>
        ))}
        <span className="glass-inset flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"><span className="h-3 w-3 rounded-sm bg-viirs" />Outra fonte de calor</span>
      </div>) },
  ];
  const done = () => { if (skip) try { localStorage.setItem("intro-seen", "1"); } catch {} router.push("/"); };
  const last = step === 2;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0 blur-[3px]"><MapClient detections={bg.data?.data ?? []} mode="squares" sensor="all" onView={() => {}} interactive={false} zoomControls={false} /></div>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute right-4 top-4 z-10 flex gap-2.5 md:hidden">
        <button onClick={done} className="glass focus-ring flex h-[52px] items-center rounded-full px-6 text-[15px] font-bold">Saltar</button>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center p-3 md:p-10">
        <GlassPanel className="flex max-h-full w-full max-w-[1020px] flex-col gap-6 overflow-y-auto !rounded-[40px] p-5 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="btn-fire flex h-14 w-14 items-center justify-center rounded-full"><Flame width={30} height={30} /></span>
              <div><h1 className="text-[28px] font-light leading-tight md:text-[40px]">{t.welcome}</h1><p className="text-sm text-white/80 md:text-base">{t.welcomeSub}</p></div>
            </div>
            <div className="hidden items-center gap-2 md:flex"><LangToggle /><button aria-label="Fechar" onClick={done} className="glass focus-ring flex h-12 w-12 items-center justify-center rounded-full"><Close /></button></div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <section key={s.title} className={`${i === step ? "flex" : "hidden"} flex-col gap-4 md:flex`} aria-label={s.title}>
                <div className="glass-inset h-[210px] overflow-hidden rounded-3xl md:h-[160px]">{s.art}</div>
                <h2 className="flex items-center gap-2.5 text-[22px] font-bold leading-tight"><span className="btn-fire flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base">{i + 1}</span>{s.title}</h2>
                <p className="text-base leading-relaxed text-white/85">{s.body}</p>
              </section>
            ))}
          </div>

          <div className="mx-auto flex gap-2 md:hidden" aria-hidden>{steps.map((_, i) => <span key={i} className={`h-2 rounded-full ${i === step ? "w-7 bg-fire-400" : "w-2 bg-white/35"}`} />)}</div>
          <hr className="hidden border-white/15 md:block" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <label className="hidden cursor-pointer items-center gap-2.5 text-[15px] text-white/90 md:flex"><input type="checkbox" checked={skip} onChange={(e) => setSkip(e.target.checked)} className="h-5 w-5 accent-fire-400" />{t.dontShow}</label>
            <div className="flex gap-3">
              <FireButton onClick={last ? done : () => setStep(step + 1)} className="w-full md:hidden">{last ? t.gotIt : "Seguinte"}<Next /></FireButton>
              <FireButton onClick={done} className="hidden md:flex">{t.gotIt}<Next /></FireButton>
            </div>
          </div>
        </GlassPanel>
      </div>
    </main>
  );
}
