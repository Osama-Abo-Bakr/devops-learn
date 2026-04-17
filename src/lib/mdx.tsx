import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

interface MdxProps {
  source: string;
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}

export function MdxContent({ source, components = {} }: MdxProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}