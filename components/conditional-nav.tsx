"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";

export function ConditionalNav() {
  const pathname = usePathname() || "";

  // Hide the dashboard nav on the onboarding/welcome route
  if (pathname.startsWith("/welcome")) return null;

  return <DashboardNav />;
}

export default ConditionalNav;
