export type EmissionProcessItem = {
  value: string;
  label: string;
};

// 공정배출 리스트 데이터
export const emissionProcesses: EmissionProcessItem[] = [
  { value: 'CEMENT_PRODUCTION', label: '시멘트생산' },
  { value: 'LIME_PRODUCTION', label: '석회생산' },
  { value: 'CARBONATE_PROCESS', label: '탄산염 사용공정' },
  { value: 'GLASS_PRODUCTION', label: '유리생산' },
  { value: 'MAGNESIUM_PRODUCTION', label: '마그네슘생산' },
  { value: 'PHOSPHATE_PRODUCTION', label: '인산생산(비료)' },
  { value: 'OIL_REFINING', label: '석유정제' },
  { value: 'AMMONIA_PRODUCTION', label: '암모니아생산' },
  { value: 'NITRIC_ACID_PRODUCTION', label: '질산생산' },
  { value: 'ADIPIC_ACID_PRODUCTION', label: '아프디산생산' },
  { value: 'CARBIDE_PRODUCTION', label: '카바이드생산' },
  { value: 'SODA_ASH_PRODUCTION', label: '소다회생산(Na, CO2)' },
  { value: 'PETROCHEMICAL_PRODUCTION', label: '석유화학제품생산' },
  {
    value: 'FLUORINATED_GAS_PRODUCTION',
    label: '불소화합물(HFC, PFC, SF6)생산',
  },
  { value: 'CAPROLACTAM_PRODUCTION', label: '카프로락탐생산' },
  {
    value: 'STEEL_PRODUCTION',
    label: '철강(코크스로, 소결로, 석회소성로)생산',
  },
  { value: 'FERROALLOY_PRODUCTION', label: '합금철생산' },
  { value: 'ZINC_PRODUCTION', label: '아연생산' },
  { value: 'LEAD_PRODUCTION', label: '납생산' },
  { value: 'ELECTRONICS_INDUSTRY', label: '전자산업' },
  { value: 'FUEL_CELL', label: '연료전지' },
];
