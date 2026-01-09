import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  const safeContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "div",
      "span",
      "p",
      "b",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
      "pre",
      "code",
      "h1",
      "h2",
      "h3",
      "h4",
      "br",
    ],
    ALLOWED_ATTR: ["class"],
  });

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        p: ({ node, ...props }) => <p className="my-1" {...props} />,
        li: ({ node, ...props }) => (
          <li className="ml-4 list-disc" {...props} />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold my-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-semibold my-2" {...props} />
        ),
        pre: ({ node, ...props }) => (
          <pre
            className="bg-gray-900 text-white rounded-xl p-4 overflow-auto"
            {...props}
          />
        ),
        code: ({ node, ...props }) => (
          <code className="text-pink-500 bg-gray-100 px-1 rounded" {...props} />
        ),
        table: ({ node, ...props }) => (
          <table
            className="table-auto border-collapse border border-gray-300"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 px-2 py-1" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th
            className="border border-gray-300 px-2 py-1 bg-gray-100"
            {...props}
          />
        ),
        div: ({ node, ...props }) => <div {...props} />, // div tetap render
        span: ({ node, ...props }) => <span {...props} />,
      }}
    >
      {safeContent}
    </ReactMarkdown>
  );
}
