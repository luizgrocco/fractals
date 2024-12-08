/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Mesh, Object3D, Vector3 } from "three";
import { Button } from "../ui/button";
import { Html } from "@react-three/drei";
import { useControlsStore } from "@/store/controls";
import { useThree } from "@react-three/fiber";

const direction = new Vector3(0, 0, 0);

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

const translate = (object: Object3D, scaling: number) => {
  object.getWorldDirection(direction);
  direction.multiplyScalar(1 * scaling);
  object.position.add(direction);
};

export const Debug: React.FC = () => {
  const { scene } = useThree();
  const cube = useRef<Mesh>(null);
  const [scaling, setScaling] = useState(1);

  const [smallCubeScale] = useControlsStore((state) => state.smallCubeScale);

  useEffect(() => {
    cube.current!.lookAt(1, 0, 0);
  }, []);

  return (
    <>
      <mesh ref={cube as any}>
        {/* <arrowHelper
          args={[undefined, undefined, undefined, undefined, undefined, 0.2]}
        /> */}
        <boxGeometry />
        <meshBasicMaterial color={0x00ff00} />
      </mesh>
      <Html>
        <div className="absolute top-[-420px] left-[-610px] z-10 flex flex-col w-[500px]">
          <div>
            <Button
              className="w-[45px]"
              onClick={() => cube.current!.rotateX(degreesToRadians(-90))}
            >
              ↑
            </Button>
            <Button
              className="w-[45px]"
              onClick={() => cube.current!.rotateX(degreesToRadians(90))}
            >
              ↓
            </Button>
          </div>
          <div>
            <Button
              className="w-[45px]"
              onClick={() => cube.current!.rotateY(degreesToRadians(-90))}
            >
              ←
            </Button>
            <Button
              className="w-[45px]"
              onClick={() => cube.current!.rotateY(degreesToRadians(90))}
            >
              →
            </Button>
          </div>
          <div>
            <Button
              className="w-[70px]"
              onClick={() => {
                translate(cube.current!, scaling);
              }}
            >
              translate
            </Button>

            <Button
              className="w-[70px]"
              onClick={() => {
                cube.current!.updateMatrix();
                cube.current!.updateMatrixWorld();
                const newCube = cube.current!.clone();
                scene.add(newCube as any);
                translate(cube.current!, scaling);
              }}
            >
              place
            </Button>
          </div>

          <div className="flex">
            <Button
              className="w-[70px]"
              onClick={() => {
                cube.current!.scale.multiplyScalar(smallCubeScale);
                setScaling((scale) => scale * smallCubeScale);
              }}
            >
              Scale ▽
            </Button>

            <Button
              className="w-[70px]"
              onClick={() => {
                cube.current!.scale.multiplyScalar(1 / smallCubeScale);
                setScaling((scale) => scale / smallCubeScale);
              }}
            >
              Scale △
            </Button>
          </div>

          <div className="flex">
            <Button
              className="w-[70px]"
              onClick={() => {
                setScaling((scale) => scale / 2);
              }}
            >
              Scale 1/2
            </Button>

            <Button
              className="w-[70px]"
              onClick={() => {
                setScaling((scale) => scale * 2);
              }}
            >
              Scale 2
            </Button>
          </div>
        </div>
      </Html>
    </>
  );
};
