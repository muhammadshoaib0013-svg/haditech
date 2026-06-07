import React, { ReactNode } from 'react';
import { CopyButton } from './CopyButton';

// Utility to extract text from ReactNode (to pass to CopyButton)
const extractText = (node: ReactNode): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) return extractText(node.props.children);
  return '';
};

export const MDXComponents = {
  h1: (props: any) => <h1 className="text-4xl font-extrabold mt-12 mb-6 tracking-tight text-foreground" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold mt-10 mb-5 tracking-tight text-foreground border-b border-border pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mt-8 mb-4 tracking-tight text-foreground" {...props} />,
  h4: (props: any) => <h4 className="text-xl font-semibold mt-8 mb-4 tracking-tight text-foreground" {...props} />,
  p: (props: any) => <p className="text-lg text-muted-foreground leading-relaxed mb-6" {...props} />,
  a: (props: any) => <a className="text-primary font-medium hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />,
  ul: (props: any) => <ul className="list-disc list-outside ml-6 mb-6 text-lg text-muted-foreground space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-outside ml-6 mb-6 text-lg text-muted-foreground space-y-2" {...props} />,
  li: (props: any) => <li className="pl-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-6 py-1 my-8 italic bg-muted/30 rounded-r-xl" {...props} />
  ),
  hr: (props: any) => <hr className="my-10 border-border" {...props} />,
  img: (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-xl border border-border w-full my-8 shadow-sm" alt={props.alt || ''} loading="lazy" {...props} />
  ),
  pre: (props: any) => {
    // rehype-pretty-code wraps code in a <pre> and <code>. We intercept <pre> to add the CopyButton.
    const rawCode = props.raw || extractText(props.children);
    return (
      <div className="relative group my-8">
        <CopyButton text={rawCode} />
        <pre className="overflow-x-auto p-4 rounded-xl bg-[#0d1117] border border-border/50 text-[14px] leading-snug" {...props}>
          {props.children}
        </pre>
      </div>
    );
  },
  code: (props: any) => {
    // Check if it's an inline code block or inside a pre
    const isInline = !props.className;
    if (isInline) {
      return <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono text-primary" {...props} />;
    }
    return <code className="font-mono" {...props} />;
  },
};
