import { modes } from "@/modes";
import { useAppStore } from "@/state/store";
import { ModeCard } from "./ModeCard";

export function Launcher(): JSX.Element {
  const enterMode = useAppStore((s) => s.enterMode);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-400">launcher</p>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-50">
          choose your aura
        </h2>
        <p className="max-w-2xl text-sm text-slate-300">
          Each mode is a self-contained visual-AI experience. Hover for details, click to enter.
        </p>
      </header>

      <section
        aria-label="Available modes"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {modes.map((mode) => (
          <ModeCard key={mode.id} mode={mode} onSelect={enterMode} />
        ))}
      </section>
    </main>
  );
}
