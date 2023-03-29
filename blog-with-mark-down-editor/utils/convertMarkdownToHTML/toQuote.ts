/**
 * @copyright 김진욱
 * @description 인용구 형식을 HTML로 변환하는 기능을 수행합니다
 * @convertCase blockquote
 * @created 23-03-29
 * @updated 23-03-29
 */
/**
 * 마크다운 내부의 인용구 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToQuote = (markdown: string): string => {
  let lines = markdown.split('\n');
  let html = '';
  let nestedQuoteLevel = 0;
  let currentQuoteLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let quoteLevel = 0;

    while (line.startsWith('>')) {
      quoteLevel++;
      line = line.slice(1);
    }

    if (quoteLevel > 0) {
      // 중첩된 인용구 처리
      // 현재 인용구 depth가 더 깊어진 경우
      if (quoteLevel > currentQuoteLevel) {
        nestedQuoteLevel += quoteLevel - currentQuoteLevel;
        html += '<blockquote>';
      }
      // 현재 인용구 depth가 더 얕아진 경우
      else if (quoteLevel < currentQuoteLevel) {
        nestedQuoteLevel -= currentQuoteLevel - quoteLevel;
        html += '</blockquote>'.repeat(currentQuoteLevel - quoteLevel);
      }
      currentQuoteLevel = quoteLevel;
      html += line.trim() + '\n';
    } else {
      // 중첩된 만큼 닫아주기
      if (currentQuoteLevel > 0) {
        html += '</blockquote>'.repeat(currentQuoteLevel);
        currentQuoteLevel = 0;
        nestedQuoteLevel = 0;
      }
      html += line.trim() + '\n';
    }
  }

  if (nestedQuoteLevel > 0) {
    html +=
      '</blockquote>'.repeat(nestedQuoteLevel) + nestedQuoteLevel ? '\n' : '';
  }

  return html;
};
