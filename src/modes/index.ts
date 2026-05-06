import type { Mode } from "@/core/types";
import { helloMode } from "./hello";

export const modes: Mode[] = [helloMode];

export function findMode(id: string | null): Mode | null {
  if (!id) return null;
  return modes.find((m) => m.id === id) ?? null;
}
