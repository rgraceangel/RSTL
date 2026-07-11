import type { SiteConfig } from "@/types";

export const SITE_CONFIG: SiteConfig = {
  name: "App",
  description: "A production-ready Next.js application.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  navItems: [
    { label: "Home", href: "/" },
    { label: "Play", href: "/#play" },
    { label: "Winners", href: "/#winners" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
