'use client';

import React from 'react';
import ResourceUsageTabContent from '../common/ResourceUsageTabContent';
import ResourceDesktopView from '../common/ResourceDesktopView';
import ResourceMobileView from '../common/ResourceMobileView';

// 더미 데이터 - 용수 종류
const DUMMY_WATER_TYPES = [
  { id: 'industrial', name: '공업용수', unit: 'm³', factor: 0.2 },
  { id: 'tap', name: '상수도', unit: 'm³', factor: 0.3 },
  { id: 'underground', name: '지하수', unit: 'm³', factor: 0.1 },
  { id: 'river', name: '하천수', unit: 'm³', factor: 0.1 },
  { id: 'lake', name: '호소수', unit: 'm³', factor: 0.1 },
  { id: 'reused', name: '재이용수', unit: 'm³', factor: 0.05 },
  { id: 'sea', name: '해수', unit: 'm³', factor: 0.3 },
  { id: 'rain', name: '빗물', unit: 'm³', factor: 0.05 },
];

// 더미 데이터 - 단위공정 (FuelUsageTabContent와 동일)
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

interface WaterUsageTabContentProps {
  siteId?: string;
}

const WaterUsageTabContent: React.FC<WaterUsageTabContentProps> = ({ siteId }) => {
  return (
    <ResourceUsageTabContent
      title="3. 용수 사용량"
      resourceLabel="용수"
      resourceTypes={DUMMY_WATER_TYPES}
      unitProcesses={DUMMY_UNIT_PROCESSES}
      siteId={siteId}
      desktopViewComponent={ResourceDesktopView}
      mobileViewComponent={ResourceMobileView}
      helpText="용수 사용량 데이터를 입력하세요. 월별 사용량과 단위공정을 선택하세요."
    />
  );
};

export default WaterUsageTabContent;
