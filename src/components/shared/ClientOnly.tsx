"use client";

import type { ReactNode } from "react";
import { useIsClient } from "usehooks-ts";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useIsClient();
  return isClient ? children : fallback;
}
