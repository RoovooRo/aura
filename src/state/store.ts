import { create } from "zustand";

export type Screen = "title" | "launcher" | "mode";

export type CameraStatus = "idle" | "requesting" | "granted" | "denied" | "error";

export interface AppState {
  screen: Screen;
  activeModeId: string | null;
  cameraStatus: CameraStatus;
  cameraError: string | null;

  setScreen: (screen: Screen) => void;
  enterMode: (modeId: string) => void;
  exitMode: () => void;
  setCameraStatus: (status: CameraStatus, error?: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: "title",
  activeModeId: null,
  cameraStatus: "idle",
  cameraError: null,

  setScreen: (screen) => set({ screen }),
  enterMode: (modeId) => set({ screen: "mode", activeModeId: modeId }),
  exitMode: () => set({ screen: "launcher", activeModeId: null }),
  setCameraStatus: (status, error = null) => set({ cameraStatus: status, cameraError: error }),
}));
