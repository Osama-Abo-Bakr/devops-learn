"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ContainerNode from "./nodes/ContainerNode";
import PodNode from "./nodes/PodNode";
import ServiceNode from "./nodes/ServiceNode";
import VolumeNode from "./nodes/VolumeNode";
import NetworkNode from "./nodes/NetworkNode";
import DataFlowEdge from "./edges/DataFlowEdge";
import VolumeMountEdge from "./edges/VolumeMountEdge";
import NetworkEdge from "./edges/NetworkEdge";
import type { DiagramConfig } from "@/types";

const nodeTypes = {
  container: ContainerNode,
  pod: PodNode,
  service: ServiceNode,
  volume: VolumeNode,
  network: NetworkNode,
};

const edgeTypes = {
  dataFlow: DataFlowEdge,
  volumeMount: VolumeMountEdge,
  network: NetworkEdge,
};

interface DiagramCanvasProps {
  config: DiagramConfig;
}

export default function DiagramCanvas({ config }: DiagramCanvasProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: Node[] = config.nodes.map((n) => ({
    id: n.id,
    position: n.position,
    data: { ...n.data, type: n.data.type },
    type: n.data.type,
  }));

  const edges: Edge[] = config.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.data.type,
    data: e.data,
  }));

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const selectedNodeData = config.nodes.find((n) => n.id === selectedNode);

  return (
    <div className="flex h-[500px] overflow-hidden rounded-lg border border-gray-700">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          fitView
          className="bg-gray-950"
        >
          <Background color="#374151" gap={20} />
          <Controls className="bg-gray-800 [&>button]:bg-gray-800 [&>button]:text-white [&>button]:border-gray-700" />
        </ReactFlow>
      </div>

      {selectedNodeData && selectedNodeData.data.details && (
        <div className="w-64 shrink-0 border-l border-gray-700 bg-gray-900 p-4">
          <h4 className="mb-2 font-semibold text-white">
            {selectedNodeData.data.label}
          </h4>
          {selectedNodeData.data.details.description && (
            <p className="mb-2 text-sm text-gray-400">
              {selectedNodeData.data.details.description}
            </p>
          )}
          {selectedNodeData.data.details.image && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Image:</span>{" "}
              <code className="text-xs text-blue-400">
                {selectedNodeData.data.details.image}
              </code>
            </div>
          )}
          {selectedNodeData.data.details.ports && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Ports:</span>{" "}
              <code className="text-xs text-green-400">
                {selectedNodeData.data.details.ports.join(", ")}
              </code>
            </div>
          )}
          {selectedNodeData.data.details.env && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Environment:</span>
              <pre className="mt-1 text-xs text-gray-300">
                {Object.entries(selectedNodeData.data.details.env)
                  .map(([k, v]) => `${k}=${v}`)
                  .join("\n")}
              </pre>
            </div>
          )}
          {selectedNodeData.data.details.config && (
            <div>
              <span className="text-xs text-gray-500">Config:</span>
              <pre className="mt-1 text-xs text-gray-300">
                {Object.entries(selectedNodeData.data.details.config)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("\n")}
              </pre>
            </div>
          )}
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-4 text-xs text-gray-500 hover:text-white"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}