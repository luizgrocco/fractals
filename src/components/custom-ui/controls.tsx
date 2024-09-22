import React from "react";
import { Slider } from "../ui/slider";
import { useControlsStore } from "@/store/controls";

export const Controls: React.FC = () => {
  const generations = useControlsStore((state) => state.generations);
  const setGenerations = useControlsStore((state) => state.setGenerations);

  const smallCubeScale = useControlsStore((state) => state.smallCubeScale);
  const setSmallCubeScale = useControlsStore(
    (state) => state.setSmallCubeScale
  );

  const handleGenerationSlide = (value: number[]) => {
    setGenerations(value);
  };

  const handleSmallCubeSlide = (value: number[]) => {
    setSmallCubeScale(value);
  };

  return (
    <>
      <div className="absolute left-[100px] z-10 w-fit flex flex-col">
        <div className="flex gap-2">
          <Slider
            value={generations}
            onValueChange={handleGenerationSlide}
            max={10}
            min={0}
            step={1}
            className="w-[200px]"
          />
          Generations ({generations})
        </div>

        <div className="flex gap-2">
          <Slider
            dir="ltr"
            value={smallCubeScale}
            onValueChange={handleSmallCubeSlide}
            max={1}
            min={0.1}
            step={0.05}
            className="w-[200px]"
          />
          Small Cube Scale ({smallCubeScale})
        </div>
      </div>
    </>
  );
};
