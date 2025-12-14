import type { Employee } from "../../model/types";
import styles from "./EmployeeListItem.module.css";

type Props = {
  employee: Employee;
  onClick?: () => void;
  selected?: boolean;
};

export function EmployeeListItem({ employee, onClick, selected }: Props) {
  return (
    <button
      type="button"
      className={[styles.item, selected ? styles.selected : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
    >
      <div className={styles.main}>
        <div className={styles.name}>{employee.name}</div>
        <div className={styles.meta}>
          {[employee.department, employee.position].filter(Boolean).join(" · ")}
        </div>
      </div>
      {employee.email && <div className={styles.email}>{employee.email}</div>}
    </button>
  );
}
