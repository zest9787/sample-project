import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

type Props = {
  /** 모달 표시 여부 */
  open: boolean;

  /** 모달 제목(선택) */
  title?: string;

  /** 모달 설명(선택) */
  description?: string;

  /** 닫기 트리거 (ESC / 배경 클릭 / 닫기 버튼 등) */
  onClose: () => void;

  /** 본문 컨텐츠 */
  children: React.ReactNode;

  /** 하단 버튼 영역(선택) */
  footer?: React.ReactNode;
};

/**
 * 범용 Modal 컴포넌트(shared/ui)
 * - 도메인 로직 없이 “오픈/클로즈 + 레이아웃 + 접근성 최소치”만 담당
 * - 도메인/유스케이스는 features 레이어에서 조합한다.
 */
export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
}: Props) {
  useEffect(() => {
    if (!open) return;

    // ESC로 닫기 지원 (접근성/UX)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // open 상태가 끝나거나 unmount 시 리스너 정리
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // open이 false면 아예 렌더링하지 않아 이벤트/포커스 문제를 줄임
  if (!open) return null;

  // portal로 body 아래에 렌더하여 z-index/레이아웃 충돌을 줄임
  return createPortal(
    // backdrop 클릭 시 닫힘 (outside click)
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      {/* dialog 영역 클릭은 전파 중단 -> 배경 클릭으로 취급되지 않게 */}
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "dialog"}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <header className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </header>
        )}

        <div className={styles.body}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
