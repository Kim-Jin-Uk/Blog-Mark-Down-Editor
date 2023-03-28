/**
 * @copyright 김진욱
 * @description 마크다운형식의 문자열을 HTML로 변환하는 기능을 수행합니다
 * @created 23-03-26
 * @updated 23-03-28
 */
import { UlNode } from './types';

/**
 * 마크다운 내부의 (h, b, i, a, br) 태그 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
const convertMarkdownToStyle = (markdown: string): string => {
  let html = markdown;
  // # 제목 태그 변환
  html = html.replace(/^#\s(.*)$/gm, '<h1>$1</h1>');
  // ## 제목 태그 변환
  html = html.replace(/^##\s(.*)$/gm, '<h2>$1</h2>');
  // ### 제목 태그 변환
  html = html.replace(/^###\s(.*)$/gm, '<h3>$1</h3>');
  // 볼드체 변환
  html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  // 이탤릭체 변환
  html = html.replace(/_(.*?)_/g, '<i>$1</i>');
  // 링크 변환
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank">$1</a>',
  );
  // 줄바꿈 변환
  html = html.replace(/\n/g, '<br>');
  return html;
};
/**
 * 마크다운 내부의 코드 블록 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
const convertMarkdownToCodeBlock = (markdown: string): string => {
  return markdown.replace(
    // 코드블록 형태를 찾는 정규식
    /```([a-z]*)\n([\s\S]*?)```/g,
    (_, lang: string, code: string) => {
      // 디폴트 값은 text lang에는 javascript, typescript등이 올 수 있다
      // TODO: 추후 java, python등의 언어 추가
      lang = lang.trim() || 'text';
      // 각각 다른 색상을 입힐 클래스 이름 정의
      const funcClass = 'code-func';
      const classClass = 'code-class';
      const methodClass = 'code-method';
      const consoleClass = 'code-console';
      // 코드 블록 내부에서 변수, 함수, 클래스, 메서드, console.log 등 찾는 정규식
      const funcRegex = /\b(function)\s+([a-zA-Z_$][\w$]*)\b/g;
      const classRegex = /\b(class)\s+([a-zA-Z_$][\w$]*)\b/g;
      const methodRegex = /([a-zA-Z_$][\w$]*)\s*\(/g;
      const consoleRegex = /\b(console)\b/g;

      const highlightedCode = code
        .replace(
          funcRegex,
          `<span class="${funcClass}">$1</span> <span class="${funcClass}">$2</span>`,
        )
        .replace(
          classRegex,
          `<span class="${classClass}">$1</span> <span class="${classClass}">$2</span>`,
        )
        .replace(methodRegex, `<span class="${methodClass}">$1</span>(`)
        .replace(consoleRegex, `<span class="${consoleClass}">$1</span>`);
      return `<pre><code class="${lang}">${highlightedCode.trim()}</code></pre>`;
    },
  );
};
/**
 * align 표현식을 실제 text-align에 넣을 값으로 변환하는 함수
 * @param input 사용자로 부터 입력받은 align값 (':--', ':-:', '--:' 등)
 * @returns 해당하는 align 값 ('center', 'left', 'right')
 */
const convertAlignFrom = (input: string): string => {
  if (input[0] === ':' && input.at(-1) === ':') return 'center';
  if (input[0] === ':') return 'left';
  if (input.at(-1) === ':') return 'right';
  return 'center';
};
/**
 * 마크다운 내부의 테이블 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
const convertMarkdownToTable = (markdown: string): string => {
  try {
    return markdown.replace(/^((\|.*\|)\s*\n)+/gm, (match: string) => {
      match = match.trim();
      const rows = match.split('\n');
      // 헤더, 구분선, 데이터 영역을 분리
      const [header, align, ...data] = rows.map((row) =>
        row.split('|').map((cell) => cell.trim()),
      );
      // 헤더부 변환
      let html = '<table><thead><tr>';
      header.forEach((cell, i) => {
        html += `<th style="text-align: ${convertAlignFrom(
          align[i],
        )}">${cell}</th>`;
      });
      html += '</tr></thead><tbody>';

      // 데이터부 변환
      data.forEach((row) => {
        html += '<tr>';
        row.forEach((cell, i) => {
          html += `<td style="text-align: ${convertAlignFrom(
            align[i],
          )}">${cell}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      return html;
    });
  } catch (err) {
    return markdown;
  }
};

const convertMarkdownToList = (markdown: string): string => {
  const lines = markdown.split('\n');
  const ulStack: UlNode[] = [];
  let html = '';

  const pushListNode = (tabCount: number, type: 'ul' | 'ol') => {
    let htmlTag = type === 'ul' ? '<ul>' : '<ol>';
    html += htmlTag;
    ulStack.push({ tabCount, type });
  };

  const popListNode = () => {
    html += '</li>';
    const node = ulStack.pop();
    html += node.type === 'ul' ? '</ul>' : '</ol>';
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const listMatch = line.match(/^(\s*)(-|\*|\d+\.)\s(.+)/);

    if (listMatch) {
      let listItem = listMatch[3];

      if (
        ulStack.length > 0 &&
        listMatch[1].length < ulStack[ulStack.length - 1].tabCount
      ) {
        while (
          ulStack.length > 0 &&
          listMatch[1].length < ulStack[ulStack.length - 1].tabCount
        )
          popListNode();
      }

      if (listMatch[1].length === (ulStack[ulStack.length - 1]?.tabCount ?? -1))
        html += '</li>';
      else if (
        listMatch[1].length > (ulStack[ulStack.length - 1]?.tabCount ?? -1)
      )
        pushListNode(listMatch[1].length, listMatch[2] === '-' ? 'ul' : 'ol');

      html += '<li>' + listItem;
    } else {
      while (ulStack.length > 0) popListNode();
      html += line + '\n';
    }
  }

  while (ulStack.length > 0) popListNode();

  return html;
};

/**
 * 마크다운을 HTML 형태로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @param fns 변환에 사용할 함수 리스트
 * @returns 변환된 HTML
 */
const convertMarkdownToHtml = (
  markdown: string,
  ...fns: ((markdown: string) => string)[]
): string => {
  let html = markdown;
  for (const f of fns) {
    html = f(html);
  }
  return html;
};

/**
 * 마크다운을 HTML형태의 문자열로 파싱하는 함수
 * @param {string} markdown 변환할 마크다운
 * @returns {string} 변환된 HTML
 */
export const parseMarkdown = (markdown: string): string => {
  return convertMarkdownToHtml(
    markdown,
    convertMarkdownToCodeBlock,
    convertMarkdownToTable,
    convertMarkdownToList,
    convertMarkdownToStyle,
  );
};
