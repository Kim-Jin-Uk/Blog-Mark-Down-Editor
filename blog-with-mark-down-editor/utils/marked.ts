const convertMarkdownToStyle = (markdown: string) => {
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
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  // 줄바꿈 변환
  html = html.replace(/\n/g, '<br>');
  return html;
};

export const parseMarkdown = (markdown: string) => {
  // 마크다운을 HTML로 변환하는 함수
  const convertMarkdownToHtml = (markdown: string) => {};

  // 마크다운을 줄바꿈으로 분리
  const lines = markdown.split('\n');

  let html = '';

  // 분리된 줄마다 변환
  for (let i = 0; i < lines.length; i++) {
    html += convertMarkdownToHtml(lines[i]) + '\n';
  }

  return html;
};
