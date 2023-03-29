/**
 * @copyright 김진욱
 * @description 링크 형식을 HTML로 변환하는 기능을 수행합니다
 * @convertCase a
 * @created 23-03-29
 * @updated 23-03-29
 */
/**
 * 마크다운 내부의 링크 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToLink = (markdown: string): string => {
  const html = markdown
    // 링크 변환
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
      '<a href="$2" title="$3">$1</a>',
    )
    // 참조 링크 변환
    .replace(/\[([^\]]+)\]\[([^\]]+)\]/g, (_, p1, p2) => {
      return '<a href="' + p2 + '">' + p1 + '</a>';
    })
    // 링크 설명 변환
    .replace(/\[([^\]]+)\]:\s*(\S+)(?:\s+"([^"]+)")?/g, (_, p1, p2, p3) => {
      return '<a href="' + p2 + '" title="' + (p3 || '') + '">' + p1 + '</a>';
    })
    // URL 변환
    .replace(/(^|[^"])(https?:\/\/\S+)/g, '$1<a href="$2">$2</a>');

  return html;
};
