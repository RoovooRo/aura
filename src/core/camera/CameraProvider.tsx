import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAppStore } from "@/state/store";
import { CameraContext, type CameraContextValue } from "./CameraContext";

export function CameraProvider({ children }: { children: ReactNode }): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const setCameraStatus = useAppStore((s) => s.setCameraStatus);

  const releaseCamera = useCallback(() => {
    setStream((current) => {
      current?.getTracks().forEach((t) => t.stop());
      return null;
    });
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraStatus("idle");
  }, [setCameraStatus]);

  const requestCamera = useCallback(async (): Promise<MediaStream | null> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("error", "Camera API not available in this browser.");
      return null;
    }
    setCameraStatus("requesting");
    try {
      const next = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      setStream(next);
      if (videoRef.current) {
        videoRef.current.srcObject = next;
        await videoRef.current.play().catch(() => {
          // Autoplay can be blocked; consumers can retry on user gesture.
        });
      }
      setCameraStatus("granted");
      return next;
    } catch (err) {
      const name = err instanceof Error ? err.name : "Error";
      const message = err instanceof Error ? err.message : "Unknown camera error";
      const status = name === "NotAllowedError" ? "denied" : "error";
      setCameraStatus(status, message);
      return null;
    }
  }, [setCameraStatus]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const value = useMemo<CameraContextValue>(
    () => ({ stream, videoRef, requestCamera, releaseCamera }),
    [stream, requestCamera, releaseCamera],
  );

  return (
    <CameraContext.Provider value={value}>
      {children}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0"
        style={{ transform: "scaleX(-1)" }}
      />
    </CameraContext.Provider>
  );
}
