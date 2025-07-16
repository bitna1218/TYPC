// components/electricity-steam/AllocationMethodSection.tsx
'use client';

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../Tooltip';
import { AllocationSettings } from './ElectricitySteamTabContent';

interface AllocationMethodSectionProps {
  allocationSettings: AllocationSettings;
  setAllocationSettings: React.Dispatch<React.SetStateAction<AllocationSettings>>;
}

const AllocationMethodSection: React.FC<AllocationMethodSectionProps> = ({
  allocationSettings,
  setAllocationSettings,
}) => {


  const handleMethodChange = (method: '설비 정보' | '제품 생산량' | '비율 직접 입력') => {
    setAllocationSettings(prev => ({
      ...prev,
      allocationMethod: method,
    }));
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              할당방법:
              <Tooltip text="할당 방법을 [1-5. 데이터 관리 방식]에서 가져옵니다.">
                <FaInfoCircle className="inline ml-1 text-blue-500 cursor-pointer" />
              </Tooltip>
            </label>
            <select
              value={allocationSettings.allocationMethod}
              onChange={(e) => handleMethodChange(e.target.value as '설비 정보' | '제품 생산량' | '비율 직접 입력')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="설비 정보">설비 정보</option>
              <option value="제품 생산량">제품 생산량</option>
              <option value="비율 직접 입력">비율 직접 입력</option>
            </select>
          </div>
        </div>
      </div>

      {/* 설명 메시지 */}
      <div className="mt-4 space-y-2">
        {allocationSettings.allocationMethod === '설비 정보' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700 text-sm">
              설비 정보 기반으로 자동 할당됩니다. 별도 입력이 필요하지 않습니다.
            </p>
          </div>
        )}
        
        {allocationSettings.allocationMethod === '제품 생산량' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700 text-sm">
              제품 생산량 기반으로 자동 할당됩니다. 별도 입력이 필요하지 않습니다.
            </p>
          </div>
        )}
        
        {allocationSettings.allocationMethod === '비율 직접 입력' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-700 text-sm">
              단위공정별로 비율을 직접 입력해야 합니다. 각 범위별로 비율 합계가 100%가 되어야 합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocationMethodSection;