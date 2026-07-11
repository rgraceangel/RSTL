"use client";

import { useContext } from "react";
import { AdminContext } from "@/components/providers/AdminProvider";

/** Access the signed-in admin's profile from within the /admin route tree. */
export function useAdmin() {
  const admin = useContext(AdminContext);

  if (!admin) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return admin;
}
