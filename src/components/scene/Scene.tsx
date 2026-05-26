import * as React from "react";
import SceneAtmosphere from "./SceneAtmosphere";

interface SceneProps {
  /** 0..1 crisis level driving the ambient backdrop. */
  danger: number;
  children: React.ReactNode;
}

/**
 * The full-bleed stage. A danger-reactive atmosphere fills the viewport behind a centred,
 * max-width playfield column that hosts every screen. The playfield is `overflow: visible` so a
 * committed card can fly off the column into the surrounding scene.
 */
function Scene({ danger, children }: SceneProps) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#050608]">
      <SceneAtmosphere danger={danger} />
      <div className="absolute inset-y-0 left-1/2 z-10 w-full max-w-[480px] -translate-x-1/2 overflow-visible">
        {children}
      </div>
    </div>
  );
}

export default Scene;
