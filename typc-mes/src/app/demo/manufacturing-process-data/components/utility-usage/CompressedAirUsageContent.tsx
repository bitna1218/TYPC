'use client';

import React from 'react';
import ResourceUsageTabContent from '../common/ResourceUsageTabContent';
import ResourceDesktopView from '../common/ResourceDesktopView';
import ResourceMobileView from '../common/ResourceMobileView';

// 더미 데이터 - 압축공기 종류
const DUMMY_COMPRESSED_AIR_TYPES = [
  { id: 'general_air', name: '일반 압축공기', unit: 'm³', factor: 0.15 },
  { id: 'high_pressure_air', name: '고압 압축공기', unit: 'm³', factor: 0.25 },
  { id: 'low_pressure_air', name: '저압 압축공기', unit: 'm³', factor: 0.1 },
  { id: 'instrument_air', name: '계장용 압축공기', unit: 'm³', factor: 0.2 },
  { id: 'nitrogen', name: '질소', unit: 'm³', factor: 0.3 },
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

interface CompressedAirUsageContentProps {
  siteId?: string;
}

const CompressedAirUsageContent: React.FC<CompressedAirUsageContentProps> = ({ siteId }) => {
  return (
    <ResourceUsageTabContent
      title="6-1. 압축공기 사용량"
      resourceLabel="압축공기"
      resourceTypes={DUMMY_COMPRESSED_AIR_TYPES}
      unitProcesses={DUMMY_UNIT_PROCESSES}
      siteId={siteId}
      desktopViewComponent={ResourceDesktopView}
      mobileViewComponent={ResourceMobileView}
      helpText="압축공기 사용량 데이터를 입력하세요. 단위공정은 다중 선택이 가능합니다."
    />
  );
};

export default CompressedAirUsageContent; 