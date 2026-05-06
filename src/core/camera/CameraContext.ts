import { createContext, useContext, type RefObject } from "react";

export interface CameraContextValue {
  stream: MediaStream | null;
  videoRef: RefObject<HTMLVideoElement>;
  requestCamera: () => Promise<MediaStream | null>;
  releaseCamera: () => void;
}

export const CameraContext = createContext<CameraContextValue | null>(null);

export function useCamera(): CameraContextValue {
  const ctx = useContext(CameraContext);
  if (!ctx) throw new Error("useCamera must be used inside <CameraProvider>");
  return ctx;
}
