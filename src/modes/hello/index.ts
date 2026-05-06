import type { Mode } from "@/core/types";
import { HelloMode } from "./HelloMode";

export const helloMode: Mode = {
  id: "hello",
  name: "Hello",
  tagline: "Wiring check — replaced in Phase 2.",
  longDescription:
    "A placeholder mode that proves the launcher, mode shell, and back navigation are wired up end-to-end. Removed when Mana Hands ships.",
  thumbnailUrl: "",
  accentColor: "#5ad7ff",
  requires: [],
  Component: HelloMode,
};
