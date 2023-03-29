/**
 * @copyright 김진욱
 * @description 리스트 형식을 HTML로 변환하는 기능을 수행합니다
 * @convertCase ul, ol, li
 * @created 23-03-29
 * @updated 23-03-29
 */
import { ListNode } from './types';
/**
 * 직전 리스트 아이템과 현재 리스트 아이템의 깊이가 동일한 경우를 처리하는 함수
 * @param html 변환중인 HTML
 * @param stack 리스트 아이템의 계층 구조를 담고 있는 스택
 * @param prev 직전 리스트 아이템
 * @param node 현재 리스트 아이템
 * @returns 변환된 HTML
 */
const getHtmlWhenDepthIsSame = (
  html: string,
  stack: ListNode[],
  prev: ListNode,
  node: ListNode,
): string => {
  // case 1-1 직전 아이템과 태그 형식이 동일한 경우
  if (node.tag === prev.tag) html += `<li>${node.value}</li>`;
  // case 1-1 직전 아이템과 태그 형식이 다른 경우
  else {
    // 직전 아이템의 태그를 닫아주고 최상위 항목을 현재 아이템으로 교체 한다
    html += `</${prev.tag}><${node.tag}><li>${node.value}</li>`;
    stack.pop();
    stack.push(node);
  }
  return html;
};
/**
 * 리스트 노드배열을 HTML형식으로 변환하는 함수
 * @param nodes 변환할 리스트 노드 배열 (깊이, 태그명, 내용값)
 * @returns 변환된 리스트 형식의 HTML
 */
const convertNodeToList = (nodes: ListNode[]): string => {
  const stack: ListNode[] = [];
  let html = '';

  for (const node of nodes) {
    if (!stack.length) {
      // 스택이 빈 경우는 처음 들어온 리스트 아이템
      stack.push(node);
      html += `<${node.tag}><li>${node.value}</li>`;
      continue;
    }
    let prev = stack.at(-1);
    // case 1 직전 아이템과 깊이가 동일한 경우
    if (node.depth === prev.depth) {
      html = getHtmlWhenDepthIsSame(html, stack, prev, node);
    }
    // case 2 직전 아이템 보다 깊이가 깊어진 경우
    else if (node.depth > prev.depth) {
      html += `<${node.tag}><li>${node.value}</li>`;
      stack.push(node);
    }
    // case 3 직전 아이템 보다 깊이가 얕아진 경우
    else {
      // 현재 아이템의 부모 전까지의 태그들을 모두 닫아준다
      while (stack.length) {
        const beClosed = stack.pop();
        if (beClosed.depth === node.depth) {
          stack.push(beClosed);
          prev = beClosed;
          break;
        }
        html += `</${beClosed.tag}>`;
      }
      // 이후 과정은 case 1과 상동
      html = getHtmlWhenDepthIsSame(html, stack, prev, node);
    }
  }
  while (stack.length) html += `</${stack.pop().tag}>`;

  return html + '\n';
};
/**
 * 마크다운 내부의 리스트 형식을 HTML로 변환하는 함수
 * @param markdown 변환할 마크다운
 * @returns 변환된 HTML
 */
export const convertMarkdownToList = (markdown: string): string => {
  const lines = markdown.split('\n');
  // 직전 깊이를 저장
  let previousIndent = -1;
  // 리스트 아이템 요소인지를 판별
  let inList = false;
  // 리스트 아이템 요소를 저장
  let listNodes: ListNode[] = [];
  // 반환할 HTML
  let html = '';

  for (const line of lines) {
    // 4칸의 공백으로 깊이를 판단 깊이가 2단계이상 깊어질 수 없음
    const indent = Math.min(
      Math.ceil(line.search(/\S/) / 4),
      previousIndent + 1,
    );
    // 직전 깊이 갱신
    previousIndent = indent;
    // 불필요한 공백 제거
    const trimmedLine = line.trim();
    if (/^[-+*]\s+/.test(trimmedLine) || /^\d+\.\s+/.test(trimmedLine)) {
      // 리스트 아이템 형식이라면 리스트 노드 생성 및 배열에 담아주기
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
        // 리스트 형식이 종료되었으니 그동안의 리스트 아이템들을 변환한다
        html += convertNodeToList(listNodes);
        inList = false;
        listNodes = [];
      }
      html += `${line}\n`;
    }
  }
  // 리스트 형식이 종료되었으니 그동안의 리스트 아이템들을 변환한다
  if (inList) html += convertNodeToList(listNodes);

  return html;
};
