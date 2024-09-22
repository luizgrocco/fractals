import { Matrix4, Object3D, Vector3 } from "three";

export class Turtle {
  length: number;
  angle: number;
  cubeScale: number;

  constructor(length: number, angle: number, cubeScale: number) {
    this.length = length;
    this.angle = angle;
    this.cubeScale = cubeScale;
  }

  render(sentence: string) {
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
}
