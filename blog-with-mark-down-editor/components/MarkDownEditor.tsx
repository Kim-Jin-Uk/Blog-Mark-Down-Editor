/**
 * @copyright 김진욱
 * @description 사용자의 입력중 마크다운 형식에 대해 그에 상응하는 HTML을 렌더링 합니다
 * @created 23-03-26
 * @updated 23-03-29
 */
import React, { useEffect, useState } from 'react';
import { parseMarkdown } from 'utils/convertMarkdownToHTML';
import { useDebounce } from 'utils/hooks/useDebounce';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const [innerHtml, setInnerHtml] = useState('');

  const tabHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const { selectionStart, selectionEnd } = textarea;
      const newMarkdown = `${markdown.substring(
        0,
        selectionStart,
      )}\t${markdown.substring(selectionEnd)}`;
      setMarkdown(newMarkdown);
      const newCursorPosition = selectionStart + 1;
      // setMarkdown은 비동기 이므로 리페인트 이전에 호출되는 requestAnimationFrame을 통해 커서 위치를 조정
      requestAnimationFrame(() => {
        textarea.selectionStart = newCursorPosition;
        textarea.selectionEnd = newCursorPosition;
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  useEffect(
    useDebounce(() => setInnerHtml(parseMarkdown(markdown)), 200),
    [markdown],
  );

  return (
    <div>
      <textarea
        value={markdown}
        onKeyDown={tabHandler}
        onChange={handleChange}
      />
      <div dangerouslySetInnerHTML={{ __html: innerHtml }} />
    </div>
  );
};

export default MarkdownEditor;
