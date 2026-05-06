import type { ComponentType } from "react";

export type TrackerKind = "hand-landmarker" | "face-landmarker" | "selfie-segmentation";

export interface Mode {
  id: string;
  name: string;
  tagline: string;
  longDescription: string;
  thumbnailUrl: string;
  accentColor: string;
  requires: TrackerKind[];
  Component: ComponentType;
}
