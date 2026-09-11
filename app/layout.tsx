import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "FranAPP · Meriendas",
  description: "30 recetas para la escuela, la danza y los ratos en casa. Elegí, cociná y organizá tus meriendas.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "FranAPP", statusBarStyle: "default" },
  icons: { icon: "/favicon.svg", apple: "/icon-192.png" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f3eadc" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR"><body>{children}</body></html>;
}
