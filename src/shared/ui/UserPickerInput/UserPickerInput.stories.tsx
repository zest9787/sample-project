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
    docs: {
      description: {
        component:
          "사용자 검색 및 선택을 위한 컴포넌트입니다. 사번과 이름을 표시하며, 검색 모달을 통해 사용자를 찾을 수 있습니다.",
      },
    },
  },
  argTypes: {
    value: {
      description: "현재 선택된 사용자 정보 (사번, 이름)",
      control: { type: "object" },
    },
    onChange: {
      description: "사용자가 선택되었을 때 호출되는 콜백 함수",
      action: "changed",
      table: {
        type: { summary: "(value: UserPickerValue) => void" },
      },
    },
    searchUsers: {
      description:
        "사용자 검색을 수행하는 비동기 함수. 검색어를 인자로 받아 사용자 목록(Promise)을 반환해야 합니다.",
      table: {
        type: { summary: "(keyword: string) => Promise<Employee[]>" },
      },
    },
    disabled: {
      description: "컴포넌트 비활성화 여부",
      control: { type: "boolean" },
    },
    showEmpNo: {
      description: "사번 입력 필드 표시 여부",
      control: { type: "boolean" },
    },
    empNoPlaceholder: {
      description: "사번 필드의 placeholder",
      control: { type: "text" },
    },
    namePlaceholder: {
      description: "이름 필드의 placeholder",
      control: { type: "text" },
    },
    modalTitle: {
      description: "검색 모달의 제목",
      control: { type: "text" },
    },
  },
  args: {
    searchUsers: mockSearchUsers,
    disabled: false,
    empNoPlaceholder: "사번",
    namePlaceholder: "이름",
    modalTitle: "사용자 검색",
  },
  // 공통 렌더 함수: 모든 스토리가 이 로직을 공유합니다.
  render: (args) => {
    const [value, setValue] = React.useState<UserPickerValue>(
      args.value || { empNo: "", name: "" },
    );

    // args.value가 변경되면(예: 스토리 전환, Controls 변경) 상태 동기화
    React.useEffect(() => {
      setValue(args.value || { empNo: "", name: "" });
    }, [args.value]);

    /**
     * ✅ 사용자 검색 함수 예시
     * 실제 구현에서는 API를 호출하여 Employee[]를 반환해야 합니다.
     */
    const handleSearchUsers: SearchUsersFn = async (keyword) => {
      console.log(`[UserPickerInput] 검색어: ${keyword}`);
      // 여기서는 Storybook args로 전달된 mock 함수를 사용합니다.
      return args.searchUsers(keyword);
    };

    /**
     * ✅ 변경 핸들러 예시
     * 선택된 사용자 정보(UserPickerValue)가 전달됩니다.
     */
    const handleChange = (next: UserPickerValue) => {
      console.log("[UserPickerInput] 변경됨:", next);
      setValue(next);
      args.onChange?.(next);
      message.success(`선택됨: ${next.empNo} / ${next.name}`);
    };

    return (
      <div style={{ width: 520 }}>
        <UserPickerInput
          {...args}
          value={value}
          searchUsers={handleSearchUsers}
          onChange={handleChange}
        />
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          현재 값: {value.empNo || "-"} / {value.name || "-"}
        </div>
      </div>
    );
  },
};
export default meta;

type Story = StoryObj<typeof UserPickerInput>;

const COMMON_SOURCE_CODE = `
const [value, setValue] = React.useState<UserPickerValue>({ empNo: "", name: "" });

// 사용자 검색 함수 (API 호출 예시)
const handleSearchUsers = async (keyword: string) => {
  // const response = await fetch(\`/api/users?q=\${keyword}\`);
  // return response.json();
  return searchUsers(keyword); 
};

// 변경 핸들러
const handleChange = (next: UserPickerValue) => {
  setValue(next);
  console.log("Selected:", next);
};
`;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `${COMMON_SOURCE_CODE}
return (
  <UserPickerInput
    value={value}
    onChange={handleChange}
    searchUsers={handleSearchUsers}
    empNoPlaceholder="사번"
    namePlaceholder="이름"
    modalTitle="사용자 검색"
  />
);`,
      },
    },
  },
};

export const Prefilled: Story = {
  args: {
    value: { empNo: "10001", name: "김철수" },
  },
  parameters: {
    docs: {
      source: {
        code: `
const [value, setValue] = React.useState<UserPickerValue>({ empNo: "10001", name: "김철수" });

// ... (handleSearchUsers, handleChange 동일)

return (
  <UserPickerInput
    value={value}
    onChange={handleChange}
    searchUsers={handleSearchUsers}
    // ...
  />
);`,
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: { empNo: "10001", name: "김철수" },
  },
  parameters: {
    docs: {
      source: {
        code: `${COMMON_SOURCE_CODE}
return (
  <UserPickerInput
    value={value}
    onChange={handleChange}
    searchUsers={handleSearchUsers}
    disabled={true}
  />
);`,
      },
    },
  },
};

export const SearchError: Story = {
  args: {
    searchUsers: mockSearchUsersError,
  },
  parameters: {
    docs: {
      source: {
        code: `
// 에러가 발생하는 검색 함수 예시
const handleSearchUsersError = async () => {
  throw new Error("서버 오류");
};

// ...

return (
  <UserPickerInput
    value={value}
    onChange={handleChange}
    searchUsers={handleSearchUsersError}
  />
);`,
      },
    },
  },
};

export const WithoutEmpNo: Story = {
  args: {
    showEmpNo: false,
  },
  parameters: {
    docs: {
      source: {
        code: `${COMMON_SOURCE_CODE}
return (
  <UserPickerInput
    value={value}
    onChange={handleChange}
    searchUsers={handleSearchUsers}
    showEmpNo={false}
  />
);`,
      },
    },
  },
};
