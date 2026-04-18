"use client";

import { useRef } from "react";
import * as d3 from "d3";
import type { DiagramConfig, DiagramNodeType } from "@/types";
import { useD3Renderer } from "./useD3Renderer";

interface D3TreeLayoutProps {
  config: DiagramConfig;
}

const TYPE_COLORS: Record<DiagramNodeType, string> = {
  container: "#06b6d4",
  service: "#3b82f6",
  network: "#f59e0b",
  volume: "#22c55e",
  pod: "#a855f7",
  layer: "#6366f1",
  pipeline: "#ec4899",
  security: "#f43f5e",
  ingress: "#f97316",
  config: "#8b5cf6",
  stage: "#14b8a6",
  groupZone: "#6b7280",
};

interface HierarchyNode {
  id: string;
  label: string;
  type: DiagramNodeType;
  children?: HierarchyNode[];
}

export default function D3TreeLayout({ config }: D3TreeLayoutProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useD3Renderer({
    svgRef,
    renderFn: (selection, width, height) => {
      selection.selectAll("*").remove();

      const nodes = config.nodes;
      const edges = config.edges;
      if (nodes.length === 0) return;

      // Find root: node with no incoming edges, or first node
      const targetIds = new Set(edges.map((e) => e.target));
      const rootId =
        nodes.find((n) => !targetIds.has(n.id))?.id ?? nodes[0].id;

      // Build adjacency list
      const childrenOf: Record<string, string[]> = {};
      nodes.forEach((n) => {
        childrenOf[n.id] = [];
      });
      edges.forEach((e) => {
        if (childrenOf[e.source]) {
          childrenOf[e.source].push(e.target);
        }
      });

      // Convert to hierarchy (BFS to handle possible DAGs — each node appears once)
      const visited = new Set<string>();
      function buildHierarchy(nodeId: string): HierarchyNode | null {
        if (visited.has(nodeId)) return null;
        visited.add(nodeId);
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return null;
        const children = childrenOf[nodeId]
          .map(buildHierarchy)
          .filter(Boolean) as HierarchyNode[];
        return {
          id: node.id,
          label: node.data.label,
          type: node.data.type,
          children: children.length > 0 ? children : undefined,
        };
      }

      const hierarchyData = buildHierarchy(rootId);

      // Add any unvisited nodes as additional roots
      const unvisitedNodes = nodes.filter((n) => !visited.has(n.id));
      let rootData: HierarchyNode;
      if (unvisitedNodes.length > 0 && hierarchyData) {
        rootData = {
          id: "__root__",
          label: "",
          type: "groupZone",
          children: [
            hierarchyData,
            ...unvisitedNodes.map((n) => ({
              id: n.id,
              label: n.data.label,
              type: n.data.type,
            })),
          ],
        };
      } else if (hierarchyData) {
        rootData = hierarchyData;
      } else {
        return;
      }

      // D3 hierarchy
      const root = d3.hierarchy<HierarchyNode>(rootData);
      const treeLayout = d3
        .tree<HierarchyNode>()
        .size([width - 80, height - 80])
        .separation(() => 1.5);
      treeLayout(root);

      // Offset root to center
      root.each((node) => {
        if (node.x !== undefined) node.x += 40;
        if (node.y !== undefined) node.y += 40;
      });

      const g = selection.append("g");

      // Link generator (vertical — top to bottom)
      const linkGenerator = d3
        .linkVertical<d3.HierarchyLink<HierarchyNode>, { x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y);

      // Draw links with animated stroke-dashoffset
      const links = root.links();
      g.selectAll(".tree-link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "tree-link")
        .attr("d", (d) =>
          linkGenerator({
            source: { x: d.source.x ?? 0, y: d.source.y ?? 0 },
            target: { x: d.target.x ?? 0, y: d.target.y ?? 0 },
          } as unknown as d3.HierarchyLink<HierarchyNode>)
        )
        .attr("fill", "none")
        .attr("stroke", "#374151")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", function () {
          const len = this.getTotalLength();
          return `${len} ${len}`;
        })
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(800)
        .delay((_d, i) => i * 100)
        .attr("stroke-dashoffset", 0);

      // Draw nodes
      const nodeGroups = g
        .selectAll(".tree-node")
        .data(root.descendants().filter((d) => d.data.id !== "__root__"))
        .enter()
        .append("g")
        .attr("class", "tree-node")
        .attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
        .attr("opacity", 0);

      const nodeWidth = 130;
      const nodeHeight = 36;

      nodeGroups
        .append("rect")
        .attr("x", -nodeWidth / 2)
        .attr("y", -nodeHeight / 2)
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("rx", 8)
        .attr("fill", "#1f2937")
        .attr("stroke", (d) => TYPE_COLORS[d.data.type] || "#6b7280")
        .attr("stroke-width", 1.5);

      nodeGroups
        .append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#e5e7eb")
        .attr("font-size", 12)
        .attr("font-weight", 500)
        .text((d) => d.data.label);

      // Fade-in animation for nodes
      nodeGroups
        .transition()
        .duration(400)
        .delay((_d, i) => 200 + i * 80)
        .attr("opacity", 1);
    },
    deps: [config],
  });

  return (
    <div className="h-[500px] w-full rounded-lg border border-gray-700 bg-gray-950">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
}