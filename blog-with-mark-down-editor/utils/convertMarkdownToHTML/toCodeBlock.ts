/**
 * @copyright 김진욱
 * @description 코드 블록 형식을 HTML로 변환하는 기능을 수행합니다
 * @convertCase pre, span, code
 * @created 23-03-29
 * @updated 23-03-29
 */
/**
 * 마크다운 내부의 코드 블록 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToCodeBlock = (markdown: string): string => {
  const html = markdown.replace(
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
  return html;
};
