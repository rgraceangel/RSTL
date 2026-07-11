"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { logoutAction } from "@/lib/auth/actions";

export function LogoutButton(props: Omit<ButtonProps, "onClick">) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-2"
      disabled={isPending}
      onClick={() => startTransition(() => logoutAction())}
      {...props}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      Log out
    </Button>
  );
}
