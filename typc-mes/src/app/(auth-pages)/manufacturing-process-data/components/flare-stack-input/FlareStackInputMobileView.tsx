'use client';

import React, { useState } from 'react';
import {
  FaTrash,
  FaPlusCircle,
  FaUpload,
  FaAngleDown,
  FaAngleUp,
} from 'react-icons/fa';
import { FlareStackItem } from './FlareStackInputTabContent';
import UnitProcessSelectionModal from '../common/UnitProcessSelectionModal';

interface FlareStackInputMobileViewProps {
  flareStackData: FlareStackItem[];
  unitProcesses: { id: string; name: string }[];
  units: { id: string; name: string }[];
  onAddFlareStackItem: () => void;
  onDeleteFlareStackItem: (id: string) => void;
  onFieldChange: (
    id: string,
    field: keyof FlareStackItem,
    value: string | string[] | number
  ) => void;
  onMonthlyInputChange: (id: string, month: number, value: string) => void;
  onFileChange: (id: string, file: File | null) => void;
  onUnitProcessChange: (id: string, selectedUnitProcesses: string[]) => void;
}

const FlareStackInputMobileView: React.FC<FlareStackInputMobileViewProps> = ({
  flareStackData,
  unitProcesses,
  units,
  onAddFlareStackItem,
  onDeleteFlareStackItem,
  onFieldChange,
  onMonthlyInputChange,
  onFileChange,
  onUnitProcessChange,
}) => {
  // 모달 상태 관리
  const [showUnitProcessModal, setShowUnitProcessModal] = useState(false);
  const [currentEditingItemId, setCurrentEditingItemId] = useState<string | null>(null);
  const [tempSelectedProcesses, setTempSelectedProcesses] = useState<string[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  // 단위공정 선택 모달 열기
  const openUnitProcessModal = (itemId: string) => {
    const item = flareStackData.find((item) => item.id === itemId);
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

  // 카드 펼치기/접기 토글
  const toggleCard = (id: string) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  // 선택된 항목 라벨 가져오기
  const getSelectedLabel = (id: string, options: { id: string; name: string }[]) => {
    const option = options.find((option) => option.id === id);
    return option ? option.name : '';
  };

  return (
    <div>
      <div className='flex justify-end mb-4'>
        <button
          type='button'
          onClick={onAddFlareStackItem}
          className='px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center shadow-sm'
        >
          <FaPlusCircle className='mr-1.5' size={14} /> 항목 추가
        </button>
      </div>

      <div className='space-y-4'>
        {flareStackData.map((item) => {
          const isExpanded = expandedCards.includes(item.id);
          const selectedUnit = getSelectedLabel(item.unit, units);
          const selectedUnitProcesses = item.unitProcesses
            .map((id) => {
              const process = unitProcesses.find((p) => p.id === id);
              return process ? process.name : '';
            })
            .filter(Boolean);

          return (
            <div
              key={item.id}
              className='border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden'
            >
              {/* 카드 헤더 */}
              <div
                className='flex justify-between items-center p-3 bg-gray-50 cursor-pointer'
                onClick={() => toggleCard(item.id)}
              >
                <div className='flex-1'>
                  <h3 className='font-medium text-gray-800'>
                    {item.flareGasName || '(폐가스명 미입력)'}
                  </h3>
                  <div className='text-xs text-gray-500 mt-0.5'>
                    <span>총 {item.totalAmount.toLocaleString()} {selectedUnit}</span>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFlareStackItem(item.id);
                    }}
                    className='text-red-500 p-1.5 rounded-full hover:bg-red-50'
                    disabled={flareStackData.length <= 1}
                  >
                    <FaTrash size={14} />
                  </button>
                  {isExpanded ? (
                    <FaAngleUp className='text-gray-500' />
                  ) : (
                    <FaAngleDown className='text-gray-500' />
                  )}
                </div>
              </div>

              {/* 카드 내용 */}
              {isExpanded && (
                <div className='p-3 border-t border-gray-200'>
                  <div className='space-y-4'>
                    {/* 기본 정보 */}
                    <div className='grid grid-cols-1 gap-3'>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          폐가스명
                        </label>
                        <input
                          type='text'
                          value={item.flareGasName}
                          onChange={(e) =>
                            onFieldChange(item.id, 'flareGasName', e.target.value)
                          }
                          className='w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                          placeholder='폐가스명 입력'
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-xs font-medium text-gray-700 mb-1'>
                            밀도
                          </label>
                          <input
                            type='number'
                            value={item.density || ''}
                            onChange={(e) =>
                              onFieldChange(item.id, 'density', e.target.value)
                            }
                            className='w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                            placeholder='밀도'
                          />
                        </div>
                        <div>
                          <label className='block text-xs font-medium text-gray-700 mb-1'>
                            단위
                          </label>
                          <select
                            value={item.unit}
                            onChange={(e) =>
                              onFieldChange(item.id, 'unit', e.target.value)
                            }
                            className='w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                          >
                            {units.map((unit) => (
                              <option key={unit.id} value={unit.id}>
                                {unit.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          발생 단위공정
                        </label>
                        <button
                          type='button'
                          onClick={() => openUnitProcessModal(item.id)}
                          className='w-full py-2 px-3 text-sm bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center'
                        >
                          <span>
                            {selectedUnitProcesses.length > 0
                              ? `${selectedUnitProcesses.length}개 선택됨`
                              : '단위공정 선택'}
                          </span>
                          <FaPlusCircle size={14} />
                        </button>
                        {selectedUnitProcesses.length > 0 && (
                          <div className='mt-1 text-xs text-gray-600'>
                            {selectedUnitProcesses.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className='grid grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-xs font-medium text-gray-700 mb-1'>
                            DQI
                          </label>
                          <select
                            value={item.dqi}
                            onChange={(e) =>
                              onFieldChange(item.id, 'dqi', e.target.value)
                            }
                            className='w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                          >
                            <option value=''>선택</option>
                            <option value='M'>M</option>
                            <option value='C'>C</option>
                            <option value='E'>E</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-xs font-medium text-gray-700 mb-1'>
                            비고
                          </label>
                          <input
                            type='text'
                            value={item.note || ''}
                            onChange={(e) =>
                              onFieldChange(item.id, 'note', e.target.value)
                            }
                            className='w-full py-2 px-3 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                            placeholder='비고'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          파일첨부
                        </label>
                        <div className='flex items-center space-x-2'>
                          <label className='flex-1 flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 cursor-pointer'>
                            <FaUpload className='mr-2 text-gray-500' size={14} />
                            <span>
                              {item.attachedFile
                                ? item.attachedFile.name
                                : '파일 선택'}
                            </span>
                            <input
                              type='file'
                              className='hidden'
                              onChange={(e) =>
                                onFileChange(item.id, e.target.files?.[0] || null)
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 월별 유입량 */}
                    <div>
                      <h4 className='text-sm font-medium text-gray-700 mb-2'>
                        월별 플래어스택 유입량
                      </h4>
                      <div className='grid grid-cols-2 gap-2'>
                        {item.monthlyInput.map((monthData) => (
                          <div
                            key={monthData.month}
                            className='flex items-center border border-gray-200 rounded p-2'
                          >
                            <span className='text-xs font-medium text-gray-700 w-8'>
                              {monthData.month}월
                            </span>
                            <input
                              type='number'
                              value={monthData.amount || ''}
                              onChange={(e) =>
                                onMonthlyInputChange(
                                  item.id,
                                  monthData.month,
                                  e.target.value
                                )
                              }
                              className='flex-1 py-1 px-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-right'
                              placeholder='0'
                              min='0'
                              step='any'
                            />
                            <span className='text-xs text-gray-500 ml-1'>
                              {selectedUnit}
                            </span>
                          </div>
                        ))}

                        <div className='col-span-2 flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-300 mt-2'>
                          <span className='text-sm font-medium text-gray-700'>
                            합계
                          </span>
                          <span className='text-sm font-bold text-gray-800'>
                            {item.totalAmount.toLocaleString()} {selectedUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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

export default FlareStackInputMobileView; 