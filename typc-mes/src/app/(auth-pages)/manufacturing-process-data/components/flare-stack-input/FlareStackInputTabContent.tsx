'use client';

import React, { useState, useEffect } from 'react';
import { FaSave, FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../common/Tooltip';
import FlareStackInputDesktopView from './FlareStackInputDesktopView';
import FlareStackInputMobileView from './FlareStackInputMobileView';
import type { UnitProcessAllocation } from '../common/ResourceUsageTabContent';

// 플래어스택 항목 타입 정의
export interface FlareStackItem {
  id: string;
  flareGasName: string; // 폐가스명
  density: string; // 밀도
  unit: string; // 단위 (ton, Nm³)
  unitProcesses: string[];
  monthlyInput: {
    month: number;
    amount: number;
  }[];
  totalAmount: number;
  dqi: string;
  note: string;
  attachedFile: File | null;
}

// 더미 데이터 - 단위
const DUMMY_UNITS = [
  { id: 'ton', name: 'ton' },
  { id: 'Nm3', name: 'Nm³' },
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

interface FlareStackInputTabContentProps {
  siteId?: string;
}

const FlareStackInputTabContent: React.FC<FlareStackInputTabContentProps> = ({ siteId }) => {
  // 상태 관리
  const [flareStackData, setFlareStackData] = useState<FlareStackItem[]>([]);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [allocationSettings, setAllocationSettings] = useState({
    enabled: false,
    method: '제품 생산량' as '제품 생산량' | '비율 직접 입력',
  });
  const [allocations, setAllocations] = useState<UnitProcessAllocation[]>([]);

  // 모바일 뷰 감지
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    if (typeof window !== 'undefined') {
      checkMobileView();
      window.addEventListener('resize', checkMobileView);
      return () => window.removeEventListener('resize', checkMobileView);
    }
  }, []);

  // 초기 데이터 생성
  useEffect(() => {
    if (siteId) {
      // 서버에서 데이터를 가져오는 로직 추가 예정
    }

    // 초기 데이터가 없는 경우 생성
    if (flareStackData.length === 0) {
      const initialItem: FlareStackItem = {
        id: `flarestack_1`,
        flareGasName: '',
        density: '',
        unit: 'Nm3',
        unitProcesses: [],
        monthlyInput: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          amount: 0,
        })),
        totalAmount: 0,
        dqi: 'M',
        note: '',
        attachedFile: null,
      };

      setFlareStackData([initialItem]);
    }
  }, [siteId, flareStackData.length]);

  // 할당 데이터 업데이트
  useEffect(() => {
    if (allocationSettings.enabled) {
      const newAllocations = flareStackData
        .filter((item) => item.unitProcesses.length > 0)
        .map((item) => {
          return {
            resourceId: item.id,
            resourceName: item.flareGasName || '플래어스택',
            unitProcessAllocations: item.unitProcesses.map((processId) => {
              const process = DUMMY_UNIT_PROCESSES.find(
                (p) => p.id === processId
              );
              return {
                unitProcessId: processId,
                unitProcessName: process?.name || '',
                ratio:
                  allocationSettings.method === '제품 생산량'
                    ? Math.round((100 / item.unitProcesses.length) * 10) / 10
                    : 0,
              };
            }),
            totalRatio: allocationSettings.method === '제품 생산량' ? 100 : 0,
          };
        });
      setAllocations(newAllocations);
    }
  }, [allocationSettings.enabled, allocationSettings.method, flareStackData]);

  // 플래어스택 항목 추가
  const handleAddFlareStackItem = () => {
    const newId =
      flareStackData.length > 0
        ? 'flarestack_' +
          (Math.max(
            ...flareStackData.map((item) =>
              parseInt(item.id.split('_')[1] || '0')
            )
          ) +
            1)
        : 'flarestack_1';

    const newItem: FlareStackItem = {
      id: newId,
      flareGasName: '',
      density: '',
      unit: 'Nm3',
      unitProcesses: [],
      monthlyInput: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        amount: 0,
      })),
      totalAmount: 0,
      dqi: 'M',
      note: '',
      attachedFile: null,
    };

    setFlareStackData((prev) => [...prev, newItem]);
  };

  // 플래어스택 항목 삭제
  const handleDeleteFlareStackItem = (id: string) => {
    if (flareStackData.length <= 1) {
      alert('최소 1개 이상의 플래어스택 유입량 항목이 필요합니다.');
      return;
    }

    if (window.confirm('선택한 플래어스택 유입량 항목을 삭제하시겠습니까?')) {
      setFlareStackData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 필드 변경 핸들러
  const handleFieldChange = (
    id: string,
    field: keyof FlareStackItem,
    value: string | string[] | number
  ) => {
    setFlareStackData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // 월별 유입량 변경 핸들러
  const handleMonthlyInputChange = (
    id: string,
    month: number,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;

    setFlareStackData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedMonthlyInput = item.monthlyInput.map(
            (monthData) =>
              monthData.month === month
                ? { ...monthData, amount: numValue }
                : monthData
          );

          const totalAmount = updatedMonthlyInput.reduce(
            (sum, data) => sum + data.amount,
            0
          );

          return {
            ...item,
            monthlyInput: updatedMonthlyInput,
            totalAmount,
          };
        }
        return item;
      })
    );
  };

  // 파일 변경 핸들러
  const handleFileChange = (id: string, file: File | null) => {
    setFlareStackData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, attachedFile: file } : item
      )
    );
  };

  // 단위공정 선택 변경 핸들러
  const handleUnitProcessChange = (
    id: string,
    selectedUnitProcesses: string[]
  ) => {
    handleFieldChange(id, 'unitProcesses', selectedUnitProcesses);
  };

  // 할당 방법 변경 핸들러
  const handleAllocationToggle = (enabled: boolean) => {
    setAllocationSettings((prev) => ({
      ...prev,
      enabled,
    }));
  };

  // 할당 방법 타입 변경 핸들러
  const handleAllocationMethodChange = (
    method: '제품 생산량' | '비율 직접 입력'
  ) => {
    setAllocationSettings((prev) => ({
      ...prev,
      method,
    }));
  };

  // 할당 비율 변경 핸들러
  const handleRatioChange = (
    resourceId: string,
    processId: string,
    ratio: number
  ) => {
    setAllocations((prev) =>
      prev.map((allocation) => {
        if (allocation.resourceId === resourceId) {
          const updatedAllocations = allocation.unitProcessAllocations.map(
            (process) =>
              process.unitProcessId === processId
                ? { ...process, ratio }
                : process
          );

          const totalRatio = updatedAllocations.reduce(
            (sum, process) => sum + process.ratio,
            0
          );

          return {
            ...allocation,
            unitProcessAllocations: updatedAllocations,
            totalRatio,
          };
        }
        return allocation;
      })
    );
  };

  // 저장 핸들러
  const handleSave = () => {
    console.log('플래어스택 유입량 데이터:', flareStackData);
    console.log('할당 데이터:', allocations);
    alert('플래어스택 유입량 데이터가 저장되었습니다.');
  };

  // 할당 방법 섹션 렌더링
  const renderAllocationSection = () => {
    if (!allocationSettings.enabled) return null;

    return (
      <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          &lt;플래어스택 유입량 할당&gt;
        </h3>

        {allocationSettings.method === '비율 직접 입력' && (
          <div className='mb-4 flex items-center space-x-4'>
            <label className='text-sm font-medium text-gray-700'>
              비율 산정 방법:
            </label>
            <div className='bg-yellow-100 px-3 py-1 rounded text-sm font-medium'>
              각 단위공정별 플래어스택 유입 비율을 직접 입력합니다. 합계는 100%가
              되어야 합니다.
            </div>
          </div>
        )}

        {allocationSettings.method === '제품 생산량' && (
          <div className='mb-4 flex items-center space-x-4'>
            <label className='text-sm font-medium text-gray-700'>
              비율 산정 방법:
            </label>
            <div className='bg-yellow-100 px-3 py-1 rounded text-sm font-medium'>
              단위공정 별 제품 생산량 합계 값을 통해 비율이 자동 계산됩니다.
            </div>
          </div>
        )}

        <div className='space-y-6'>
          {allocations.map((allocation) => (
            <div
              key={allocation.resourceId}
              className='bg-white border border-blue-300 rounded-lg p-4'
            >
              <h4 className='text-base font-semibold text-gray-800 mb-3'>
                {allocation.resourceName}
              </h4>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {allocation.unitProcessAllocations.map((process) => (
                  <div
                    key={process.unitProcessId}
                    className='bg-blue-100 p-3 rounded'
                  >
                    <div className='text-sm font-medium text-gray-700 mb-1'>
                      {process.unitProcessName}
                    </div>
                    <div className='flex items-center space-x-2'>
                      {allocationSettings.method === '비율 직접 입력' ? (
                        <input
                          type='number'
                          value={process.ratio || ''}
                          onChange={(e) =>
                            handleRatioChange(
                              allocation.resourceId,
                              process.unitProcessId,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-yellow-100'
                          placeholder='비율 입력'
                          min='0'
                          max='100'
                          step='0.1'
                        />
                      ) : (
                        <div className='w-full px-2 py-1 text-sm bg-gray-100 rounded text-center'>
                          {process.ratio.toFixed(1)}
                        </div>
                      )}
                      <span className='text-sm'>%</span>
                    </div>
                  </div>
                ))}

                {/* 합산 표시 */}
                <div className='bg-blue-200 p-3 rounded flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='text-sm font-medium text-gray-700'>
                      합산
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        Math.abs(allocation.totalRatio - 100) < 0.1
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {allocation.totalRatio.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {allocationSettings.method === '비율 직접 입력' &&
                Math.abs(allocation.totalRatio - 100) >= 0.1 && (
                  <p className='text-red-600 text-sm mt-2'>
                    ⚠️ 비율의 합이 100%가 되어야 합니다.
                  </p>
                )}
            </div>
          ))}

          {allocations.length === 0 && (
            <div className='bg-yellow-50 p-4 rounded-md'>
              <p className='text-yellow-700 text-sm'>
                단위공정이 선택된 플래어스택 항목이 없습니다. 항목별로 단위공정을
                선택해주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 공통 뷰 컴포넌트에 전달할 props
  const viewProps = {
    flareStackData,
    units: DUMMY_UNITS,
    unitProcesses: DUMMY_UNIT_PROCESSES,
    onAddFlareStackItem: handleAddFlareStackItem,
    onDeleteFlareStackItem: handleDeleteFlareStackItem,
    onFieldChange: handleFieldChange,
    onMonthlyInputChange: handleMonthlyInputChange,
    onFileChange: handleFileChange,
    onUnitProcessChange: handleUnitProcessChange,
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      {/* 헤더 */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>9. 플래어스택 유입량</h2>
        <div className='flex items-center space-x-4'>
          {/* 할당방법 체크박스 */}
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='allocation-enabled'
              checked={allocationSettings.enabled}
              onChange={(e) => handleAllocationToggle(e.target.checked)}
              className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            />
            <label
              htmlFor='allocation-enabled'
              className='text-sm font-medium text-gray-700'
            >
              할당방법
            </label>
            <Tooltip text='플래어스택 유입량을 단위공정별로 할당하는 방법을 선택합니다.'>
              <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
            </Tooltip>
          </div>

          {/* 할당방법 선택 */}
          {allocationSettings.enabled && (
            <select
              value={allocationSettings.method}
              onChange={(e) =>
                handleAllocationMethodChange(
                  e.target.value as '제품 생산량' | '비율 직접 입력'
                )
              }
              className='px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='제품 생산량'>제품 생산량</option>
              <option value='비율 직접 입력'>비율 직접 입력</option>
            </select>
          )}

          <button
            onClick={handleSave}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center text-sm'
          >
            <FaSave className='mr-2' />
            저장
          </button>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className='mb-6 space-y-2'>
        <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-green-700 text-sm'>
            플래어스택 유입량 데이터를 입력하세요. 플래어스택 종류별로 월별 유입량을
            입력하세요.
          </p>
        </div>
        {allocationSettings.enabled &&
          allocationSettings.method === '비율 직접 입력' && (
            <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
              <p className='text-green-700 text-sm'>
                할당 방법에서 &quot;비율 직접 입력&quot;을 선택한 경우,
                단위공정별로 비율을 작성해야 합니다.
                <span className='text-red-600 font-medium'>
                  {' '}
                  작성한 비율의 총합이 100%가 되어야 합니다.
                </span>
              </p>
            </div>
          )}
        {allocationSettings.enabled &&
          allocationSettings.method === '제품 생산량' && (
            <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
              <p className='text-green-700 text-sm'>
                할당 방법에서 &quot;제품 생산량&quot;을 선택한 경우, 단위공정별
                제품 생산량 합계 값을 통해 비율이 자동 계산됩니다. 별도 입력이
                필요하지 않습니다.
              </p>
            </div>
          )}
      </div>

      {/* 모바일/데스크톱 뷰 전환 */}
      {isMobileView ? (
        <FlareStackInputMobileView {...viewProps} />
      ) : (
        <FlareStackInputDesktopView {...viewProps} />
      )}

      {/* 할당 방법 섹션 */}
      {renderAllocationSection()}
    </div>
  );
};

export default FlareStackInputTabContent;
