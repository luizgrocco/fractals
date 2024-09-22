/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mesh, Object3D, Vector3 } from "three";
import { Button } from "../ui/button";
import { Html } from "@react-three/drei";
import { useControlsStore } from "@/store/controls";
import { Axiom, LSystem, Rules } from "@/models/lsystem";
import { useThree } from "@react-three/fiber";

const MOVE_HALVES = "½▽◻△◻②";
const SQUARE_SIDES = 4;

const SMALLER_CUBES_CENTER_LAYER = "[◻→◻▽◼]→".repeat(SQUARE_SIDES);
const SMALLER_CUBES_UPPER_LOWER_LAYER = "[◻▽◼]→".repeat(SQUARE_SIDES);
const LARGER_CUBES_UPPER_LOWER_LAYER =
  `${MOVE_HALVES}→${MOVE_HALVES}→` + "◼▽◻△→".repeat(SQUARE_SIDES);

interface LSystemData {
  axiom: Axiom;
  rules: Rules;
  angleInDegrees: number;
  length: number;
}

const LSYSTEM_DATA: LSystemData = {
  axiom: "◼",
  rules: {
    // Alphabet:
    //
    // ←: left
    // →: right
    // ↑: up
    // ↓: down
    // ⟲ or ⟳: reverse direction (turn 180°)
    // ◼: draw a box and move
    // ◻: just move (without drawing a box)
    // ▽: decrease scale by the given cube scale factor
    // △: increase scale by the given cube scale factor
    // ½: decrease scale by a factor of 2
    // ②: increase scale by a factor of 2
    // [: save current transformation state (in stack)
    // ]: restore previous transformation state (from stack)
    //
    "◼": `
      [${SMALLER_CUBES_CENTER_LAYER}]
      [↑◻↓ ${SMALLER_CUBES_UPPER_LOWER_LAYER}]
      [↑${MOVE_HALVES}↓ ${LARGER_CUBES_UPPER_LOWER_LAYER}]
      [↓◻↑ ${SMALLER_CUBES_UPPER_LOWER_LAYER}]
      [↓${MOVE_HALVES}↑ ${LARGER_CUBES_UPPER_LOWER_LAYER}]
      ◻◻▽◻△
    `,
    "◻": `◻◻▽◻△`,
  },
  angleInDegrees: 90,
  length: 1,
};

const lsystem = new LSystem(LSYSTEM_DATA.axiom, LSYSTEM_DATA.rules);

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

  const [generations] = useControlsStore((state) => state.generations);
  const [smallCubeScale] = useControlsStore((state) => state.smallCubeScale);

  const sentence = useMemo(() => {
    lsystem.reset();
    let acc = "";
    for (let i = 0; i < generations; i++) {
      acc = lsystem.generate();
    }
    console.log(acc);

    return acc;
  }, [generations]);

  useEffect(() => {
    cube.current!.lookAt(1, 0, 0);
  }, []);

  return (
    <>
      <mesh ref={cube as any}>
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
