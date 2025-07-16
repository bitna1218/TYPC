'use client';

import React from 'react';
import ResourceUsageTabContent from '../common/ResourceUsageTabContent';
import ResourceDesktopView from '../common/ResourceDesktopView';
import ResourceMobileView from '../common/ResourceMobileView';

// 더미 데이터 - 산업용가스 종류
const DUMMY_INDUSTRIAL_GAS_TYPES = [
  { id: 'oxygen', name: '산소(O₂)', unit: 'm³', factor: 0.3 },
  { id: 'nitrogen', name: '질소(N₂)', unit: 'm³', factor: 0.2 },
  { id: 'argon', name: '아르곤(Ar)', unit: 'm³', factor: 0.35 },
  { id: 'carbon_dioxide', name: '이산화탄소(CO₂)', unit: 'm³', factor: 0.4 },
  { id: 'hydrogen', name: '수소(H₂)', unit: 'm³', factor: 0.25 },
  { id: 'helium', name: '헬륨(He)', unit: 'm³', factor: 0.5 },
  { id: 'acetylene', name: '아세틸렌(C₂H₂)', unit: 'm³', factor: 0.45 },
  { id: 'propane', name: '프로판(C₃H₈)', unit: 'm³', factor: 0.4 },
];

// 더미 데이터 - 단위공정
const DUMMY_UNIT_PROCESSES = [
  { id: 'unit1', name: '단위공정 1' },
  { id: 'unit2', name: '단위공정 2' },
  { id: 'unit3', name: '단위공정 3' },
  { id: 'unit4', name: '단위공정 4' },
  { id: 'unit5', name: '단위공정 5' },
  { id: 'unit6', name: '단위공정 6' },
  { id: 'unit7', name: '단위공정 7' },
  { id: 'unit8', name: '단위공정 8' },
];

interface IndustrialGasUsageContentProps {
  siteId?: string;
}

const IndustrialGasUsageContent: React.FC<IndustrialGasUsageContentProps> = ({ siteId }) => {
  return (
    <ResourceUsageTabContent
      title="6-2. 산업용가스 사용량"
      resourceLabel="산업용가스"
      resourceTypes={DUMMY_INDUSTRIAL_GAS_TYPES}
      unitProcesses={DUMMY_UNIT_PROCESSES}
      siteId={siteId}
      desktopViewComponent={ResourceDesktopView}
      mobileViewComponent={ResourceMobileView}
      helpText="산업용가스 사용량 데이터를 입력하세요. 월별 사용량과 단위공정을 선택하세요."
    />
  );
};

export default IndustrialGasUsageContent; 