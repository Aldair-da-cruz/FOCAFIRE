"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapIcon, Swap, Help } from "@/components/ui/icons";
import { useLang } from "@/lib/i18n";

export function MobileNav() {
  const path = usePathname();
  const { t } = useLang();
  const items = [
    { href: "/", label: t.nav.map, icon: <MapIcon width={22} height={22} /> },
    { href: "/comparar", label: t.nav.compare, icon: <Swap width={22} height={22} /> },
    { href: "/como-ler", label: t.nav.help, icon: <Help width={22} height={22} /> },
  ];
  return (
    <nav aria-label="Principal" className="glass absolute inset-x-4 bottom-3 z-[1000] flex h-16 gap-1 rounded-full p-1.5 md:hidden">
      {items.map((i) => {
        const on = path === i.href;
        return (
          <Link key={i.href} href={i.href} aria-current={on ? "page" : undefined}
            className={`focus-ring flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11.5px] ${on ? "btn-fire" : "font-semibold text-white/90"}`}>
            {i.icon}{i.label}
          </Link>
        );
      })}
    </nav>
  );
}
