"use client";

import { useState, useEffect } from "react";
import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ExcalidrawViewerProps {
  scene: ExcalidrawInitialDataState;
  title: string;
}

export default function ExcalidrawViewer({ scene, title }: ExcalidrawViewerProps) {
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import("@excalidraw/excalidraw").then((mod) => {
      setComp(() => mod.Excalidraw as any);
    });
  }, []);

  if (!Comp) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-gray-700 bg-gray-950">
        <div className="text-gray-400">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700">
      <div className="border-b border-gray-700 bg-gray-900 px-4 py-2">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div style={{ height: 500 }}>
        <Comp
          initialData={scene}
          viewModeEnabled={true}
          zenModeEnabled={true}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              clearCanvas: false,
              export: false,
              loadScene: false,
              saveToActiveFile: false,
            },
          }}
        />
      </div>
    </div>
  );
}