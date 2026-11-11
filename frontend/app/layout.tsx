import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Providers } from "./providers";

const urbanist = Urbanist({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-urbanist" });

export const metadata: Metadata = {
  title: "FOCAFIRE — Detecções de calor em Angola",
  description: "Veja onde os satélites MODIS e VIIRS detectaram calor em Angola.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#201B18" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={urbanist.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
