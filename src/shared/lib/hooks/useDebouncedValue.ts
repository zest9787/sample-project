import { useEffect, useState } from "react";

/**
 * 입력 값을 일정 시간(delayMs) 동안 “안정화”시킨 뒤에만 반환하는 훅.
 * - 검색창 등에서 타이핑할 때 매 키 입력마다 API를 호출하지 않도록 방지
 * - delayMs 동안 추가 변경이 없으면 최신 값을 debounced로 확정
 */
export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // delayMs 후에 debounced 값을 업데이트한다.
    const id = window.setTimeout(() => setDebounced(value), delayMs);

    // value/delayMs가 바뀌거나 unmount 될 때, 이전 타이머를 정리
    // => 타이핑 중이면 이전 예약 작업을 취소하여 최종 입력만 반영
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
