import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

interface MdxProps {
  source: string;
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}

export function MdxContent({ source, components = {} }: MdxProps) {
  return (
    <div className="prose prose-invert max-w-none
      prose-headings:text-white prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
      prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-blue-300
      prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2
      prose-p:text-gray-300 prose-p:leading-relaxed
      prose-li:text-gray-300
      prose-strong:text-white
      prose-code:text-green-400 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg
      prose-table:border-collapse
      prose-th:bg-gray-800 prose-th:text-white prose-th:px-3 prose-th:py-2 prose-th:border prose-th:border-gray-700
      prose-td:text-gray-300 prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-gray-700
      prose-a:text-blue-400
      prose-blockquote:border-blue-500 prose-blockquote:text-gray-400
    ">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}