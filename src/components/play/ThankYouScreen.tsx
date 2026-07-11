"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PartyPopper, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ThankYouScreenProps {
  prizeName: string;
  onPlayAgain: () => void;
}

/** Final "Thank You" screen -- confirms the claim was received and offers a fresh run through the engine. */
export function ThankYouScreen({ prizeName, onPlayAgain }: ThankYouScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PartyPopper className="h-7 w-7" />
      </span>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thank You!</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Your claim for <span className="font-medium text-foreground">{prizeName}</span> has been received. An
          admin will follow up using the contact info you provided.
        </p>
      </div>

      <Button onClick={onPlayAgain} size="lg" className="gap-2">
        <RotateCw className="h-4 w-4" />
        Play Again
      </Button>

      <Link href="/" className="text-sm font-medium text-primary underline underline-offset-4">
        Back to home
      </Link>
    </motion.div>
  );
}
