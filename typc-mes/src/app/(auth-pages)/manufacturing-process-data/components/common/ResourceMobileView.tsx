'use client';

import React, { useState } from 'react';
import { FaPlus, FaTrash, FaTag, FaTimes } from 'react-icons/fa';
import {
  ResourceItem,
  ResourceTypeInfo,
  UnitProcessInfo,
} from './ResourceUsageTabContent';
import UnitProcessSelectionModal from './UnitProcessSelectionModal';

interface ResourceMobileViewProps {
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

const ResourceMobileView: React.FC<ResourceMobileViewProps> = ({
  resourceData,
  resourceTypes,
  unitProcesses,
  resourceLabel = '리소스',
  onAddResourceItem,
  onDeleteResourceItem,
  onFieldChange,
  onMonthlyUsageChange,
  onFileChange,
  onUnitProcessChange,
}) => {
  // 모달 상태 관리
  const [showUnitProcessModal, setShowUnitProcessModal] = useState(false);
  const [currentEditingItemId, setCurrentEditingItemId] = useState<string | null>(null);
  const [tempSelectedProcesses, setTempSelectedProcesses] = useState<string[]>([]);

  // 단위공정 선택 모달 열기
  const openUnitProcessModal = (itemId: string) => {
    const item = resourceData.find((item) => item.id === itemId);
    if (item) {
      setCurrentEditingItemId(itemId);
      setTempSelectedProcesses([...item.unitProcesses]);
      setShowUnitProcessModal(true);
    }
  };

  // 단위공정 토글
  const toggleUnitProcess = (processId: string) => {
    setTempSelectedProcesses((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId]
    );
  };

  // 단위공정 선택 저장
  const saveUnitProcessSelection = () => {
    if (currentEditingItemId) {
      onUnitProcessChange(currentEditingItemId, tempSelectedProcesses);
    }
    setShowUnitProcessModal(false);
    setCurrentEditingItemId(null);
  };

  // 단위공정 제거
  const removeUnitProcess = (itemId: string, processId: string) => {
    const item = resourceData.find((item) => item.id === itemId);
    if (item) {
      const updatedProcesses = item.unitProcesses.filter(
        (id) => id !== processId
      );
      onUnitProcessChange(itemId, updatedProcesses);
    }
  };

  return (
    <div>
      <div className='mb-4 flex justify-end'>
        <button
          type='button'
          onClick={onAddResourceItem}
          className='px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center'
        >
          <FaPlus size={12} className='mr-1' /> 항목 추가
        </button>
      </div>

      <div className='space-y-4'>
        {resourceData.map((item) => (
          <div
            key={item.id}
            className='border rounded-lg p-4 bg-white shadow-sm relative'
          >
            {/* 삭제 버튼 */}
            <button
              type='button'
              onClick={() => onDeleteResourceItem(item.id)}
              className='absolute top-3 right-3 text-red-500 hover:text-red-700'
              disabled={resourceData.length <= 1}
            >
              <FaTrash size={14} />
            </button>

            {/* 리소스명 및 단위 */}
            <div className='mb-3 grid grid-cols-2 gap-2'>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>
                  (1) {resourceLabel}명
                </label>
                <select
                  value={item.resourceType}
                  onChange={(e) =>
                    onFieldChange(item.id, 'resourceType', e.target.value)
                  }
                  className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500'
                >
                  {resourceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>
                  (3) 단위
                </label>
                <div className='w-full px-2 py-2 text-sm bg-gray-100 border border-gray-300 rounded'>
                  {item.unit}
                </div>
              </div>
            </div>

            {/* 단위공정 선택 */}
            <div className='mb-3'>
              <label className='block text-xs text-gray-500 mb-1'>
                (2) 사용 단위공정
              </label>
              <button
                type='button'
                onClick={() => openUnitProcessModal(item.id)}
                className='w-full text-xs py-2 px-3 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center'
              >
                <span>사용 단위공정 ({item.unitProcesses.length})</span>
                <FaPlus size={12} />
              </button>
              <div className='flex flex-wrap gap-1 mt-2'>
                {item.unitProcesses.map((processId) => {
                  const process = unitProcesses.find(
                    (p) => p.id === processId
                  );
                  return (
                    <div
                      key={processId}
                      className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center'
                    >
                      <FaTag className='mr-1' size={10} />
                      <span className='mr-1'>{process?.name}</span>
                      <button
                        type='button'
                        className='text-blue-600 hover:text-blue-800'
                        onClick={() =>
                          removeUnitProcess(item.id, processId)
                        }
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  );
                })}
                {item.unitProcesses.length === 0 && (
                  <span className='text-gray-400 text-xs py-1 mt-1 block'>
                    선택된 단위공정 없음
                  </span>
                )}
              </div>
            </div>

            {/* 합계 */}
            <div className='mb-3'>
              <label className='block text-xs text-gray-500 mb-1'>
                (4) 합계
              </label>
              <div className='w-full px-2 py-2 text-sm bg-gray-100 border border-gray-300 rounded text-right font-medium'>
                {item.totalAmount.toLocaleString()} {item.unit}
              </div>
            </div>

            {/* 월별 사용량 */}
            <div className='mb-3'>
              <label className='block text-xs text-gray-500 mb-1'>
                (5) 월별 {resourceLabel} 사용량
              </label>
              <div className='grid grid-cols-3 gap-2'>
                {item.monthlyUsage.map((monthData) => (
                  <div key={monthData.month}>
                    <label className='block text-xs text-gray-500 mb-1 text-center'>
                      {monthData.month}월
                    </label>
                    <input
                      type='number'
                      value={monthData.amount || ''}
                      onChange={(e) =>
                        onMonthlyUsageChange(
                          item.id,
                          monthData.month,
                          e.target.value
                        )
                      }
                      className='w-full px-1 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-blue-500'
                      placeholder='0'
                      min='0'
                      step='0.01'
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* DQI, 비고, 파일 */}
            <div className='grid grid-cols-3 gap-2'>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>
                  (6) DQI
                </label>
                <select
                  value={item.dqi}
                  onChange={(e) =>
                    onFieldChange(
                      item.id,
                      'dqi',
                      e.target.value as 'M' | 'C' | 'E' | ''
                    )
                  }
                  className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500'
                >
                  <option value=''>선택</option>
                  <option value='M'>M</option>
                  <option value='C'>C</option>
                  <option value='E'>E</option>
                </select>
              </div>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>
                  (7) 비고
                </label>
                <input
                  type='text'
                  value={item.note || ''}
                  onChange={(e) =>
                    onFieldChange(item.id, 'note', e.target.value)
                  }
                  className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500'
                  placeholder='비고 입력'
                />
              </div>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>
                  (8) 파일
                </label>
                <input
                  type='file'
                  onChange={(e) =>
                    onFileChange(item.id, e.target.files?.[0] || null)
                  }
                  className='w-full text-xs'
                />
                {item.attachedFile && (
                  <span className='text-xs text-gray-600 truncate block mt-1'>
                    {item.attachedFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 단위공정 선택 모달 */}
      <UnitProcessSelectionModal
        isOpen={showUnitProcessModal}
        onClose={() => setShowUnitProcessModal(false)}
        unitProcesses={unitProcesses}
        selectedProcesses={tempSelectedProcesses}
        onProcessToggle={toggleUnitProcess}
        onSave={saveUnitProcessSelection}
      />
    </div>
  );
};

export default ResourceMobileView; 