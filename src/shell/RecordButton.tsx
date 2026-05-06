export function RecordButton(): JSX.Element {
  return (
    <button
      type="button"
      disabled
      aria-label="Record clip (coming in Phase 4)"
      title="Recording lands in Phase 4"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-500/70 bg-ink-700/60 text-aura-ember/70 transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className="block h-2.5 w-2.5 rounded-full bg-aura-ember/80 shadow-glow shadow-aura-ember/60"
      />
    </button>
  );
}
