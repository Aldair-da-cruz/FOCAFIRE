import type { SVGProps } from "react";
const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
export const Flame = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M12 2c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.3 1.2 1 2 2 2.2C10.5 7 11 4.5 12 2z" /></svg>
);
export const Help = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7" /><circle cx="12" cy="17" r=".6" fill="currentColor" /></svg>);
export const Locate = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>);
export const Search = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>);
export const Back = (p: SVGProps<SVGSVGElement>) => (<svg {...base} strokeWidth={2.2} {...p}><path d="M15 6l-6 6 6 6" /></svg>);
export const Next = (p: SVGProps<SVGSVGElement>) => (<svg {...base} strokeWidth={2.2} {...p}><path d="M9 6l6 6-6 6" /></svg>);
export const Plus = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>);
export const Minus = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M5 12h14" /></svg>);
export const Play = (p: SVGProps<SVGSVGElement>) => (<svg {...base} fill="currentColor" stroke="none" {...p}><path d="M8 5.5v13l11-6.5z" /></svg>);
export const Pause = (p: SVGProps<SVGSVGElement>) => (<svg {...base} fill="currentColor" stroke="none" {...p}><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>);
export const Swap = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M8 8l-5 4 5 4M16 8l5 4-5 4M3 12h18" /></svg>);
export const Close = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const MapIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg>);
export const Link = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>);
export const Pin = (p: SVGProps<SVGSVGElement>) => (<svg {...base} {...p}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);
export const ModisDot = ({ size = 12 }: { size?: number }) => (<span aria-hidden style={{ width: size, height: size }} className="inline-block shrink-0 rounded-full border-[2.5px] border-modis" />);
export const ViirsDiamond = ({ size = 9 }: { size?: number }) => (<span aria-hidden style={{ width: size, height: size }} className="inline-block shrink-0 rotate-45 bg-viirs" />);
