import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

export const GlassPanel = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cx("glass-panel rounded-glass", className)}>{children}</div>
);

export const GlassPill = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cx("glass rounded-full", className)}>{children}</div>
);

export const Inset = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cx("glass-inset rounded-3xl", className)}>{children}</div>
);

export function IconButton({ label, className, ...p }: { label: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button aria-label={label} className={cx("glass focus-ring flex h-[52px] w-[52px] items-center justify-center rounded-full", className)} {...p} />;
}
export function IconLink({ label, href, children, className }: { label: string; href: string; children: ReactNode; className?: string }) {
  return <Link aria-label={label} href={href} className={cx("glass focus-ring flex h-[52px] w-[52px] items-center justify-center rounded-full", className)}>{children}</Link>;
}

export function FireButton({ href, onClick, children, className }: { href?: string; onClick?: () => void; children: ReactNode; className?: string }) {
  const c = cx("btn-fire focus-ring flex h-14 items-center justify-center gap-2.5 rounded-full px-6 text-[17px]", className);
  return href ? <Link href={href} className={c}>{children}</Link> : <button onClick={onClick} className={c}>{children}</button>;
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[] }) {
  return (
    <div role="group" className="glass-inset flex gap-1 rounded-full p-1">
      {options.map((o) => (
        <button key={o.value} aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={cx("focus-ring flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full text-sm transition-colors",
            value === o.value ? "bg-white font-extrabold text-[#1b0f06]" : "font-semibold text-white hover:bg-white/10")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Número grande em peso leve, com brilho quente (assinatura visual do FOCAFIRE). */
export const Hero = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cx("font-light leading-none tracking-tight [text-shadow:0_0_34px_rgba(255,138,43,.55)]", className)}>{children}</span>
);

export function GhostButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={cx("focus-ring flex h-12 items-center justify-center rounded-full border border-white/40 px-5 text-[15px] font-bold hover:bg-white/10", className)}>{children}</Link>;
}
