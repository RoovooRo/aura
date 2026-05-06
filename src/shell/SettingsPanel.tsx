interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps): JSX.Element | null {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-900/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-ink-500/60 bg-ink-700/90 p-6 shadow-glow shadow-black/60">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
              settings
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-slate-50">coming soon</h3>
            <p className="mt-2 text-sm text-slate-300">
              Mirror toggle, audio volume, particle intensity, and camera selector arrive in
              Phase 4.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-full border border-ink-500 px-3 py-1 font-mono text-xs text-slate-300 hover:bg-ink-600"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}
