/**
 * 마크다운을 (h, b, i, a, br) 스타일을 적용한 HTML로 변환하는 함수
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
  return convertMarkdownToHtml(markdown, convertMarkdownToStyle);
};
