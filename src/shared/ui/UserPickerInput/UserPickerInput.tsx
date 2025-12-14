import React from "react";
import { Button, Input, Modal, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import type { Employee } from "@/entities/employee/model/types";

export type UserPickerValue = {
  empNo: string;
  name: string;
};

export type SearchUsersFn = (keyword: string) => Promise<Employee[]>;

export type UserPickerInputProps = {
  /** controlled value */
  value?: UserPickerValue;
  /** controlled setter */
  onChange?: (next: UserPickerValue) => void;

  /** 검색 함수 주입 */
  searchUsers: SearchUsersFn;

  /** disabled 처리 */
  disabled?: boolean;

  /** placeholder */
  empNoPlaceholder?: string;
  namePlaceholder?: string;

  /** Modal 옵션 */
  modalTitle?: string;

  /**
   * ✅ 사번 입력박스 표시 여부 (옵션)
   * - true(기본): 사번 + 이름 + 검색버튼
   * - false: 이름 + 검색버튼
   */
  showEmpNo?: boolean;
};

function useControllableValue<T>(
  propsValue: T | undefined,
  onChange?: (v: T) => void,
  defaultValue?: T,
) {
  const [inner, setInner] = React.useState<T | undefined>(defaultValue);
  const isControlled = propsValue !== undefined;

  const value = isControlled ? (propsValue as T) : inner;

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue] as const;
}

export function UserPickerInput({
  value: propsValue,
  onChange,
  searchUsers,
  disabled,
  empNoPlaceholder = "사번",
  namePlaceholder = "이름",
  modalTitle = "사용자 검색",
  showEmpNo = true,
}: UserPickerInputProps) {
  const [value, setValue] = useControllableValue<UserPickerValue>(
    propsValue,
    onChange,
    { empNo: "", name: "" },
  );

  const [open, setOpen] = React.useState(false);

  const [keyword, setKeyword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<Employee | null>(null);

  const columns: ColumnsType<Employee> = [
    { title: "사번", dataIndex: "empNo", key: "empNo", width: 140 },
    { title: "이름", dataIndex: "name", key: "name", width: 180 },
    { title: "부서", dataIndex: "dept", key: "dept" },
  ];

  React.useEffect(() => {
    if (!open) return;
    setKeyword("");
    setRows([]);
    setSelectedUser(null);
  }, [open]);

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSearch = async () => {
    const q = keyword.trim();
    if (!q) {
      setRows([]);
      setSelectedUser(null);
      return;
    }

    setLoading(true);
    try {
      const result = await searchUsers(q);
      setRows(result);
      setSelectedUser(result[0] ?? null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedUser) return;

    // ✅ 선택된 사용자 정보를 상태에 반영
    // showEmpNo=false여도 value.empNo는 유지(set)해둠(폼 제출/후속 로직에 유용)
    setValue({ empNo: selectedUser.empNo, name: selectedUser.name });
    setOpen(false);
  };

  return (
    <>
      <Space.Compact style={{ width: "100%" }}>
        {showEmpNo && (
          <Input
            value={value?.empNo}
            placeholder={empNoPlaceholder}
            disabled={disabled}
            readOnly
            style={{ width: 140 }}
          />
        )}

        <Input
          value={value?.name}
          placeholder={namePlaceholder}
          disabled={disabled}
          readOnly
        />

        <Button
          icon={<SearchOutlined />}
          onClick={handleOpen}
          disabled={disabled}
          aria-label="사용자 검색"
        />
      </Space.Compact>

      <Modal
        title={modalTitle}
        open={open}
        onCancel={handleClose}
        onOk={handleConfirm}
        okButtonProps={{ disabled: !selectedUser }}
        okText="선택"
        cancelText="닫기"
        width={720}
      >
        <Space orientation={"vertical"} style={{ width: "100%" }} size={12}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="이름/사번/부서 등으로 검색"
              onPressEnter={handleSearch}
              autoFocus
            />
            <Button
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
            >
              검색
            </Button>
          </Space.Compact>

          <Typography.Text type="secondary">
            행을 클릭해서 사용자를 선택한 뒤 “선택”을 누르세요.
          </Typography.Text>

          <Table<Employee>
            rowKey="id"
            size="middle"
            loading={loading}
            columns={columns}
            dataSource={rows}
            pagination={{ pageSize: 8 }}
            onRow={(record) => ({
              onClick: () => setSelectedUser(record),
            })}
            rowClassName={(record) =>
              record.id === selectedUser?.id ? "ant-table-row-selected" : ""
            }
          />
        </Space>
      </Modal>
    </>
  );
}
