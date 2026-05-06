import { useState } from "react";

export function HelloMode(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-aura-arc/80">
        placeholder mode
      </p>
      <h2 className="font-display text-4xl font-semibold sm:text-5xl">hello from mode</h2>
      <p className="max-w-md text-sm text-slate-300">
        This stub proves the Launcher → Mode → back wiring works. Mana Hands replaces it in Phase
        2.
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-full border border-aura-arc/40 bg-ink-700/60 px-6 py-3 font-mono text-sm text-aura-arc shadow-glow shadow-aura-arc/30 transition hover:bg-ink-600/80"
      >
        clicked {count} {count === 1 ? "time" : "times"}
      </button>
    </div>
  );
}
