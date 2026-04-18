import { useRef, useEffect, type RefObject } from "react";
import * as d3 from "d3";

interface UseD3RendererOptions {
  svgRef: RefObject<SVGSVGElement>;
  renderFn: (
    selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number
  ) => void;
  deps: unknown[];
}

export function useD3Renderer({
  svgRef,
  renderFn,
  deps,
}: UseD3RendererOptions): void {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = svg.clientWidth;
    const height = svg.clientHeight;

    const selection = d3.select(svg);
    renderFn(selection, width, height);

    const parent = svg.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver(() => {
      const w = svg.clientWidth;
      const h = svg.clientHeight;
      renderFn(selection, w, h);
    });

    observer.observe(parent);

    return () => {
      observer.disconnect();
      d3.select(svg).selectAll("*").remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}