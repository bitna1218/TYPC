'use client';

import React from 'react';
import ResourceUsageTabContent from '../common/ResourceUsageTabContent';
import ResourceDesktopView from '../common/ResourceDesktopView';
import ResourceMobileView from '../common/ResourceMobileView';

// 더미 데이터 - 연료 종류
const DUMMY_FUEL_TYPES = [
  { id: 'diesel', name: '디젤', unit: 'L', factor: 2.6 },
  { id: 'gasoline', name: '가솔린', unit: 'L', factor: 2.3 },
  { id: 'lng', name: 'LNG', unit: 'm³', factor: 2.0 },
  { id: 'lpg', name: 'LPG', unit: 'kg', factor: 3.0 },
  { id: 'coal', name: '석탄', unit: 'ton', factor: 2.8 },
  { id: 'heavy_oil', name: '중유', unit: 'L', factor: 3.1 },
  { id: 'kerosene', name: '등유', unit: 'L', factor: 2.5 },
  { id: 'wood_pellet', name: '목재펠릿', unit: 'kg', factor: 0.5 },
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

interface FuelUsageTabContentProps {
  siteId?: string;
}

const FuelUsageTabContent: React.FC<FuelUsageTabContentProps> = ({ siteId }) => {
  return (
    <ResourceUsageTabContent
      title="4. 연료 사용량"
      resourceLabel="연료"
      resourceTypes={DUMMY_FUEL_TYPES}
      unitProcesses={DUMMY_UNIT_PROCESSES}
      siteId={siteId}
      desktopViewComponent={ResourceDesktopView}
      mobileViewComponent={ResourceMobileView}
      helpText="연료 사용량 데이터를 입력하세요. 단위공정은 다중 선택이 가능합니다."
    />
  );
};

export default FuelUsageTabContent;
