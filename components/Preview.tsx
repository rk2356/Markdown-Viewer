
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { slugify } from '../lib/utils';

interface PreviewProps {
  markdown: string;
}

const Preview: React.FC<PreviewProps> = ({ markdown }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Restore scroll position on load
  useEffect(() => {
    const savedScroll = localStorage.getItem('promark-scroll');
    if (savedScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  // Save scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    localStorage.setItem('promark-scroll', e.currentTarget.scrollTop.toString());
  };

  return (
    <div className="h-full w-full bg-[#30302e] flex flex-col relative print:bg-white print:h-auto print:overflow-visible">
      <div 
        id="preview-container" 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 w-full h-full overflow-y-auto px-6 py-8 sm:px-10 scroll-smooth print:overflow-visible print:h-auto print:px-0"
      >
        <article id="printable-content" className="
          prose prose-invert prose-lg max-w-3xl mx-auto 
          prose-headings:font-bold prose-headings:text-white prose-headings:scroll-mt-4 prose-headings:tracking-tight
          prose-p:text-gray-200 prose-p:leading-8 prose-p:font-normal
          prose-a:text-brand-400 hover:prose-a:text-brand-300 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-white/10
          prose-pre:bg-transparent prose-pre:border-none prose-pre:p-0
          prose-hr:border-white/20 prose-hr:my-10
          prose-blockquote:border-l-[3px] prose-blockquote:border-brand-500 prose-blockquote:bg-transparent prose-blockquote:text-gray-300 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic
          prose-li:text-gray-200 prose-li:marker:text-gray-500
          prose-strong:text-white prose-strong:font-bold
          prose-code:text-brand-200 prose-code:bg-transparent prose-code:border prose-code:border-white/15 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-code:mx-0.5
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
                h1: ({node, ...props}) => <h1 id={slugify(props.children?.toString() || '')} {...props} />,
                h2: ({node, ...props}) => <h2 id={slugify(props.children?.toString() || '')} {...props} />,
                h3: ({node, ...props}) => <h3 id={slugify(props.children?.toString() || '')} {...props} />,
                pre: ({ node, ...props }) => (
                    <div className="relative group">
                        <pre className="not-prose rounded-lg overflow-hidden text-[14px] leading-relaxed border border-white/15 bg-transparent my-6 p-5">
                            {props.children}
                        </pre>
                    </div>
                ),
            }}
          >
            {markdown}
          </ReactMarkdown>
          
          <div className="h-20 no-print"></div>
        </article>
      </div>
    </div>
  );
};

export default Preview;
