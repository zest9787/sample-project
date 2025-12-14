import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { message } from "antd";
import {
  UserPickerInput,
  type UserPickerValue,
  type SearchUsersFn,
} from "./UserPickerInput";
import type { Employee } from "@/entities/employee/model/types";

/**
 * Storybook에서 API 없이도 동작을 재현하기 위한 mock 데이터
 */
const MOCK_USERS: Employee[] = [
  { id: "u1", empNo: "10001", name: "김철수", dept: "개발1팀" },
  { id: "u2", empNo: "10002", name: "이영희", dept: "개발2팀" },
  { id: "u3", empNo: "20001", name: "박민수", dept: "인사팀" },
  { id: "u4", empNo: "30001", name: "최지우", dept: "재무팀" },
];

/**
 * Mock 검색 함수: 키워드로 name/empNo/dept를 단순 필터링
 */
const mockSearchUsers: SearchUsersFn = async (keyword) => {
  await new Promise((r) => setTimeout(r, 400));
  const q = keyword.trim().toLowerCase();
  if (!q) return [];
  return MOCK_USERS.filter(
    (u) =>
      u.empNo.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      (u.dept ?? "").toLowerCase().includes(q),
  );
};

/**
 * Mock 검색 함수(에러 시나리오)
 */
const mockSearchUsersError: SearchUsersFn = async () => {
  await new Promise((r) => setTimeout(r, 300));
  throw new Error("서버 오류(스토리 예시)");
};

const meta: Meta<typeof UserPickerInput> = {
  title: "shared/UserPickerInput",
  component: UserPickerInput,
  parameters: {
    layout: "centered",
  },
  args: {
    searchUsers: mockSearchUsers,
    disabled: false,
    empNoPlaceholder: "사번",
    namePlaceholder: "이름",
    modalTitle: "사용자 검색",
  },
};
export default meta;

type Story = StoryObj<typeof UserPickerInput>;

/**
 * 스토리에서 value/onChange를 직접 제어하면(Controlled)
 * 실제 폼에서의 사용 방식과 동일하게 검증 가능
 */
function ControlledDemo(props: React.ComponentProps<typeof UserPickerInput>) {
  const [value, setValue] = React.useState<UserPickerValue>({
    empNo: "",
    name: "",
  });

  return (
    <div style={{ width: 520 }}>
      <UserPickerInput
        {...props}
        value={value}
        onChange={(next) => {
          setValue(next);
          message.success(`선택됨: ${next.empNo} / ${next.name}`);
        }}
      />
      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        현재 값: {value.empNo || "-"} / {value.name || "-"}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

export const Prefilled: Story = {
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = React.useState<UserPickerValue>({
        empNo: "10001",
        name: "김철수",
      });
      return (
        <div style={{ width: 520 }}>
          <UserPickerInput {...args} value={value} onChange={setValue} />
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
            현재 값: {value.empNo} / {value.name}
          </div>
        </div>
      );
    };
    return <Demo />;
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <ControlledDemo {...args} />,
};

export const SearchError: Story = {
  args: { searchUsers: mockSearchUsersError },
  render: (args) => <ControlledDemo {...args} />,
};

export const WithoutEmpNo: Story = {
  args: { showEmpNo: false },
  render: (args) => <ControlledDemo {...args} />,
};
