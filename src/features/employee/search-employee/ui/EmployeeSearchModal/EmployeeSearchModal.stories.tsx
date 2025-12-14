import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EmployeeSearchModal } from "./EmployeeSearchModal";
import type { Employee } from "@/entities/employee";
import type { SearchEmployeesFn } from "../../model/types";
import { Button } from "@/shared/ui/Button";

/**
 * Storybook 목적:
 * - 실제 API 없이도 모달 UX(검색/로딩/에러/초기검색어)를 재현
 * - searchEmployees를 “주입”해 시나리오별 테스트 가능하게
 */
const meta: Meta<typeof EmployeeSearchModal> = {
  title: "features/사원검색/일반사원검색",
  component: EmployeeSearchModal,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof EmployeeSearchModal>;

// 스토리에서 사용할 샘플 데이터
const MOCK: Employee[] = [
  {
    id: "1",
    empNo: "1",
    name: "김철수",
    department: "개발1팀",
    position: "FE",
    email: "chulsoo@company.com",
  },
  {
    id: "2",
    empNo: "2",
    name: "이영희",
    department: "개발2팀",
    position: "BE",
    email: "younghee@company.com",
  },
  {
    id: "3",
    empNo: "3",
    name: "박민수",
    department: "인사팀",
    position: "HR",
    email: "minsu@company.com",
  },
  {
    id: "4",
    empNo: "4",
    name: "최지우",
    department: "재무팀",
    position: "Finance",
    email: "jiwoo@company.com",
  },
];

/**
 * Mock 검색 함수:
 * - 지연을 넣어 로딩 상태를 확인 가능
 * - query로 name/department/email을 단순 필터링
 */
const mockSearch: SearchEmployeesFn = async (query) => {
  // 네트워크 지연처럼 보이게
  await new Promise((r) => setTimeout(r, 500));

  const q = query.toLowerCase();
  return MOCK.filter((e) => {
    return (
      e.name.toLowerCase().includes(q) ||
      (e.department ?? "").toLowerCase().includes(q) ||
      (e.email ?? "").toLowerCase().includes(q)
    );
  });
};

/**
 * Demo 래퍼:
 * - 스토리에서 open/onClose를 직접 관리하면 UX가 더 현실적
 * - 스토리 “렌더 함수”는 데모 컴포넌트를 반환
 */
function Demo(
  props: Omit<
    React.ComponentProps<typeof EmployeeSearchModal>,
    "open" | "onClose"
  >,
) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ width: 420 }}>
      <div style={{ marginBottom: 12 }}>
        <Button onClick={() => setOpen(true)}>사원검색 모달 열기</Button>
      </div>

      <EmployeeSearchModal
        {...props}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Demo
      searchEmployees={mockSearch}
      onSelect={(emp) =>
        alert(`선택됨: ${emp.name} (${emp.department ?? "-"})`)
      }
    />
  ),
};

export const WithInitialQuery: Story = {
  render: () => (
    <Demo
      initialQuery="개발"
      searchEmployees={mockSearch}
      onSelect={(emp) => alert(`선택됨: ${emp.name}`)}
    />
  ),
};

export const ErrorState: Story = {
  render: () => (
    <Demo
      // 에러 시나리오 재현: 항상 실패
      searchEmployees={async () => {
        await new Promise((r) => setTimeout(r, 400));
        throw new Error("서버 오류(예시)");
      }}
      onSelect={() => {}}
    />
  ),
};
