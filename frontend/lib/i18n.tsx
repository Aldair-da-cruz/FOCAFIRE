"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const dict = {
  pt: {
    search: "Procurar província ou cidade",
    test: "DADOS DE TESTE · não são observações reais",
    real: "DADOS REAIS · NASA FIRMS",
    help: "Como ler este mapa",
    whatToSee: "O que quer ver?",
    both: "Os dois",
    squares: "Quadrados",
    points: "Pontos",
    compare: "Comparar os dois satélites",
    legendLow: "poucas",
    legendHigh: "muitas",
    detections: "detecções",
    inSquares: "Calor forte visto em {n} quadrados do mapa (cada um com cerca de 50 km).",
    whatIsDetection: "O que é uma detecção?",
    whatIsDetectionBody:
      "Um satélite viu calor forte num ponto. Pode ser um incêndio, uma queimada controlada ou outra fonte de calor.",
    seePoints: "Ver os pontos de uma zona",
    back: "Voltar a Angola",
    heatDetection: "Detecção de calor",
    seenByBoth: "Visto pelos dois satélites",
    seenByOne: "Visto por um satélite",
    notConfirmed: "Continua a ser uma detecção, não um incêndio confirmado.",
    intensity: "Intensidade",
    confidence: "Confiança",
    unknown: "sem valor",
    seeInCompare: "Ver no comparador",
    copyLink: "Copiar ligação",
    onlyModis: "Só o MODIS viu",
    bothSaw: "Os dois viram",
    onlyViirs: "Só o VIIRS viu",
    placesWithHeat: "locais com calor",
    whyViirs: "Porque é que o VIIRS vê mais?",
    whyViirsBody: "Olha para pedaços de terra mais pequenos (375 m, contra 1 km do MODIS), por isso apanha focos de calor menores.",
    dragBar: "Arraste a barra",
    welcome: "Bem-vindo ao FOCAFIRE",
    welcomeSub: "3 coisas para saber antes de explorar o mapa",
    s1t: "Um satélite viu calor",
    s1b: "Satélites passam por cima de Angola várias vezes por dia e medem o calor do chão. Cada ponto ou quadrado do mapa é um sítio onde sentiram calor forte.",
    s2t: "As cores contam quantas",
    s2b: "Quanto mais claro e amarelo, mais detecções naquele quadrado. Cada quadrado mede cerca de 50 km. Aproxime o mapa para ver cada ponto.",
    s3t: "Calor não é sempre incêndio",
    s3b: "Por isso dizemos “detecções”: o satélite vê o calor, mas não sabe a causa.",
    gotIt: "Entendi, explorar o mapa",
    dontShow: "Não mostrar outra vez",
    loading: "A carregar…",
    errorTitle: "Não conseguimos carregar os dados",
    retry: "Tentar outra vez",
    truncated: "A mostrar as primeiras {n}. Aproxime o mapa para ver mais.",
    nav: { map: "Mapa", compare: "Comparar", help: "Como ler" },
  },
  en: {
    search: "Search province or city",
    test: "SAMPLE DATA · not real observations",
    real: "REAL DATA · NASA FIRMS",
    help: "How to read this map",
    whatToSee: "What do you want to see?",
    both: "Both",
    squares: "Squares",
    points: "Points",
    compare: "Compare the two satellites",
    legendLow: "few",
    legendHigh: "many",
    detections: "detections",
    inSquares: "Strong heat seen in {n} map squares (each about 50 km wide).",
    whatIsDetection: "What is a detection?",
    whatIsDetectionBody:
      "A satellite saw strong heat at a spot. It may be a wildfire, a controlled burn or another heat source.",
    seePoints: "See the points in an area",
    back: "Back to Angola",
    heatDetection: "Heat detection",
    seenByBoth: "Seen by both satellites",
    seenByOne: "Seen by one satellite",
    notConfirmed: "It is still a detection, not a confirmed fire.",
    intensity: "Intensity",
    confidence: "Confidence",
    unknown: "no value",
    seeInCompare: "See in comparison",
    copyLink: "Copy link",
    onlyModis: "Only MODIS saw",
    bothSaw: "Both saw",
    onlyViirs: "Only VIIRS saw",
    placesWithHeat: "places with heat",
    whyViirs: "Why does VIIRS see more?",
    whyViirsBody: "It looks at smaller patches of land (375 m vs MODIS's 1 km), so it picks up smaller heat sources.",
    dragBar: "Drag the bar",
    welcome: "Welcome to FOCAFIRE",
    welcomeSub: "3 things to know before exploring the map",
    s1t: "A satellite saw heat",
    s1b: "Satellites pass over Angola several times a day and measure ground heat. Each dot or square on the map is a spot where they sensed strong heat.",
    s2t: "Colors show how many",
    s2b: "The lighter and yellower, the more detections in that square. Each square is about 50 km wide. Zoom in to see each point.",
    s3t: "Heat is not always a fire",
    s3b: "That is why we say “detections”: the satellite sees heat but not its cause.",
    gotIt: "Got it, explore the map",
    dontShow: "Don't show again",
    loading: "Loading…",
    errorTitle: "We couldn't load the data",
    retry: "Try again",
    truncated: "Showing the first {n}. Zoom in to see more.",
    nav: { map: "Map", compare: "Compare", help: "How to read" },
  },
} as const;

type Dict = (typeof dict)["pt"];
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict; fmt: (s: string, v: Record<string, string | number>) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");
  useEffect(() => {
    try {
      const l = localStorage.getItem("lang");
      // Ler o localStorage só depois da hidratação evita diferenças servidor/cliente.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (l === "pt" || l === "en") setLangState(l);
    } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
    document.documentElement.lang = l;
  };
  const fmt = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
  return <LangCtx.Provider value={{ lang, setLang, t: dict[lang] as unknown as Dict, fmt }}>{children}</LangCtx.Provider>;
}

export const useLang = () => {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang fora do LangProvider");
  return c;
};
