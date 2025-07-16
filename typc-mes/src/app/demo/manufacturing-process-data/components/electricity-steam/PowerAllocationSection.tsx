// components/electricity-steam/PowerAllocationSection.tsx
'use client';

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../Tooltip';
import {
  PowerAllocation,
  AllocationSettings,
} from './ElectricitySteamTabContent';

interface PowerAllocationSectionProps {
  powerAllocations: PowerAllocation[];
  setPowerAllocations: React.Dispatch<React.SetStateAction<PowerAllocation[]>>;
  allocationSettings: AllocationSettings;
}

const PowerAllocationSection: React.FC<PowerAllocationSectionProps> = ({
  powerAllocations,
  setPowerAllocations,
  allocationSettings,
}) => {
  const handleRatioChange = (
    scopeIndex: number,
    unitProcessIndex: number,
    value: string
  ) => {
    const newAllocations = [...powerAllocations];
    const parsedValue = parseFloat(value);
    newAllocations[scopeIndex].unitProcessAllocations[unitProcessIndex].ratio =
      isNaN(parsedValue) ? 0 : parsedValue;

    // Calculate total ratio for the scope
    newAllocations[scopeIndex].totalRatio = parseFloat(
      newAllocations[scopeIndex].unitProcessAllocations
        .reduce((sum, upa) => sum + upa.ratio, 0)
        .toFixed(1)
    );
    setPowerAllocations(newAllocations);
  };

  const isReadOnlyRatio = allocationSettings.allocationMethod === '설비 정보' || allocationSettings.allocationMethod === '제품 생산량';

  // 조건별 제목 및 설명 결정
  const getSectionInfo = () => {
    if (!allocationSettings.hasMeasurement) {
      return {
        title: '1. 계측 값이 없을 때',
        description: '1번 사업장 전력 사용량 표에만 데이터가 있습니다.',
        note: '사업장 전체 단위로 전력 사용 단위공정의 비율을 구합니다. (사업장 단위로 비율 합산 값이 100%를 만족)',
      };
    }

    switch (allocationSettings.measurementRange) {
      case '건물':
        return {
          title: '2. 건물 단위로 계측',
          description:
            '1번 사업장 전력 사용량 표에 데이터가 있고, 2번 계측 값 표에 건물 단위로 데이터가 있습니다.',
          note: '건물 단위로 전력 사용 단위공정의 비율을 구합니다. (건물 별로 비율 합산 값이 100%를 만족)',
        };
      case '공정':
        return {
          title: '3. 공정 단위로 계측',
          description:
            '1번 사업장 전력 사용량 표에 데이터가 있고, 2번 계측 값 표에 공정 단위로 데이터가 있습니다.',
          note: '공정 단위로 전력 사용 단위공정의 비율을 구합니다. (공정 별로 비율 합산 값이 100%를 만족)',
        };
      default:
        return {
          title: '4. 세부공정, 설비 단위로 계측',
          description: '이 경우에는 할당이 필요 없습니다.',
          note: '단위공정에 속해 있는 세부공정/설비들의 전력 사용량을 LCA와 CBAM 솔루션에서 그대로 가져갑니다.',
        };
    }
  };

  const sectionInfo = getSectionInfo();

  // 세부공정/설비 단위일 때는 할당 섹션을 표시하지 않음
  if (
    allocationSettings.measurementRange === '세부공정' ||
    allocationSettings.measurementRange === '설비'
  ) {
    return (
      <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-md'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          {sectionInfo.title}
        </h3>
        <p className='text-green-700 text-sm mb-2'>{sectionInfo.description}</p>
        <p className='text-green-700 text-sm'>{sectionInfo.note}</p>
      </div>
    );
  }

  return (
    <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2 flex items-center'>
          &lt;전력 사용량 비율&gt; 비율 산정방법:
          <Tooltip text={sectionInfo.note}>
            <FaInfoCircle className='ml-1.5 text-blue-500 cursor-pointer' />
          </Tooltip>
        </h3>

        <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded'>
          <p className='text-green-700 text-sm font-medium'>
            {sectionInfo.title}
          </p>
          <p className='text-green-700 text-sm'>{sectionInfo.description}</p>
        </div>

        <div className='mb-4 flex items-center space-x-4'>
          <label className='text-sm font-medium text-gray-700'>
            비율 산정 방법:
          </label>
          <button 
            type="button"
            className='bg-yellow-200 px-3 py-1.5 rounded text-sm font-medium text-yellow-800 hover:bg-yellow-300 border border-yellow-400 shadow-sm'
            // onClick={() => alert('비율 산정 방법 설명 기능 준비 중입니다.')} // 추후 기능 연결
          >
            비율 산정 방법 설명
          </button>
          <button 
            type="button"
            className='px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 border border-gray-400 shadow-sm'
            onClick={() => alert('파일 첨부 기능은 준비 중입니다.')}
          >
            파일 첨부
          </button>
        </div>
      </div>

      <div className='space-y-6'>
        {powerAllocations.map((allocation, allocationIndex) => (
          <div
            key={allocationIndex}
            className='bg-white border border-blue-300 rounded-lg p-4 shadow'
          >
            <h4 className='text-base font-semibold text-gray-800 mb-3'>
              {allocation.scope === '사업장'
                ? '전력 사용 단위공정으로 선택한 단위공정만 나옵니다.'
                : allocation.scopeName}
            </h4>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4'> {/* Adjusted xl:grid-cols-4 for better spacing with sum */}
              {allocation.unitProcessAllocations.map((upa, upaIndex) => (
                <div
                  key={`${allocation.scopeId || '사업장'}-${upa.unitProcessId}-${upaIndex}`}
                  className='bg-blue-50 p-3 rounded-md border border-blue-200 shadow-sm'
                >
                  <div className='text-sm font-medium text-gray-700 mb-1 truncate' title={upa.unitProcessName}>
                    {upa.unitProcessName}
                  </div>
                  <div className='flex items-center space-x-2'>
                    <input
                      type="number"
                      value={upa.ratio.toString()}
                      onChange={(e) =>
                        handleRatioChange(allocationIndex, upaIndex, e.target.value)
                      }
                      readOnly={isReadOnlyRatio}
                      className={`w-full px-2 py-1.5 text-sm border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${isReadOnlyRatio ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder={isReadOnlyRatio ? '자동 계산된 비율' : '비율(%)'}
                    />
                    <span className='text-sm text-gray-600'>%</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 합산 표시 */}
            <div className='flex justify-end items-center mt-4 pt-4 border-t border-blue-200'>
              <div className='text-right mr-2'>
                <div className='text-sm font-medium text-gray-700'>총 비율 합산:</div>
              </div>
              <div
                className={`text-lg font-bold px-2 py-1 rounded ${ // Added padding and rounding
                  Math.abs(allocation.totalRatio - 100) < 0.01 // Stricter check for 100%
                    ? 'text-green-700 bg-green-100 border border-green-300'
                    : 'text-red-700 bg-red-100 border border-red-300'
                }`}
              >
                {allocation.totalRatio.toFixed(1)}%
              </div>
            </div>

            {Math.abs(allocation.totalRatio - 100) >= 0.01 && (
              <p className='text-red-600 text-xs mt-2 text-right'>
                ⚠️ 비율의 합이 정확히 100%가 되어야 합니다.
              </p>
            )}

            {/* 설명 텍스트 - 기존 로직 유지 */}
            {allocation.scope === '사업장' && (
              <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded text-xs'>
                <p className='text-green-700 '>
                  사업장 전체 단위로 전력 사용 단위공정의 비율을 구합니다.
                </p>
                <p className='text-green-700 '>
                  (사업장 단위로 비율 합산 값이 100%를 만족해야 합니다)
                </p>
              </div>
            )}

            {allocation.scope === '건물' && (
              <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded text-xs'>
                <p className='text-green-700 '>
                  건물별로 보정된 전력 사용량 값을 각각의 단위공정에 비율로
                  할당해줍니다.
                </p>
                <p className='text-green-700 '>
                  (예를 들어 {allocation.scopeName}의 보정 값을 단위공정에
                  각각의 비율로 할당합니다. {allocation.scopeName}의 비율 합은 100%를 만족해야 합니다.)
                </p>
              </div>
            )}

            {allocation.scope === '공정' && (
              <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded text-xs'>
                <p className='text-green-700 '>
                  공정별로 보정된 전력 사용량 값을 각각의 단위공정에 비율로
                  할당해줍니다.
                </p>
                <p className='text-green-700 '>
                  (예를 들어 {allocation.scopeName}의 보정 값을 단위공정에
                  각각의 비율로 할당합니다. {allocation.scopeName}의 비율 합은 100%를 만족해야 합니다.)
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PowerAllocationSection;
