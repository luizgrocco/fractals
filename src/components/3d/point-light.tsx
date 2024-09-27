import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { SpotLightHelper } from "three";

export const PointLight: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lightRef = useRef<any>(null);
  useHelper(lightRef, SpotLightHelper, "red");

  return (
    <spotLight
      ref={lightRef}
      position={[100, -10, -50]}
      intensity={2}
      castShadow
      decay={0}
    />
  );
};
