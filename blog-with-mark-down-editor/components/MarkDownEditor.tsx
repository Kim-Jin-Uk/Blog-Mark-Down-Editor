/**
 * @copyright 김진욱
 * @description 사용자의 입력중 마크다운 형식에 대해 그에 상응하는 HTML을 렌더링 합니다
 * @created 23-03-26
 * @updated 23-03-29
 */
import React, { useState } from 'react';
import { parseMarkdown } from 'utils/convertMarkdownToHTML';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const getMarkdownAsHtml = () => {
    console.log(parseMarkdown(markdown));
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
