/**
 * @copyright 김진욱
 * @description 테이블 형식을 HTML로 변환하는 기능을 수행합니다
 * @convertCase table, thead, tbody, th, tr, td
 * @created 23-03-29
 * @updated 23-03-29
 */
/**
 * align 표현식을 실제 text-align에 넣을 값으로 변환하는 함수
 * @param input 사용자로 부터 입력받은 align값 (':--', ':-:', '--:' 등)
 * @returns 해당하는 align 값 ('center', 'left', 'right')
 */
const convertAlignFormatToStyle = (format: string): string => {
  if (format[0] === ':' && format.at(-1) === ':') return 'center';
  if (format[0] === ':') return 'left';
  if (format.at(-1) === ':') return 'right';
  return 'center';
};
/**
 * 마크다운 내부의 테이블 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToTable = (markdown: string): string => {
  const html = markdown.replace(/^((\|.*\|)\s*\n)+/gm, (match: string) => {
    match = match.trim();
    const rows = match.split('\n');
    // 헤더, 구분선, 데이터 영역을 분리
    const [header, align, ...data] = rows.map((row) =>
      row.split('|').map((cell) => cell.trim()),
    );
    // 헤더부 변환
    let html = '<table><thead><tr>';
    header.forEach((cell, i) => {
      html += `<th style="text-align: ${convertAlignFormatToStyle(
        align[i],
      )}">${cell}</th>`;
    });
    html += '</tr></thead><tbody>';

    // 데이터부 변환
    data.forEach((row) => {
      html += '<tr>';
      row.forEach((cell, i) => {
        html += `<td style="text-align: ${convertAlignFormatToStyle(
          align[i],
        )}">${cell}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  });
  return html;
};
