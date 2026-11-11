"use client";
import Link from "next/link";
import { Flame, Help, Locate, Search } from "@/components/ui/icons";
import { IconButton, IconLink } from "@/components/ui/glass";
import { useLang } from "@/lib/i18n";

export function Logo() {
  return (
    <Link href="/" aria-label="FOCAFIRE" className="glass focus-ring flex h-14 items-center gap-3 rounded-full pl-2 pr-6">
      <span className="btn-fire flex h-10 w-10 items-center justify-center rounded-full"><Flame width={22} height={22} /></span>
      <span className="text-xl font-extrabold tracking-[.08em]">FOCAFIRE</span>
    </Link>
  );
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="glass flex h-14 gap-1 rounded-full p-1.5">
      {(["pt", "en"] as const).map((l) => (
        <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}
          className={`focus-ring w-14 rounded-full text-[15px] ${lang === l ? "bg-white font-extrabold text-[#1b0f06]" : "font-semibold"}`}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}

export function SearchPill({ className = "" }: { className?: string }) {
  const { t } = useLang();
  return (
    <label className={`glass flex h-[52px] items-center gap-3 rounded-full px-5 md:h-14 ${className}`}>
      <Search className="shrink-0 opacity-90" />
      <input type="search" size={1} aria-label={t.search} placeholder={t.search}
        className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-white/70" />
    </label>
  );
}

export function HelpLink() {
  const { t } = useLang();
  return <IconLink label={t.help} href="/como-ler" className="md:!h-14 md:!w-14"><Help /></IconLink>;
}
export function LocateButton() {
  return <IconButton label="Perto de mim" className="!h-14 !w-14"><Locate /></IconButton>;
}
