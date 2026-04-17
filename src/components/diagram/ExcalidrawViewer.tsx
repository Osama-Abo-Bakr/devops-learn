"use client";

import { useState, useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ExcalidrawViewerProps {
  scene: any;
  title: string;
}

export default function ExcalidrawViewer({ scene, title }: ExcalidrawViewerProps) {
  const [Excalidraw, setExcalidraw] = useState<React.ComponentType<any> | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load CSS dynamically
    if (!document.getElementById("excalidraw-css")) {
      const link = document.createElement("link");
      link.id = "excalidraw-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.18.0/dist/prod/index.css";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }

    import("@excalidraw/excalidraw").then((mod) => {
      setExcalidraw(() => mod.Excalidraw);
      setLoaded(true);
    });
  }, []);

  if (!loaded || !Excalidraw) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-gray-700 bg-gray-950">
        <div className="text-gray-400">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700" style={{ height: 540 }}>
      <div className="border-b border-gray-700 bg-gray-900 px-4 py-2">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div style={{ height: 500 }}>
        <Excalidraw
          initialData={{
            ...scene,
            scrollToContent: true,
          }}
          viewModeEnabled={true}
          zenModeEnabled={false}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              clearCanvas: false,
              export: false,
              loadScene: false,
              saveToActiveFile: false,
            },
          }}
          gridModeEnabled={false}
        />
      </div>
    </div>
  );
}