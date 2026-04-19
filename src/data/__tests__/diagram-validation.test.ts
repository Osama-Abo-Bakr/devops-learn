import { diagramMap } from "../index";
import type { DiagramNodeType, DiagramEdgeType } from "@/types";

const VALID_NODE_TYPES: DiagramNodeType[] = [
  "container",
  "pod",
  "service",
  "volume",
  "network",
  "layer",
  "pipeline",
  "security",
  "ingress",
  "config",
  "stage",
  "groupZone",
];

const VALID_EDGE_TYPES: DiagramEdgeType[] = [
  "dataFlow",
  "volumeMount",
  "network",
  "animatedDataFlow",
  "pipeline",
  "securityEdge",
  "copyFrom",
];

describe("diagram validation", () => {
  const entries = Object.entries(diagramMap);

  test("every diagram has a valid ID matching its map key", () => {
    entries.forEach(([key, config]) => {
      expect(config.id).toBe(key);
    });
  });

  test("every diagram has at least one node", () => {
    entries.forEach(([key, config]) => {
      expect(config.nodes.length).toBeGreaterThan(0);
    });
  });

  test("every diagram has at least one edge", () => {
    entries.forEach(([key, config]) => {
      expect(config.edges.length).toBeGreaterThan(0);
    });
  });

  test("all node types are valid", () => {
    entries.forEach(([key, config]) => {
      config.nodes.forEach((node) => {
        expect(VALID_NODE_TYPES).toContain(node.data.type);
      });
    });
  });

  test("all edge types are valid", () => {
    entries.forEach(([key, config]) => {
      config.edges.forEach((edge) => {
        expect(VALID_EDGE_TYPES).toContain(edge.data.type);
      });
    });
  });

  test("all edge sources and targets reference existing nodes", () => {
    entries.forEach(([key, config]) => {
      const nodeIds = new Set(config.nodes.map((n) => n.id));
      config.edges.forEach((edge) => {
        expect(nodeIds).toContain(edge.source);
        expect(nodeIds).toContain(edge.target);
      });
    });
  });

  test("no duplicate node IDs within a diagram", () => {
    entries.forEach(([key, config]) => {
      const ids = config.nodes.map((n) => n.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  test("no duplicate edge IDs within a diagram", () => {
    entries.forEach(([key, config]) => {
      const ids = config.edges.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  test("step nodeIds reference existing nodes", () => {
    entries.forEach(([key, config]) => {
      if (!config.steps) return;
      const nodeIds = new Set(config.nodes.map((n) => n.id));
      config.steps.forEach((step) => {
        step.nodeIds.forEach((nodeId) => {
          expect(nodeIds).toContain(nodeId);
        });
      });
    });
  });

  test("step edgeIds reference existing edges", () => {
    entries.forEach(([key, config]) => {
      if (!config.steps) return;
      const edgeIds = new Set(config.edges.map((e) => e.id));
      config.steps.forEach((step) => {
        step.edgeIds.forEach((edgeId) => {
          expect(edgeIds).toContain(edgeId);
        });
      });
    });
  });

  test("all nodes are covered by steps when steps exist", () => {
    entries.forEach(([key, config]) => {
      if (!config.steps) return;
      const stepNodeIds = new Set(config.steps.flatMap((s) => s.nodeIds));
      config.nodes.forEach((node) => {
        // groupZone nodes are background containers, not interactive
        if (node.data.type === "groupZone") return;
        expect(stepNodeIds).toContain(node.id);
      });
    });
  });

  test("all edges are covered by steps when steps exist", () => {
    entries.forEach(([key, config]) => {
      if (!config.steps) return;
      const stepEdgeIds = new Set(config.steps.flatMap((s) => s.edgeIds));
      config.edges.forEach((edge) => {
        expect(stepEdgeIds).toContain(edge.id);
      });
    });
  });
});