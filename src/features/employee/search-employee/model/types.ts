import type { Employee } from "@/entities/employee";

/**
 * 사원 검색 함수 시그니처
 * - API/Mock/테스트 등 외부에서 주입 가능
 * - query를 받아 Employee 목록을 반환
 */
export type SearchEmployeesFn = (query: string) => Promise<Employee[]>;
