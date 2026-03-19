import { Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { UnlimitedString } from "./unlimited-string";

export class Turtle {
  length: number;
  angle: number;
  cubeScale: number;

  constructor(length: number, angle: number, cubeScale: number) {
    this.length = length;
    this.angle = angle;
    this.cubeScale = cubeScale;
  }

  render(sentence: UnlimitedString) {
    // Final array of transformations
    const transformations: Matrix4[] = [];
    // The object that acts as a turtle, walking in the direction it is facing
    const current = new Object3D();
    current.scale.multiplyScalar(this.length);
    // Face the X axis to start
    current.lookAt(1, 0, 0);

    // Stack of object transformations to be saved and restored
    const stack: Matrix4[] = [];

    // Intermediary direction Vector3
    const direction = new Vector3(0, 0, 0);

    const translate = (object: Object3D) => {
      // This is a copy operation, copies object world direction into the direction Vector3
      object.getWorldDirection(direction);
      // Multiply the direction Vector3 by the Lsystem length
      direction.multiplyScalar(this.length * object.scale.x);
      // Add the direction Vector3 to the object position, meaning it moves in the direction it is facing
      object.position.add(direction);
    };

    // Convert degrees to radians
    const angleInRadians = (this.angle * Math.PI) / 180;

    for (const char of sentence) {
      switch (char) {
        case "◼":
          current.updateMatrix();
          transformations.push(current.matrix.clone());
          translate(current);
          break;
        case "◻":
          translate(current);
          break;
        case "↓":
        case "D":
          current.rotateX(angleInRadians);
          break;
        case "↑":
        case "U":
          current.rotateX(-angleInRadians);
          break;
        case "←":
        case "<":
        case "-":
        case "L":
          current.rotateY(-angleInRadians);
          break;
        case "→":
        case ">":
        case "+":
        case "R":
          current.rotateY(angleInRadians);
          break;
        case "⟲":
          current.rotateY(-angleInRadians * 2);
          break;
        case "⟳":
          current.rotateY(angleInRadians * 2);
          break;
        case "[":
          current.updateMatrix();
          stack.push(current.matrix.clone());
          break;
        case "]":
          current.matrix.copy(stack.pop()!);
          current.matrix.decompose(
            current.position,
            current.quaternion,
            current.scale
          );
          current.updateMatrixWorld();
          break;
        case "½":
          current.scale.multiplyScalar(0.5);
          break;
        case "②":
          current.scale.multiplyScalar(2);
          break;
        case "▽":
          current.scale.multiplyScalar(this.cubeScale);
          break;
        case "△":
          current.scale.multiplyScalar(1 / this.cubeScale);
          break;
        default:
          throw new Error(`Unrecognized character ${char}`);
      }
    }

    return transformations;
  }

  static normalize(transformations: Matrix4[]): void {
    if (transformations.length <= 1) return;

    const pos = new Vector3();
    const quat = new Quaternion();
    const scl = new Vector3();

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (const m of transformations) {
      m.decompose(pos, quat, scl);
      const halfExtent = scl.x / 2;
      minX = Math.min(minX, pos.x - halfExtent);
      minY = Math.min(minY, pos.y - halfExtent);
      minZ = Math.min(minZ, pos.z - halfExtent);
      maxX = Math.max(maxX, pos.x + halfExtent);
      maxY = Math.max(maxY, pos.y + halfExtent);
      maxZ = Math.max(maxZ, pos.z + halfExtent);
    }

    const extentX = maxX - minX;
    const extentY = maxY - minY;
    const extentZ = maxZ - minZ;
    const maxExtent = Math.max(extentX, extentY, extentZ);
    if (maxExtent === 0) return;

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const scale = 1 / maxExtent;

    for (const m of transformations) {
      m.decompose(pos, quat, scl);
      pos.set(
        (pos.x - centerX) * scale,
        (pos.y - centerY) * scale,
        (pos.z - centerZ) * scale
      );
      scl.multiplyScalar(scale);
      m.compose(pos, quat, scl);
    }
  }
}
