"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type SensorFilter = "all" | "MODIS" | "VIIRS";
export const DEFAULT_MONTH = "2024-09";

/** Estado dos filtros vive no URL → qualquer vista é partilhável por link. */
export function useFilters() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sensor = (["MODIS", "VIIRS"].includes(sp.get("sensor") ?? "") ? sp.get("sensor") : "all") as SensorFilter;
  const month = /^\d{4}-\d{2}$/.test(sp.get("month") ?? "") ? (sp.get("month") as string) : DEFAULT_MONTH;
  const view = sp.get("view") === "points" ? "points" : "squares";
  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const p = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null) p.delete(k);
        else p.set(k, v);
      }
      router.replace(`${pathname}?${p}`, { scroll: false });
    },
    [sp, router, pathname],
  );
  return { sensor, month, view, set, params: sp };
}
