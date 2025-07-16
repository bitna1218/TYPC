'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface UnitProcess {
  id: string;
  name: string;
  processGroup: string;
  hasBoiler?: boolean;
}

interface MonthlyFlowData {
  month: number;
  flow: number;
}

interface UnitProcessFlowData {
  unitProcessId: string;
  monthlyFlowData: MonthlyFlowData[];
  totalFlow: number;
}

interface FacilityAllocation {
  unitProcessId: string;
  unitProcessName: string;
  processGroup: string;
  ratio: number;
  description?: string;
}

interface AirPollutionFacilityInput {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  relatedUnitProcesses: string[];
  hasFlowManagement: boolean;
  monthlyFlowData: MonthlyFlowData[];
  unitProcessFlowData: UnitProcessFlowData[];
  totalFlow: number;
  dqi: 'M' | 'C' | 'E' | '';
  allocationMethod: 'gas-flow' | 'product-volume' | 'direct-input';
  allocations: FacilityAllocation[];
  attachedFile?: File | null;
  remarks: string;
}

interface FacilitySummaryCardProps {
  facility: AirPollutionFacilityInput;
  unitProcesses: UnitProcess[];
  isSelected: boolean;
  onClick: () => void;
}

const FacilitySummaryCard: React.FC<FacilitySummaryCardProps> = ({
  facility,
  isSelected,
  onClick,
}) => {
  // 총 유량 계산
  const totalFlow = facility.totalFlow;

  // 단위공정 수
  const unitProcessCount = facility.relatedUnitProcesses.length;

  // 저장 여부 확인 (총 유량이 있고 단위공정이 있으면 저장된 것으로 간주)
  const hasSavedData = totalFlow > 0 && unitProcessCount > 0;

  return (
    <div
      className={`min-w-[280px] flex-shrink-0 cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      {/* 카드 헤더 */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {facility.facilityName}
        </h3>
        {hasSavedData && (
          <FaCheck className="text-green-600" size={16} title="데이터 저장됨" />
        )}
      </div>

      {/* 요약 정보 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">총 유량:</span>
          <span className="font-medium text-gray-800">
            {totalFlow > 0 ? `${totalFlow.toLocaleString()} ㎥/hr` : '미입력'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">단위공정 수:</span>
          <span className="font-medium text-gray-800">
            {unitProcessCount}개
          </span>
        </div>

        {facility.hasFlowManagement && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">유량 관리:</span>
            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
              활성화
            </span>
          </div>
        )}

        {facility.allocationMethod && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">할당 방법:</span>
            <span className="text-xs text-gray-800">
              {facility.allocationMethod === 'gas-flow' && '배가스 유량'}
              {facility.allocationMethod === 'product-volume' && '제품 생산량'}
              {facility.allocationMethod === 'direct-input' && '직접 입력'}
            </span>
          </div>
        )}
      </div>

      {/* 선택 표시 */}
      {isSelected && (
        <div className="mt-3 rounded bg-blue-100 p-2 text-center text-xs text-blue-700">
          상세 정보를 아래에서 확인하세요
        </div>
      )}
    </div>
  );
};

export default FacilitySummaryCard;
