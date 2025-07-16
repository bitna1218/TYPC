'use client';

import React, { useState } from 'react';
import { FaTrash, FaPlusCircle, FaTag, FaTimes } from 'react-icons/fa';
import { WasteItem } from './WasteGenerationTabContent';
import UnitProcessSelectionModal from '../common/UnitProcessSelectionModal';

interface WasteGenerationMobileViewProps {
  wasteData: WasteItem[];
  wasteTypes: { id: string; name: string }[];
  treatmentMethods: { id: string; name: string }[];
  unitProcesses: { id: string; name: string }[];
  onAddWasteItem: () => void;
  onDeleteWasteItem: (id: string) => void;
  onFieldChange: (
    id: string,
    field: keyof WasteItem,
    value: string | string[] | number
  ) => void;
  onMonthlyGenerationChange: (
    id: string,
    month: number,
    value: string
  ) => void;
  onFileChange: (id: string, file: File | null) => void;
  onUnitProcessChange: (id: string, selectedUnitProcesses: string[]) => void;
}

const WasteGenerationMobileView: React.FC<WasteGenerationMobileViewProps> = ({
  wasteData,
  wasteTypes,
  treatmentMethods,
  unitProcesses,
  onAddWasteItem,
  onDeleteWasteItem,
  onFieldChange,
  onMonthlyGenerationChange,
  onFileChange,
  onUnitProcessChange,
}) => {
  // 모달 상태 관리
  const [showUnitProcessModal, setShowUnitProcessModal] = useState(false);
  const [currentEditingItemId, setCurrentEditingItemId] = useState<
    string | null
  >(null);
  const [tempSelectedProcesses, setTempSelectedProcesses] = useState<string[]>(
    []
  );

  // 단위공정 선택 모달 열기
  const openUnitProcessModal = (itemId: string) => {
    const item = wasteData.find((item) => item.id === itemId);
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
    const item = wasteData.find((item) => item.id === itemId);
    if (item) {
      const updatedProcesses = item.unitProcesses.filter(
        (id) => id !== processId
      );
      onUnitProcessChange(itemId, updatedProcesses);
    }
  };

  return (
    <div>
      {wasteData.map((item) => (
        <div
          key={item.id}
          className='bg-white border border-gray-300 rounded-lg mb-4 p-4 shadow-sm'
        >
          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-lg font-semibold'>
              {item.wasteName || '새 폐기물 항목'}
            </h3>
            <button
              onClick={() => onDeleteWasteItem(item.id)}
              className='p-1 text-red-600 hover:text-red-800'
              title='삭제'
            >
              <FaTrash />
            </button>
          </div>

          <div className='grid grid-cols-2 gap-3 mb-4'>
            {/* 폐기물명 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                폐기물명
              </label>
              <input
                type='text'
                value={item.wasteName}
                onChange={(e) =>
                  onFieldChange(item.id, 'wasteName', e.target.value)
                }
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='폐기물명 입력'
              />
            </div>

            {/* 단위 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                단위
              </label>
              <input
                type='text'
                value={item.unit}
                onChange={(e) =>
                  onFieldChange(item.id, 'unit', e.target.value)
                }
                className='w-full p-2 border border-gray-300 rounded'
              />
            </div>

            {/* 폐기물 구분 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                폐기물 구분
              </label>
              <select
                value={item.wasteType}
                onChange={(e) =>
                  onFieldChange(item.id, 'wasteType', e.target.value)
                }
                className='w-full p-2 border border-gray-300 rounded'
              >
                {wasteTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 처리 방법 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                처리 방법
              </label>
              <select
                value={item.treatmentMethod}
                onChange={(e) =>
                  onFieldChange(item.id, 'treatmentMethod', e.target.value)
                }
                className='w-full p-2 border border-gray-300 rounded'
              >
                {treatmentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 발생 단위공정 */}
            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                발생 단위공정
              </label>
              <div className='border border-gray-300 rounded p-2 bg-gray-50'>
                <button
                  type='button'
                  onClick={() => openUnitProcessModal(item.id)}
                  className='w-full py-2 px-3 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center mb-2'
                >
                  <span>단위공정 선택 ({item.unitProcesses.length})</span>
                  <FaPlusCircle size={14} />
                </button>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {item.unitProcesses.length > 0 ? (
                    item.unitProcesses.map((processId) => {
                      const process = unitProcesses.find(
                        (p) => p.id === processId
                      );
                      return (
                        <div
                          key={processId}
                          className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center'
                        >
                          <FaTag className='mr-1' size={10} />
                          <span className='mr-1'>{process?.name || processId}</span>
                          <button
                            type='button'
                            className='text-blue-600 hover:text-blue-800'
                            onClick={() => removeUnitProcess(item.id, processId)}
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <span className='text-gray-500 text-sm'>
                      선택된 단위공정 없음
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DQI */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                DQI
              </label>
              <select
                value={item.dqi}
                onChange={(e) =>
                  onFieldChange(item.id, 'dqi', e.target.value)
                }
                className='w-full p-2 border border-gray-300 rounded'
              >
                <option value='M'>M</option>
                <option value='C'>C</option>
                <option value='E'>E</option>
              </select>
            </div>

            {/* 비고 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                비고
              </label>
              <input
                type='text'
                value={item.note}
                onChange={(e) =>
                  onFieldChange(item.id, 'note', e.target.value)
                }
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='비고'
              />
            </div>

            {/* 파일첨부 */}
            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                파일첨부
              </label>
              <input
                type='file'
                onChange={(e) =>
                  onFileChange(
                    item.id,
                    e.target.files ? e.target.files[0] : null
                  )
                }
                className='w-full text-sm p-1'
              />
              {item.attachedFile && (
                <div className='text-xs mt-1 text-blue-600'>
                  {item.attachedFile.name}
                </div>
              )}
            </div>
          </div>

          {/* 월별 발생량 섹션 */}
          <div className='mt-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              월별 폐기물 발생량 데이터 (합계: {item.totalAmount.toFixed(2)}{' '}
              {item.unit})
            </h4>
            <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6'>
              {item.monthlyGeneration.map((monthData) => (
                <div key={`${item.id}_month_${monthData.month}`}>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>
                    {monthData.month}월
                  </label>
                  <input
                    type='number'
                    value={monthData.amount || ''}
                    onChange={(e) =>
                      onMonthlyGenerationChange(
                        item.id,
                        monthData.month,
                        e.target.value
                      )
                    }
                    className='w-full p-2 border border-gray-300 rounded'
                    min='0'
                    step='0.01'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* 추가 버튼 */}
      <div className='flex justify-center mt-4'>
        <button
          onClick={onAddWasteItem}
          className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <FaPlusCircle className='mr-2' />
          폐기물 발생량 항목 추가
        </button>
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

export default WasteGenerationMobileView; 