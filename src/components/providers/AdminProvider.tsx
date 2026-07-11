"use client";

import { createContext } from "react";
import type { AdminProfile } from "@/types";

export const AdminContext = createContext<AdminProfile | undefined>(undefined);

export function AdminProvider({
  admin,
  children,
}: {
  admin: AdminProfile;
  children: React.ReactNode;
}) {
  return <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>;
}
