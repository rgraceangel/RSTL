import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/layout/Container";
import { SoundProvider } from "@/components/providers/SoundProvider";
import { SoundToggle } from "@/components/play/SoundToggle";

/**
 * Chrome-free route group for the real player experience -- deliberately
 * skips `MainLayout` (no marketing Navbar/Footer), mirroring how `(auth)`
 * already has its own minimal shell. `SoundProvider` is mounted here, not in
 * the root layout, since sound is a player-experience concern only
 * (PROJECT_SPEC Section 15).
 */
export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <SoundProvider>
      <div className="flex min-h-screen flex-col bg-muted/20">
        <header className="border-b border-border">
          <Container className="flex h-16 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
              <SoundToggle />
            </div>
          </Container>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>
      </div>
    </SoundProvider>
  );
}
