'use client';

import React, { useState, useEffect } from 'react';
import { FaSave, FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../Tooltip';

// 기본 리소스 항목 인터페이스
export interface ResourceItem {
  id: string;
  resourceType: string; // 리소스 유형 ID (연료 종류, 용수 종류 등)
  unitProcesses: string[]; // 사용 단위공정 (다중 선택)
  unit: string; // 단위 (kg, ton, L, m³ 등)
  monthlyUsage: { month: number; amount: number }[]; // 월별 사용량
  totalAmount: number; // 합계 (자동 계산)
  dqi: 'M' | 'C' | 'E' | ''; // 데이터 품질 지표
  note?: string; // 비고
  attachedFile?: File | null; // 첨부 파일
}

// 리소스 타입 정보 인터페이스
export interface ResourceTypeInfo {
  id: string;
  name: string;
  unit: string;
  factor?: number; // 배출계수/환산계수 등 (필요한 경우)
}

// 단위공정 정보 인터페이스
export interface UnitProcessInfo {
  id: string;
  name: string;
}

// 할당 설정 인터페이스
export interface AllocationSettings {
  enabled: boolean;
  method: '제품 생산량' | '비율 직접 입력';
}

// 자원 사용량 관련 할당 타입 정의
export interface UnitProcessAllocation {
  resourceId: string;
  resourceName: string;
  unitProcessAllocations: {
    unitProcessId: string;
    unitProcessName: string;
    ratio: number;
  }[];
  totalRatio: number;
}

// 공통 뷰 컴포넌트에 전달할 props 타입
export interface ResourceViewProps {
  resourceData: ResourceItem[];
  resourceTypes: ResourceTypeInfo[];
  unitProcesses: UnitProcessInfo[];
  resourceLabel?: string;
  onAddResourceItem: () => void;
  onDeleteResourceItem: (id: string) => void;
  onFieldChange: (
    id: string,
    field: keyof ResourceItem,
    value: string | string[] | number
  ) => void;
  onMonthlyUsageChange: (id: string, month: number, value: string) => void;
  onFileChange: (id: string, file: File | null) => void;
  onUnitProcessChange: (id: string, selectedUnitProcesses: string[]) => void;
}

interface ResourceUsageTabContentProps {
  title: string; // 탭 제목 (예: "3. 용수 사용량", "4. 연료 사용량")
  resourceLabel: string; // 리소스 유형 라벨 (예: "연료", "용수")
  resourceTypes: ResourceTypeInfo[]; // 리소스 타입 목록 (연료 종류, 용수 종류 등)
  unitProcesses: UnitProcessInfo[]; // 단위공정 목록
  siteId?: string;
  desktopViewComponent: React.ComponentType<ResourceViewProps>; // 데스크톱 뷰 컴포넌트
  mobileViewComponent: React.ComponentType<ResourceViewProps>; // 모바일 뷰 컴포넌트
  helpText?: string; // 도움말 텍스트 (선택 사항)
}

const ResourceUsageTabContent: React.FC<ResourceUsageTabContentProps> = ({
  title,
  resourceLabel,
  resourceTypes,
  unitProcesses,
  siteId,
  desktopViewComponent: DesktopView,
  mobileViewComponent: MobileView,
  helpText = `${resourceLabel} 사용량 데이터를 입력하세요. 단위공정은 다중 선택이 가능합니다.`
}) => {
  // 상태 관리
  const [resourceData, setResourceData] = useState<ResourceItem[]>([]);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [allocationSettings, setAllocationSettings] = useState<AllocationSettings>({
    enabled: false,
    method: '제품 생산량',
  });
  const [allocations, setAllocations] = useState<UnitProcessAllocation[]>([]);

  // 모바일 뷰 감지
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024); // lg 브레이크포인트
    };

    if (typeof window !== 'undefined') {
      // SSR 안전장치
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

    // 초기 데이터 생성
    if (resourceData.length === 0 && resourceTypes.length > 0) {
      const initialItem: ResourceItem = {
        id: `resource_1`,
        resourceType: resourceTypes[0]?.id || '',
        unitProcesses: [],
        unit: resourceTypes[0]?.unit || '',
        monthlyUsage: Array.from({ length: 12 }, (_, index) => ({
          month: index + 1,
          amount: 0,
        })),
        totalAmount: 0,
        dqi: 'M',
        note: '',
        attachedFile: null,
      };

      setResourceData([initialItem]);
    }
  }, [siteId, resourceTypes, resourceData.length]);

  // 할당 데이터 업데이트
  useEffect(() => {
    if (allocationSettings.enabled) {
      const newAllocations: UnitProcessAllocation[] = resourceData
        .filter((item) => item.unitProcesses.length > 0)
        .map((item) => {
          const resourceType = resourceTypes.find(r => r.id === item.resourceType);
          return {
            resourceId: item.id,
            resourceName: resourceType?.name || resourceLabel,
            unitProcessAllocations: item.unitProcesses.map((processId) => {
              const process = unitProcesses.find(p => p.id === processId);
              return {
                unitProcessId: processId,
                unitProcessName: process?.name || '',
                ratio: allocationSettings.method === '제품 생산량'
                  ? Math.round((100 / item.unitProcesses.length) * 10) / 10
                  : 0,
              };
            }),
            totalRatio: allocationSettings.method === '제품 생산량' ? 100 : 0,
          };
        });
      setAllocations(newAllocations);
    }
  }, [allocationSettings.enabled, allocationSettings.method, resourceData, resourceTypes, unitProcesses, resourceLabel]);

  // 리소스 항목 추가
  const handleAddResourceItem = () => {
    const newId =
      resourceData.length > 0
        ? `resource_` +
          (Math.max(
            ...resourceData.map((item) =>
              parseInt(item.id.split('_')[1] || '0')
            )
          ) +
            1)
        : 'resource_1';

    const newItem: ResourceItem = {
      id: newId,
      resourceType: resourceTypes[0]?.id || '',
      unitProcesses: [],
      unit: resourceTypes[0]?.unit || '',
      monthlyUsage: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        amount: 0,
      })),
      totalAmount: 0,
      dqi: 'M',
      note: '',
      attachedFile: null,
    };

    setResourceData((prev) => [...prev, newItem]);
  };

  // 리소스 항목 삭제
  const handleDeleteResourceItem = (id: string) => {
    if (resourceData.length <= 1) {
      alert(`최소 1개 이상의 ${resourceLabel} 사용량 항목이 필요합니다.`);
      return;
    }

    if (window.confirm(`선택한 ${resourceLabel} 사용량 항목을 삭제하시겠습니까?`)) {
      setResourceData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 필드 변경 핸들러
  const handleFieldChange = (
    id: string,
    field: keyof ResourceItem,
    value: string | string[] | number
  ) => {
    setResourceData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // 리소스 종류가 변경되면 단위도 자동으로 업데이트
          if (field === 'resourceType') {
            const selectedResourceType = resourceTypes.find(
              (type) => type.id === value
            );
            if (selectedResourceType) {
              updatedItem.unit = selectedResourceType.unit;
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // 월별 사용량 변경 핸들러
  const handleMonthlyUsageChange = (
    id: string,
    month: number,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;

    setResourceData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedMonthlyUsage = item.monthlyUsage.map((monthData) =>
            monthData.month === month
              ? { ...monthData, amount: numValue }
              : monthData
          );

          const totalAmount = updatedMonthlyUsage.reduce(
            (sum, data) => sum + data.amount,
            0
          );

          return {
            ...item,
            monthlyUsage: updatedMonthlyUsage,
            totalAmount,
          };
        }
        return item;
      })
    );
  };

  // 파일 변경 핸들러
  const handleFileChange = (id: string, file: File | null) => {
    setResourceData((prev) =>
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
    setAllocationSettings(prev => ({
      ...prev,
      enabled
    }));
  };

  // 할당 방법 타입 변경 핸들러
  const handleAllocationMethodChange = (method: '제품 생산량' | '비율 직접 입력') => {
    setAllocationSettings(prev => ({
      ...prev,
      method
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
    console.log(`${resourceLabel} Usage Data:`, resourceData);
    console.log('Allocation Data:', allocations);
    alert(`${resourceLabel} 사용량 데이터가 저장되었습니다.`);
  };

  // 할당 방법 섹션 렌더링
  const renderAllocationSection = () => {
    if (!allocationSettings.enabled) return null;

    return (
      <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          &lt;{resourceLabel} 사용량 할당&gt;
        </h3>

        {allocationSettings.method === '비율 직접 입력' && (
          <div className='mb-4 flex items-center space-x-4'>
            <label className='text-sm font-medium text-gray-700'>
              비율 산정 방법:
            </label>
            <div className='bg-yellow-100 px-3 py-1 rounded text-sm font-medium'>
              각 단위공정별 {resourceLabel} 사용 비율을 직접 입력합니다. 합계는 100%가 되어야 합니다.
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

              {allocationSettings.method === '비율 직접 입력' && Math.abs(allocation.totalRatio - 100) >= 0.1 && (
                <p className='text-red-600 text-sm mt-2'>
                  ⚠️ 비율의 합이 100%가 되어야 합니다.
                </p>
              )}
            </div>
          ))}

          {allocations.length === 0 && (
            <div className='bg-yellow-50 p-4 rounded-md'>
              <p className='text-yellow-700 text-sm'>
                단위공정이 선택된 {resourceLabel} 항목이 없습니다. 항목별로 단위공정을 선택해주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 공통 뷰 컴포넌트에 전달할 props
  const viewProps: ResourceViewProps = {
    resourceData,
    resourceTypes,
    unitProcesses,
    resourceLabel,
    onAddResourceItem: handleAddResourceItem,
    onDeleteResourceItem: handleDeleteResourceItem,
    onFieldChange: handleFieldChange,
    onMonthlyUsageChange: handleMonthlyUsageChange,
    onFileChange: handleFileChange,
    onUnitProcessChange: handleUnitProcessChange,
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      {/* 헤더 */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
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
            <Tooltip text={`${resourceLabel} 사용량을 단위공정별로 할당하는 방법을 선택합니다.`}>
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
            {helpText}
          </p>
        </div>
        {allocationSettings.enabled && allocationSettings.method === '비율 직접 입력' && (
          <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-green-700 text-sm'>
              할당 방법에서 &quot;비율 직접 입력&quot;을 선택한 경우, 단위공정별로 비율을 작성해야 합니다.
              <span className='text-red-600 font-medium'> 작성한 비율의 총합이 100%가 되어야 합니다.</span>
            </p>
          </div>
        )}
        {allocationSettings.enabled && allocationSettings.method === '제품 생산량' && (
          <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-green-700 text-sm'>
              할당 방법에서 &quot;제품 생산량&quot;을 선택한 경우, 단위공정별 제품 생산량 합계 값을 통해 비율이 자동 계산됩니다. 별도 입력이 필요하지 않습니다.
            </p>
          </div>
        )}
      </div>

      {/* 모바일/데스크톱 뷰 전환 */}
      {isMobileView ? (
        <MobileView {...viewProps} />
      ) : (
        <DesktopView {...viewProps} />
      )}

      {/* 할당 방법 섹션 */}
      {renderAllocationSection()}
    </div>
  );
};

export default ResourceUsageTabContent; 