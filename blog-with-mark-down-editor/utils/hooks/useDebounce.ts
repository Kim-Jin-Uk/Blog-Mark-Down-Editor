import { useRef } from 'react';
/**
 * 함수가 잇달아 실행시 앞의 작업을 취소 한다, time이 지날 때까지 다시 호출 되지 않으면 callback을 실행 한다
 * @param callback 실행할 콜백함수
 * @param time 디바운싱을 적용할 시간
 * @returns 디바운싱이 적용된 콜백 함수
 */
export const useDebounce = <T extends any[]>(
  callback: (...params: T) => void,
  time: number,
) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...params: T) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      callback(...params);
      timer.current = null;
    }, time);
  };
};
