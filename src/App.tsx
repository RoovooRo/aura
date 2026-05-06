import { CameraProvider } from "@/core/camera/CameraProvider";
import { findMode } from "@/modes";
import { useAppStore } from "@/state/store";
import { Launcher } from "@/shell/Launcher";
import { ModeShell } from "@/shell/ModeShell";
import { TitleScreen } from "@/shell/TitleScreen";

export function App(): JSX.Element {
  return (
    <CameraProvider>
      <Screens />
    </CameraProvider>
  );
}

function Screens(): JSX.Element {
  const screen = useAppStore((s) => s.screen);
  const activeModeId = useAppStore((s) => s.activeModeId);
  const exitMode = useAppStore((s) => s.exitMode);

  if (screen === "title") return <TitleScreen />;
  if (screen === "launcher") return <Launcher />;

  const mode = findMode(activeModeId);
  if (!mode) {
    queueMicrotask(exitMode);
    return <Launcher />;
  }
  return <ModeShell mode={mode} />;
}
