"use client";
import dynamic from "next/dynamic";
import type { MapViewProps } from "./MapView";

/** Leaflet precisa do browser: carregamos só no cliente. */
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0a1b22]" aria-hidden />,
});
export default function MapClient(props: MapViewProps) {
  return <MapView {...props} />;
}
export type { ViewState } from "./MapView";
