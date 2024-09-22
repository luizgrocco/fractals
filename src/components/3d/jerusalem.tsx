import { Axiom, LSystem, Rules } from "@/models/lsystem";
import { Turtle } from "@/models/turtle";
import { useControlsStore } from "@/store/controls";
import { useLoader } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { InstancedMesh, TextureLoader } from "three";

// Jesuralem Cube LSYSTEM DATA
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

export const JesuralemCube: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instancedMeshRef: any = useRef<InstancedMesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [colorMap, metalnessMap, roughnessMap]: any = useLoader(TextureLoader, [
    "base_color.jpg",
    "metallic.jpg",
    "roughness.jpg",
  ]);
  const [generations] = useControlsStore((state) => state.generations);
  const [smallCubeScale] = useControlsStore((state) => state.smallCubeScale);

  const sentence = useMemo(() => {
    lsystem.reset();
    let acc = "";
    for (let i = 0; i < generations; i++) {
      acc = lsystem.generate();
    }

    return acc;
  }, [generations]);

  const arrayOfMatrices = useMemo(() => {
    const turtle = new Turtle(
      LSYSTEM_DATA.length,
      LSYSTEM_DATA.angleInDegrees,
      smallCubeScale
    );

    return turtle.render(sentence);
  }, [sentence, smallCubeScale]);

  useEffect(() => {
    for (let i = 0; i < arrayOfMatrices.length; i++) {
      if (instancedMeshRef.current)
        instancedMeshRef.current.setMatrixAt(i, arrayOfMatrices[i]);
    }
    // Update the instance
    if (instancedMeshRef.current)
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [arrayOfMatrices]);

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, arrayOfMatrices.length]}
    >
      <boxGeometry
        args={[LSYSTEM_DATA.length, LSYSTEM_DATA.length, LSYSTEM_DATA.length]}
      />
      <meshStandardMaterial
        map={colorMap}
        metalnessMap={metalnessMap}
        roughnessMap={roughnessMap}
      />
    </instancedMesh>
  );
};
