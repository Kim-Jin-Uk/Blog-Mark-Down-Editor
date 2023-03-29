/**
 * @copyright 김진욱
 * @description 마크다운형식의 문자열을 HTML로 변환하는 기능을 수행합니다
 * @created 23-03-26
 * @updated 23-03-29
 */

import { ListNode } from './types';

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
/**
 * 리스트 노드배열을 HTML형식으로 변환하는 함수
 * @param nodes 변환할 리스트 노드 배열 (깊이, 태그명, 내용값)
 * @returns 변환된 리스트 형식의 HTML
 */
const convertNodeToList = (nodes: ListNode[]): string => {
  const stack = [];
  let result = '';

  for (const node of nodes) {
    if (!stack.length) {
      stack.push(node);
      result += `<${node.tag}><li>${node.value}</li>`;
      continue;
    }
    const prev = stack.at(-1);

    if (node.depth === prev.depth) {
      if (node.tag === prev.tag) result += `<li>${node.value}</li>`;
      else {
        result += `</${prev.tag}><${node.tag}><li>${node.value}</li>`;
        stack.pop();
        stack.push(node);
      }
    } else if (node.depth > prev.depth) {
      let depthLI = '';

      for (let i = 1; i < node.depth - prev.depth; i++) {
        depthLI += '<li>';
        stack.push({ depth: i + prev.depth, tag: 'li', value: '' });
      }
      result += `${depthLI}<${node.tag}><li>${node.value}</li>`;

      stack.push(node);
    } else {
      while (stack.length) {
        const prev = stack.pop();
        if (prev.depth === node.depth) {
          stack.push(prev);
          break;
        }
        result += `</${prev.tag}>`;
      }

      if (node.tag === prev.tag) result += `<li>${node.value}</li>`;
      else {
        result += `</${prev.tag}><li>${node.value}</li>`;
        stack.pop();
        stack.push(node);
      }
    }
  }
  while (stack.length) result += `</${stack.pop().tag}>`;

  return result + '\n';
};
/**
 * 마크다운 내부의 리스트 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
const convertMarkdownToList = (markdown: string): string => {
  const lines = markdown.split('\n');
  let previousIndent = -1;
  let inList = false;
  let listNodes: ListNode[] = [];
  let result = '';

  for (const line of lines) {
    const indent = Math.min(
      Math.ceil(line.search(/\S/) / 4),
      previousIndent + 1,
    );
    previousIndent = indent;

    const trimmedLine = line.trim();
    if (/^[-+*]\s+/.test(trimmedLine) || /^\d+\.\s+/.test(trimmedLine)) {
      const node: ListNode = {
        depth: indent,
        tag: /^[-+*]\s+/.test(trimmedLine) ? 'ul' : 'ol',
        value: /^[-+*]\s+/.test(trimmedLine)
          ? trimmedLine.slice(2)
          : trimmedLine.slice(trimmedLine.indexOf('.') + 2),
      };
      inList = true;

      listNodes.push(node);
    } else {
      if (inList) {
        result += convertNodeToList(listNodes);
        inList = false;
        listNodes = [];
      }
      result += `${line}\n`;
    }
  }
  if (inList) result += convertNodeToList(listNodes);

  return result;
};
/**
 * 마크다운 내부의 링크 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
const convertMarkdownToLink = (markdown: string): string => {
  let html = markdown;
  // 링크 변환
  html = html.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
    '<a href="$2" title="$3">$1</a>',
  );
  // 참조 링크 변환
  html = html.replace(/\[([^\]]+)\]\[([^\]]+)\]/g, (_, p1, p2) => {
    return '<a href="' + p2 + '">' + p1 + '</a>';
  });
  // 링크 설명 변환
  html = html.replace(
    /\[([^\]]+)\]:\s*(\S+)(?:\s+"([^"]+)")?/g,
    (_, p1, p2, p3) => {
      return '<a href="' + p2 + '" title="' + (p3 || '') + '">' + p1 + '</a>';
    },
  );
  // URL 변환
  html = html.replace(/(^|[^"])(https?:\/\/\S+)/g, '$1<a href="$2">$2</a>');

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
    convertMarkdownToList,
    convertMarkdownToTable,
    convertMarkdownToLink,
    convertMarkdownToStyle,
  );
};
