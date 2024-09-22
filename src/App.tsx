import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stats,
} from "@react-three/drei";
import { JesuralemCube } from "./components/3d/jerusalem";
import { Controls } from "./components/custom-ui/controls";
import { Suspense } from "react";
import { LoadingSpinner } from "./components/ui/spinner";
// import { Debug } from "./components/3d/debug";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="bg-slate-400 w-full h-full flex justify-center items-center flex-col">
            <h1 className="text-3xl pb-3">Loading Assets ... </h1>
            <LoadingSpinner size={200} />
          </div>
        }
      >
        <Controls />
        <Canvas className="bg-slate-400">
          <PerspectiveCamera
            makeDefault
            position={[7, 5, 7]}
            near={0.1}
            far={1000}
          />
          <Environment files="puresky_4k.exr" background />
          <ambientLight intensity={1} />
          <JesuralemCube />
          <Stats />
          <OrbitControls />
          <axesHelper args={[5]} />
          {/* <Debug /> */}
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
