import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--bg-main)" }}>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
