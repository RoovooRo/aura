import type { Mode } from "@/core/types";

interface ModeCardProps {
  mode: Mode;
  onSelect: (id: string) => void;
}

export function ModeCard({ mode, onSelect }: ModeCardProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onSelect(mode.id)}
      aria-label={`Open ${mode.name}: ${mode.tagline}`}
      className="group relative flex h-64 flex-col justify-between overflow-hidden rounded-2xl border border-ink-500/60 bg-ink-700/50 p-6 text-left transition hover:-translate-y-0.5 hover:border-ink-500"
      style={{ ["--card-accent" as string]: mode.accentColor }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 transition group-hover:opacity-80"
        style={{
          background: `radial-gradient(120% 80% at 80% 0%, ${mode.accentColor}26 0%, transparent 60%)`,
        }}
      />
      <div className="relative flex items-center justify-between">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: mode.accentColor }}
        >
          mode · {mode.id}
        </span>
        <span
          aria-hidden="true"
          className="rounded-full border border-current px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest opacity-70"
          style={{ color: mode.accentColor }}
        >
          {mode.requires.length === 0 ? "stub" : mode.requires.length + " trkr"}
        </span>
      </div>

      <div className="relative flex flex-col gap-2">
        <h3 className="font-display text-2xl font-semibold text-slate-50">{mode.name}</h3>
        <p className="text-sm text-slate-300">{mode.tagline}</p>
        <p className="text-xs text-slate-400 opacity-0 transition group-hover:opacity-100">
          {mode.longDescription}
        </p>
      </div>
    </button>
  );
}
