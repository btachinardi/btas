import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  return (
    <article
      className={`
        prose prose-invert prose-slate max-w-none
        prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:pb-4 prose-h1:border-b prose-h1:border-slate-700
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-slate-100
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-slate-200
        prose-p:text-slate-300 prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-ul:my-4 prose-li:my-1 prose-li:text-slate-300
        prose-li:marker:text-primary
        prose-strong:text-white prose-strong:font-semibold
        prose-hr:border-slate-700 prose-hr:my-8
        ${className}
      `}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
};

export default MarkdownViewer;
