
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { slugify } from '../lib/utils';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  markdown: string;
}

interface Heading {
  level: number;
  text: string;
  slug: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ markdown }) => {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const headings = useMemo(() => {
    const lines = markdown.split('\n');
    const extracted: Heading[] = [];
    const regex = /^(#{1,3})\s+(.+)$/;
    let inCodeBlock = false;

    lines.forEach(line => {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return;
        }
        if (inCodeBlock) return;

        const match = line.match(regex);
        if (match) {
            extracted.push({
                level: match[1].length,
                text: match[2].trim(),
                slug: slugify(match[2].trim())
            });
        }
    });

    return extracted;
  }, [markdown]);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSlug(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: '-20% 0px -60% 0px', // Highlights when the header is near the top 1/3
      threshold: 0
    });

    const elements = headings.map(h => document.getElementById(h.slug)).filter(Boolean);
    elements.forEach(el => observerRef.current?.observe(el!));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) {
    return (
        <div className="p-6 text-gray-400 text-xs text-center italic">
            No headings found.<br/>Start writing with # to see outline.
        </div>
    );
  }

  const handleScrollTo = (e: React.MouseEvent, slug: string) => {
      e.preventDefault();
      // Optimistic update for immediate feedback
      setActiveSlug(slug);
      
      const element = document.getElementById(slug);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };

  return (
    <div className="h-full overflow-y-auto py-6 px-3 custom-scrollbar">
      <div className="flex items-center gap-2 mb-6 px-3 text-gray-400 uppercase tracking-wider text-[11px] font-bold">
        <List className="w-3.5 h-3.5" />
        <span>Content Table</span>
      </div>
      <nav className="space-y-1">
        {headings.map((heading, index) => {
            const isActive = activeSlug === heading.slug;
            return (
              <a
                key={`${heading.slug}-${index}`}
                href={`#${heading.slug}`}
                onClick={(e) => handleScrollTo(e, heading.slug)}
                className={`
                  block py-2 pr-2 text-sm transition-all duration-200 rounded-r-md border-l-2
                  ${isActive 
                    ? 'border-brand-400 bg-brand-500/10 text-brand-400 font-medium' 
                    : 'border-transparent text-gray-400 hover:text-gray-100 hover:bg-white/5'
                  }
                  ${heading.level === 1 ? 'pl-3 font-medium mt-4 mb-1' : ''}
                  ${heading.level === 2 ? 'pl-6 font-normal' : ''}
                  ${heading.level === 3 ? 'pl-9 text-[13px]' : ''}
                `}
              >
                {heading.text}
              </a>
            );
        })}
      </nav>
    </div>
  );
};

export default TableOfContents;
