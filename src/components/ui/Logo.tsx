import Link from "next/link";
import { SITE_CONFIG } from "@/constants";

export function Logo() {
  return (
    <Link href="/" className="text-lg font-semibold tracking-tight">
      {SITE_CONFIG.name}
    </Link>
  );
}
