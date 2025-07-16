/**
 * 공통 코드 그룹을 정의하는 상수
 * API에서 사용하는 group_code 값을 관리합니다.
 */
export const CODE_GROUP = {
  KSIC_L1: 'KSIC11_L1',
  KSIC_L2: 'KSIC11_L2',
  KSIC_ACTIVE: 'KSIC_ACTIVE',
  KSIC_VER: 'KSIC_VER',
  LAND_TYPE: 'LAND_TYPE',
  ALLOC_TYPE: 'ALLOC_TYPE',
  MEASURE_SCOPE: 'MEASURE_SCOPE',
  TRANSPORT: 'TRANSPORT',
  SUPPLY_CHAIN: 'SUPPLY_CHAIN',
} as const;

export type CodeGroup = (typeof CODE_GROUP)[keyof typeof CODE_GROUP];
