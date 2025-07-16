'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';

interface UnitProcess {
  id: string;
  name: string;
  processGroup: string;
}

interface BoilerAllocation {
  unitProcessId: string;
  unitProcessName: string;
  processGroup: string;
  ratio: number;
  description?: string;
}

interface BoilerData {
  id: string;
  name: string;
  relatedUnitProcesses: string[];
  allocationMethod: 'steam-usage' | 'product-volume' | 'facility-info' | 'direct-input';
  allocations: BoilerAllocation[];
  totalRatio: number;
  ratioCalculationDescription: string;
}

interface BoilerSummaryCardProps {
  boiler: BoilerData;
  unitProcesses: UnitProcess[];
  isSelected: boolean;
  isSaved: boolean;
  onClick: () => void;
}

const BoilerSummaryCard: React.FC<BoilerSummaryCardProps> = ({
  boiler,
  isSelected,
  isSaved,
  onClick,
}) => {
  // 단위공정 수
  const unitProcessCount = boiler.relatedUnitProcesses.length;
  
  // 할당 방법 한국어 변환
  const getAllocationMethodText = (method: string) => {
    switch (method) {
      case 'steam-usage':
        return '스팀 사용량';
      case 'product-volume':
        return '제품 생산량';
      case 'facility-info':
        return '시설 정보';
      case 'direct-input':
        return '직접 입력';
      default:
        return method;
    }
  };

  // 보일러 상태 확인
  const getBoilerStatus = () => {
    if (isSaved) return 'saved';
    if (unitProcessCount === 0) return 'empty';
    return 'draft';
  };

  const status = getBoilerStatus();

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
          {boiler.name}
        </h3>
        {isSaved && (
          <FaCheck className="text-green-600" size={16} title="저장 완료" />
        )}
      </div>

      {/* 요약 정보 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">단위공정 수:</span>
          <span className="font-medium text-gray-800">
            {unitProcessCount}개
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">할당 방법:</span>
          <span className="text-sm text-gray-800">
            {getAllocationMethodText(boiler.allocationMethod)}
          </span>
        </div>

        {/* 상태 표시 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">상태:</span>
          <span
            className={`rounded px-2 py-1 text-xs font-medium ${
              status === 'saved'
                ? 'bg-green-100 text-green-700'
                : status === 'draft'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {status === 'saved' ? '완료' : status === 'draft' ? '작성중' : '미설정'}
          </span>
        </div>

        {/* 할당 방법별 추가 정보 */}
        {unitProcessCount > 0 && (
          <div className="mt-3 rounded bg-gray-50 p-2">
            <div className="text-xs text-gray-600">
              {boiler.allocationMethod === 'direct-input' 
                ? '비율을 직접 입력하여 할당'
                : '자동 계산으로 할당'
              }
            </div>
          </div>
        )}
      </div>

      {/* 선택 표시 */}
      {isSelected && (
        <div className="mt-3 rounded bg-blue-100 p-2 text-center text-xs text-blue-700">
          상세 설정을 아래에서 확인하세요
        </div>
      )}
    </div>
  );
};

export default BoilerSummaryCard; 