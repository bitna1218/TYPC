import {
  OrganizationData,
  yearData,
  yearStatusData,
} from '@/app/demo/data/yearData';

/**
 * 특정 연도의 데이터를 불러오는 함수
 * @param year 불러올 연도
 * @returns 해당 연도의 데이터 또는 빈 데이터
 */
export const loadYearData = (year: number): OrganizationData => {
  // 해당 연도 데이터가 있으면 반환, 없으면 빈 객체 반환
  return (
    yearData[year] || {
      companyName: '',
      representative: '',
      registrationNumber: '',
      industry: '',
      industryCategory: '',
      selectedEmissionProcesses: [],
      address: '',
      companyPhoneNumber: '',
      name: '',
      department: '',
      position: '',
      phoneNumber: '',
      mobileNumber: '',
      email: '',
    }
  );
};

/**
 * 연도별 데이터 상태 정보를 가져오는 함수
 * @param year 확인할 연도
 * @returns 해당 연도 데이터의 상태 정보
 */
export const getYearStatus = (
  year: number,
): {
  status: 'completed' | 'in-progress' | 'not-started';
  lastModified?: string;
} => {
  return yearStatusData[year] || { status: 'not-started' };
};

// Re-export the OrganizationData type for convenience
export type { OrganizationData };
