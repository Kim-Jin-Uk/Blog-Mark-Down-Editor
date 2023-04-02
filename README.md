# Blog-Mark-Down-Editor
 마크다운 에디터를 적용한 블로그 서비스 입니다
 
## 마크다운 에디터
`Showdown`, `Marked`와 같은 다양한 라이브러리들이 존재하지만 정규식, 문자열을 파싱에 대한 이해도를 높이기 위해 직접 구현하고자 했습니다.

### 제공하는 기능
- 제목 태그 변환
  * `#`, `##`등 제목을 표현하는 표현식을 판별하여 `header`태그로 변환합니다. 

- 볼드 태그 변환
  * `**`로 감싸인 볼드체를 표현하는 표현식을 판별하여 `strong`태그로 변환합니다. 

- 이탤릭 태그 변환
  * `_`로 감싸인 이텔릭체를 표현하는 표현식을 판별하여 `em`태그로 변환합니다. 

  > `strong`, `em`를 사용하는 이유
  >  1. 의미
  >     - `b`, `i` 태그는 단순히 텍스트를 볼드체, 이탤릭체로 표시하는 시각적인 역할만을 수행합니다.
  >     - `strong`, `em` 태그는 단순한 시각적 강조가 아니라, 문서의 의미론적인 강조를 나타내는 역할을 합니다.
  >  2. SEO
  >     - `b`, `i` 태그는 시각적인 효과만 있어, 검색 엔진에서는 중요한 내용으로 인식하지 않을 가능성이 높습니다.
  >     - `strong`, `em` 태그는 사용된 텍스트를 중요한 내용으로 인식하여, 검색 결과에 반영합니다.
  >  3. 웹 접근성
  >     - `strong`, `em` 태그는 스크린 리더(Screen Reader)를 사용하는 경우 사용된 텍스트를 강조하여 더 쉽게 내용을 이해할 수 있습니다.

- 인라인 코드 태그 변환
  * ` `` `와 같은 인라인 코드를 표현하는 표현식을 판별하여 `code`태그로 변환합니다. 
  
- 수평선 태그 변환
  * `---`, `===`와 같은 수평선을 표현하는 표현식을 판별하여 `hr`태그로 변환합니다. 
  
- 이미지 태그 변환
  * 이미지를 표현하는 표현식을 판별하여 `img`태그로 변환합니다. 
  
- 줄바꿈 태그 변환
  * `\n`와 같은 줄바꿈을 표현하는 표현식을 판별하여 `br`태그로 변환합니다. 

- 코드블록 변환
  * ` ``` `와 같은 코드블록을 표현하는 표현식을 판별하여 `pre`,`code` 태그등으로 변환합니다.
  
- 링크 변환
  * 링크를 표현하는 표현식을 판별하여 `a` 태그로 변환합니다. 
  
- 리스트 변환
  * `-`, `*`, `+`, `1.`와 같은 리스트를 표현하는 표현식을 판별하여 `ul`, `ol`, `li` 태그등으로 변환합니다.
  
- 인용구 태그 변환
  * `>`와 같은 인용구를 표현하는 표현식을 판별하여 `blockquote` 태그등으로 변환합니다.
  
- 링크 변환
  * 테이블을 표현하는 표현식을 판별하여 `table`, `thead`, `tbody`, `th`, `tr`, `td` 태그등으로 변환합니다. 

### 직면했던 문제
- Tab 입력
  > * 일반적으로 `textarea` 에서는 tab키를 입력할 수 없습니다.
  > * 이를 개선 하고자 `event.preventDefault()`를 통해 기본 이벤트를 취소하고 `/t`문자열을 추가해 주었습니다.
  > * 이때 `textarea`내부의 문자열을 수정하기에 커서의 위치가 제일 마지막으로 이동하는 문제가 발생합니다.
  > * 이를 개선하고자 `textarea`의 `selectionStart`, `selectionEnd`를 조작하여 해결했습니다.
  > * 이때 `SetState`의 경우 비동기로 처리되므로 위 문제가 해결되지 않습니다.
  > * 이를 개선하고자 `requestAnimationFrame`을 통해 리페인트 이전에 커서 위치를 조작하여 해결했습니다.
