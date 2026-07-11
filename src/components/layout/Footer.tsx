import { Container } from "@/components/layout/Container";
import { SITE_CONFIG } from "@/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground md:flex-row">
        <p>
          © {year} {SITE_CONFIG.name}. All rights reserved.
        </p>
        <p>Built with Next.js &amp; Supabase.</p>
      </Container>
    </footer>
  );
}
