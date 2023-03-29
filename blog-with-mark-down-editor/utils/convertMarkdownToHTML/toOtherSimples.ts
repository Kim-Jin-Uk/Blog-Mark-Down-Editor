/**
 * @copyright 김진욱
 * @description 간단한 정규식으로 변환가능한 태그 형식을 HTML로 변환하는 기능을 수행합니다
 * @convertCase h, strong, em, a, br, code, hr, img
 * @created 23-03-29
 * @updated 23-03-29
 */
/**
 * 마크다운 내부의 (h, strong, em, a, br) 태그 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToSimpleTag = (markdown: string): string => {
  const html = markdown
    // # 제목 태그 변환
    .replace(/^#\s(.*)$/gm, '<h1>$1</h1>')
    // ## 제목 태그 변환
    .replace(/^##\s(.*)$/gm, '<h2>$1</h2>')
    // ### 제목 태그 변환
    .replace(/^###\s(.*)$/gm, '<h3>$1</h3>')
    // 볼드체 변환
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 이탤릭체 변환
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // 줄바꿈 변환
    .replace(/\n/g, '<br>');
  return html;
};
/**
 * 마크다운 내부의 인라인 코드 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToInlineCode = (markdown: string): string => {
  const inlineCodeRegex = /`([^`]+)`/g;
  const html = markdown.replace(inlineCodeRegex, '<code>$1</code>');
  return html;
};
/**
 * 마크다운 내부의 수평선 코드 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToHorizontalRule = (markdown: string): string => {
  const hrRegex = /^([-*=_]{3,})$/gm;
  const html = markdown.replace(hrRegex, '<hr>');
  return html;
};
/**
 * 마크다운 내부의 이미지 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToImg = (markdown: string): string => {
  const imageRegex = /!\[([^\]]+)\]\(([^\s]+)(?:\s+"([^"]+)")?\)/g;
  const html = markdown.replace(
    imageRegex,
    '<img src="$2" alt="$1" title="$3">',
  );
  return html;
};
