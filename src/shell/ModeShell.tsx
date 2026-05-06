import { useEffect, useState } from "react";
import type { Mode } from "@/core/types";
import { useAppStore } from "@/state/store";
import { RecordButton } from "./RecordButton";
import { SettingsPanel } from "./SettingsPanel";

interface ModeShellProps {
  mode: Mode;
}

export function ModeShell({ mode }: ModeShellProps): JSX.Element {
  const exitMode = useAppStore((s) => s.exitMode);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        if (settingsOpen) setSettingsOpen(false);
        else exitMode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exitMode, settingsOpen]);

  const Mode = mode.Component;

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-6 py-4">
        <button
          type="button"
          onClick={exitMode}
          aria-label="Back to launcher"
          className="flex items-center gap-2 rounded-full border border-ink-500/70 bg-ink-700/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-slate-200 transition hover:bg-ink-600"
        >
          <span aria-hidden="true">←</span>
          <span>back</span>
        </button>

        <div className="flex flex-col items-center">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: mode.accentColor }}
          >
            now playing
          </span>
          <span className="font-display text-sm font-semibold text-slate-100">{mode.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <RecordButton />
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-500/70 bg-ink-700/60 text-slate-200 transition hover:bg-ink-600"
          >
            <span aria-hidden="true">⚙</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <Mode />
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
