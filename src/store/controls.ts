import { create } from "zustand";

type ControlsState = {
  generations: number[];
  smallCubeScale: number[];
};

type ControlsActions = {
  setGenerations: (newGenerations: ControlsState["generations"]) => void;
  setSmallCubeScale: (
    newSmallCubeScale: ControlsState["smallCubeScale"]
  ) => void;
};

export const useControlsStore = create<ControlsState & ControlsActions>(
  (set) => ({
    generations: [1],
    setGenerations: (newGenerations) =>
      set(() => ({ generations: newGenerations })),
    smallCubeScale: [0.5],
    setSmallCubeScale: (newSmallCubeScale) =>
      set(() => ({
        smallCubeScale: newSmallCubeScale,
      })),
  })
);
