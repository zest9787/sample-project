import React, { useMemo, useState } from "react";
import { type Employee, EmployeeListItem } from "@/entities/employee";
import { useDebouncedValue } from "@/shared/lib/hooks/useDebouncedValue";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";
import type { SearchEmployeesFn } from "../../model/types";
import styles from "./EmployeeSearchModal.module.css";

type Props = {
  /** 모달 표시 여부 */
  open: boolean;

  /** 모달 닫기 */
  onClose: () => void;

  /** 사원 선택 완료 시 호출 */
  onSelect: (employee: Employee) => void;

  /**
   * 검색 함수 주입(권장)
   * - Storybook에서는 mock 주입으로 동작을 재현
   * - 실제 서비스에서는 API 함수를 주입하거나 내부 기본값을 API로 둘 수 있음
   */
  searchEmployees?: SearchEmployeesFn;

  /** 타이틀/설명 커스터마이즈 */
  title?: string;
  description?: string;

  /** 모달 오픈 시 초기 검색어(선택) */
  initialQuery?: string;
};

// 기본 동작(미주입 시): 빈 결과
const defaultSearchEmployees: SearchEmployeesFn = async () => [];

/**
 * EmployeeSearchModal (features)
 * - “사원 검색 후 선택”이라는 유스케이스를 구현
 * - entities(employee)를 활용해 결과를 표현
 * - shared(ui/modal,input,button)를 조합해 화면을 구성
 */
export function EmployeeSearchModal({
  open,
  onClose,
  onSelect,
  searchEmployees = defaultSearchEmployees,
  title = "사원 검색",
  description = "이름/부서/이메일로 검색 후 사원을 선택하세요.",
  initialQuery = "",
}: Props) {
  /** 입력값(즉시 변함) */
  const [query, setQuery] = useState(initialQuery);

  /** 디바운스된 검색어(잠시 멈췄을 때만 바뀜) */
  const debounced = useDebouncedValue(query, 250);

  /** 검색 상태 */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 검색 결과 목록 */
  const [items, setItems] = useState<Employee[]>([]);

  /** 현재 선택된 사원 id */
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /**
   * 선택된 Employee 객체를 items에서 찾아낸다.
   * - selectedId만 들고 있으면 items 변경에도 안전
   */
  const selected = useMemo(
    () => items.find((x) => x.id === selectedId) ?? null,
    [items, selectedId],
  );

  /**
   * 모달이 열릴 때 상태를 초기화한다.
   * - 이전에 검색했던 내용/선택이 남아 있지 않도록
   */
  React.useEffect(() => {
    if (!open) return;

    setError(null);
    setLoading(false);
    setItems([]);
    setSelectedId(null);

    // 오픈할 때 initialQuery로 query를 맞춰준다.
    setQuery(initialQuery);
  }, [open, initialQuery]);

  /**
   * debounced가 변할 때(=입력이 잠시 멈출 때) 검색을 수행한다.
   * - open 상태일 때만 실행
   * - query가 비었으면 결과 초기화
   */
  React.useEffect(() => {
    if (!open) return;

    const q = debounced.trim();

    // 빈 검색어면 API 호출 없이 초기 상태로 돌린다.
    if (q.length === 0) {
      setItems([]);
      setSelectedId(null);
      setError(null);
      setLoading(false);
      return;
    }

    // 비동기 응답 레이스 방지 플래그(이전 요청이 늦게 도착하는 경우)
    let cancelled = false;

    setLoading(true);
    setError(null);

    searchEmployees(q)
      .then((res) => {
        if (cancelled) return;

        setItems(res);

        // UX: 첫 결과를 기본 선택으로 잡아주면 키보드/클릭 최소화
        setSelectedId(res[0]?.id ?? null);
      })
      .catch((e) => {
        if (cancelled) return;

        // 사용자 메시지로 보여줄 error string 구성
        setError(
          e instanceof Error ? e.message : "검색 중 오류가 발생했습니다.",
        );
        setItems([]);
        setSelectedId(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    // effect가 다시 실행되거나 unmount 되면 cancelled 처리
    return () => {
      cancelled = true;
    };
  }, [open, debounced, searchEmployees]);

  /**
   * “선택” 버튼 클릭 시:
   * - selected가 없으면 아무 것도 하지 않음
   * - 선택 결과를 부모에 전달하고 모달을 닫는다.
   */
  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
          <Button onClick={handleConfirm} disabled={!selected}>
            선택
          </Button>
        </>
      }
    >
      <div className={styles.stack}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="예) 김철수 / 개발1팀 / chulsoo@company.com"
          autoFocus
        />

        <div className={styles.resultHeader}>
          <div className={styles.hint}>
            {loading
              ? "검색 중..."
              : debounced.trim()
                ? `검색어: "${debounced.trim()}"`
                : "검색어를 입력하세요."}
          </div>

          {/* 에러 메시지는 사용자에게 눈에 띄게 */}
          {error && <div className={styles.error}>{error}</div>}
        </div>

        {/* 목록 영역 */}
        <div
          className={styles.list}
          role="listbox"
          aria-label="employee results"
        >
          {/* 결과 없음 상태 */}
          {!loading && !error && debounced.trim() && items.length === 0 && (
            <div className={styles.empty}>검색 결과가 없습니다.</div>
          )}

          {/* 결과 렌더링 */}
          {items.map((emp) => (
            <EmployeeListItem
              key={emp.id}
              employee={emp}
              selected={emp.id === selectedId}
              // 클릭하면 해당 항목을 선택 상태로
              onClick={() => setSelectedId(emp.id)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
