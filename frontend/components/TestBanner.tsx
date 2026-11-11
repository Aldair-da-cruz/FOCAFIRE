"use client";
import { useMeta } from "@/lib/api/hooks";
import { useLang } from "@/lib/i18n";

/** Sempre visível. Decide TESTE/REAL por is_sample; na dúvida (carregando/erro) assume TESTE. */
export function TestBanner({ className = "" }: { className?: string }) {
  const { data } = useMeta();
  const { t } = useLang();
  const real = data?.is_sample === false;
  return (
    <div role="status" className={`flex h-8 items-center justify-center gap-2 rounded-full border px-4 text-[12.5px] font-bold tracking-wide backdrop-blur-md ${
      real ? "border-emerald-300/50 bg-emerald-400/20 text-emerald-100" : "border-amber-300/55 bg-amber-300/20 text-amber-100"} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {real ? t.real : t.test}
    </div>
  );
}
