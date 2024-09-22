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
    const transformations: Matrix4[] = [];
    const current = new Object3D();
    current.lookAt(1, 0, 0);

    const scalingStack: number[] = [];
    const stack: Matrix4[] = [];

    const direction = new Vector3(0, 0, 0);
    let scaling = this.length;

    const translate = (object: Object3D) => {
      object.getWorldDirection(direction);
      direction.multiplyScalar(this.length * scaling);
      object.position.add(direction);
    };

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
          scalingStack.push(scaling);
          break;
        case "]":
          current.matrix.copy(stack.pop()!);
          current.matrix.decompose(
            current.position,
            current.quaternion,
            current.scale
          );
          current.updateMatrixWorld();
          scaling = scalingStack.pop()!;
          break;
        case "½":
          scaling *= 0.5;
          break;
        case "②":
          scaling *= 2;
          break;
        case "▽":
          scaling *= this.cubeScale;
          current.scale.multiplyScalar(this.cubeScale);
          break;
        case "△":
          scaling *= 1 / this.cubeScale;
          current.scale.multiplyScalar(1 / this.cubeScale);
          break;
        default:
          throw new Error(`Unrecognized character ${char}`);
      }
    }

    return transformations;
  }
}
