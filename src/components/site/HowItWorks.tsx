"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { HOW_IT_WORKS_STEPS } from "@/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border py-20">
      <Container>
        <SectionHeading
          eyebrow="The Method"
          title="How the Experiment Works"
          subtitle="Four steps stand between you and a live prize."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.25, delay: index * 0.08 }}
              className="rounded-lg border border-border bg-secondary/40 p-6"
            >
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
