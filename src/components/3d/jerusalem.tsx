import { LSystem } from "@/models/lsystem";
import { Turtle } from "@/models/turtle";
import { UnlimitedString } from "@/models/unlimited-string";
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

const LSYSTEM_DATA = {
  axiom: "◼",
  rules: {
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
} as const;

const lsystem = new LSystem(LSYSTEM_DATA.axiom, LSYSTEM_DATA.rules);

export const JesuralemCube: React.FC = () => {
  const instancedMeshRef = useRef<InstancedMesh>(null);
  const [colorMap, metalnessMap, roughnessMap] = useLoader(TextureLoader, [
    "base_color.jpg",
    "metallic.jpg",
    "roughness.jpg",
  ]);
  const [generations] = useControlsStore((state) => state.generations);
  const [smallCubeScale] = useControlsStore((state) => state.smallCubeScale);

  const sentence = useMemo(() => {
    lsystem.reset();
    let acc = new UnlimitedString();
    for (let i = 0; i < generations; i++) {
      acc = lsystem.generate();
    }

    return acc;
  }, [generations]);

  const transformations = useMemo(() => {
    const turtle = new Turtle(
      LSYSTEM_DATA.length,
      LSYSTEM_DATA.angleInDegrees,
      smallCubeScale
    );

    const result = turtle.render(sentence);
    Turtle.normalize(result);
    return result;
  }, [sentence, smallCubeScale]);

  useEffect(() => {
    for (let i = 0; i < transformations.length; i++) {
      if (instancedMeshRef.current)
        instancedMeshRef.current.setMatrixAt(i, transformations[i]);
    }
    if (instancedMeshRef.current)
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [transformations]);

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, transformations.length]}
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
