import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "./store";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState({
      screen: "title",
      activeModeId: null,
      cameraStatus: "idle",
      cameraError: null,
    });
  });

  it("starts on the title screen with no active mode", () => {
    const state = useAppStore.getState();
    expect(state.screen).toBe("title");
    expect(state.activeModeId).toBeNull();
  });

  it("enterMode sets screen=mode and remembers the id", () => {
    useAppStore.getState().enterMode("hello");
    const state = useAppStore.getState();
    expect(state.screen).toBe("mode");
    expect(state.activeModeId).toBe("hello");
  });

  it("exitMode clears the active mode and returns to launcher", () => {
    useAppStore.getState().enterMode("hello");
    useAppStore.getState().exitMode();
    const state = useAppStore.getState();
    expect(state.screen).toBe("launcher");
    expect(state.activeModeId).toBeNull();
  });

  it("setCameraStatus stores status and clears error by default", () => {
    useAppStore.getState().setCameraStatus("denied", "user rejected");
    expect(useAppStore.getState().cameraError).toBe("user rejected");
    useAppStore.getState().setCameraStatus("granted");
    expect(useAppStore.getState().cameraError).toBeNull();
  });
});
