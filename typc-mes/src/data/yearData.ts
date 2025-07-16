// Define types for organization data
export interface OrganizationData {
  companyName: string;
  representative: string;
  registrationNumber: string;
  industry: string;
  industryCategory: string;
  selectedEmissionProcesses: string[];
  address: string;
  companyPhoneNumber: string;
  name: string;
  department: string;
  position: string;
  phoneNumber: string;
  mobileNumber: string;
  email: string;
}

// Dummy data for different years
export const yearData: Record<number, OrganizationData> = {
  2023: {
    companyName: '그린테크 주식회사',
    representative: '김환경',
    registrationNumber: '123456-7890123',
    industry: '화학물질 및 화학제품 제조업',
    industryCategory: '제조업',
    selectedEmissionProcesses: ['암모니아생산', '석유화학제품생산'],
    address: '서울특별시 강남구 테헤란로 123',
    companyPhoneNumber: '02-1234-5678',
    name: '박지속',
    department: '환경안전팀',
    position: '팀장',
    phoneNumber: '02-1234-5678',
    mobileNumber: '010-9876-5432',
    email: 'park@greentech.com',
  },
  2024: {
    companyName: '그린테크 주식회사',
    representative: '이에코',
    registrationNumber: '123456-7890123',
    industry: '화학물질 및 화학제품 제조업',
    industryCategory: '제조업',
    selectedEmissionProcesses: [
      '암모니아생산',
      '석유화학제품생산',
      '불소화합물(HFC, PFC, SF6)생산',
    ],
    address: '서울특별시 강남구 테헤란로 456',
    companyPhoneNumber: '02-2345-6789',
    name: '정탄소',
    department: '환경안전팀',
    position: '과장',
    phoneNumber: '02-2345-6789',
    mobileNumber: '010-8765-4321',
    email: 'jung@greentech.com',
  },
  2025: {
    companyName: '에코솔루션 주식회사',
    representative: '최그린',
    registrationNumber: '234567-8901234',
    industry: '기타 기계 및 장비 제조업',
    industryCategory: '제조업',
    selectedEmissionProcesses: [],
    address: '부산광역시 해운대구 센텀중앙로 789',
    companyPhoneNumber: '051-987-6543',
    name: '한미래',
    department: '지속가능경영팀',
    position: '책임',
    phoneNumber: '051-987-6543',
    mobileNumber: '010-1234-5678',
    email: 'han@ecosolution.com',
  },
};

// 연도별 데이터 상태 정보
export const yearStatusData: Record<
  number,
  {
    status: 'completed' | 'in-progress' | 'not-started';
    lastModified?: string;
  }
> = {
  2023: { status: 'completed', lastModified: '2023-12-15' },
  2024: { status: 'in-progress', lastModified: '2024-05-10' },
  2025: { status: 'not-started' },
};
