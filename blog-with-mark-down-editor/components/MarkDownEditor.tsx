import React, { useState } from 'react';
import { parseMarkdown } from 'utils/marked';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const getMarkdownAsHtml = () => {
    return { __html: parseMarkdown(markdown) };
  };

  return (
    <div>
      <textarea value={markdown} onChange={handleChange} />
      <div dangerouslySetInnerHTML={getMarkdownAsHtml()} />
    </div>
  );
};

export default MarkdownEditor;
