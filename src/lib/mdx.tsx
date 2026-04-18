import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import CodeBlock from "@/components/mdx/CodeBlock";
import Callout from "@/components/mdx/Callout";

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="mt-8 mb-4 text-3xl font-bold text-white">{children}</h1>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 mb-3 text-2xl font-semibold text-blue-300 border-b border-gray-800 pb-2">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 mb-2 text-xl font-semibold text-white">{children}</h3>;
}
function H4({ children }: { children: React.ReactNode }) {
  return <h4 className="mt-4 mb-2 text-lg font-medium text-gray-200">{children}</h4>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-gray-300 leading-relaxed">{children}</p>;
}
function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="mb-4 ml-6 list-disc space-y-1 text-gray-300">{children}</ul>;
}
function Ol({ children }: { children: React.ReactNode }) {
  return <ol className="mb-4 ml-6 list-decimal space-y-1 text-gray-300">{children}</ol>;
}
function Li({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}
function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-white">{children}</strong>;
}
function A({ children, href }: { children: React.ReactNode; href?: string }) {
  return <a href={href} className="text-blue-400 underline decoration-blue-400/30 hover:decoration-blue-400 transition-colors">{children}</a>;
}
function Table({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 overflow-x-auto rounded-lg border border-gray-700"><table className="w-full border-collapse">{children}</table></div>;
}
function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-800">{children}</thead>;
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2.5 text-left text-sm font-semibold text-white border-b border-gray-700">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2.5 text-sm text-gray-300 border-b border-gray-800">{children}</td>;
}
function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-sm text-cyan-400 before:content-none after:content-none">{children}</code>;
}
function Hr() {
  return <hr className="my-8 border-gray-800" />;
}

interface MdxProps {
  source: string;
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}

export function MdxContent({ source, components = {} }: MdxProps) {
  return (
    <MDXRemote
      source={source}
      components={{
        pre: CodeBlock,
        blockquote: Callout,
        code: InlineCode,
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        p: P,
        ul: Ul,
        ol: Ol,
        li: Li,
        strong: Strong,
        a: A,
        table: Table,
        thead: Thead,
        th: Th,
        td: Td,
        hr: Hr,
        ...components,
      }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: "github-dark-dimmed",
                keepBackground: true,
                defaultLang: "plaintext",
              },
            ],
          ],
        },
      }}
    />
  );
}