import { useCamera } from "@/core/camera/CameraContext";
import { useAppStore } from "@/state/store";

export function TitleScreen(): JSX.Element {
  const { requestCamera } = useCamera();
  const cameraStatus = useAppStore((s) => s.cameraStatus);
  const cameraError = useAppStore((s) => s.cameraError);
  const setScreen = useAppStore((s) => s.setScreen);

  const handleEnter = async (): Promise<void> => {
    const stream = await requestCamera();
    if (stream) setScreen("launcher");
  };

  const denied = cameraStatus === "denied";
  const errored = cameraStatus === "error";
  const requesting = cameraStatus === "requesting";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-400">
            visual-ai playground
          </p>
          <h1 className="aura-gradient-text font-display text-7xl font-bold tracking-tight sm:text-8xl">
            aura
          </h1>
          <p className="max-w-md text-sm text-slate-300">
            Pick an aura, become it. A webcam playground of hand-tracked superpowers, face morphs,
            and more.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void handleEnter();
          }}
          disabled={requesting}
          aria-label="Grant camera access and enter Aura"
          className="group relative inline-flex items-center gap-3 rounded-full border border-aura-gold/40 bg-ink-700/60 px-8 py-4 font-display text-base font-semibold tracking-wide text-aura-gold shadow-glow shadow-aura-gold/30 transition hover:bg-ink-600/80 hover:shadow-aura-gold/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{requesting ? "requesting camera…" : "enter"}</span>
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </button>

        {(denied || errored) && (
          <div
            role="alert"
            className="max-w-md rounded-lg border border-aura-ember/40 bg-ink-700/70 p-4 text-left text-sm text-slate-200"
          >
            <p className="font-medium text-aura-ember">
              {denied ? "Camera permission denied" : "Camera unavailable"}
            </p>
            <p className="mt-1 text-slate-300">
              {denied
                ? "Aura is a webcam playground — it needs camera access to do anything. Open your browser site settings, allow camera for this site, then click Enter again."
                : (cameraError ?? "Something went wrong reaching the camera.")}
            </p>
          </div>
        )}

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
          works best on chrome / edge · webcam required
        </p>
      </div>
    </main>
  );
}
