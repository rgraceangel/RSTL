"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ScienceBackground } from "@/components/site/ScienceBackground";
import { HOME_HERO } from "@/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24 sm:py-32">
      <ScienceBackground />

      <Container className="relative flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary"
        >
          {HOME_HERO.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl"
        >
          {HOME_HERO.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          {HOME_HERO.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={HOME_HERO.primaryCta.href}
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            {HOME_HERO.primaryCta.label}
          </a>
          <a
            href={HOME_HERO.secondaryCta.href}
            className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 text-base font-medium transition-colors hover:bg-muted"
          >
            {HOME_HERO.secondaryCta.label}
          </a>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="mt-16 text-muted-foreground"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </Container>
    </section>
  );
}
