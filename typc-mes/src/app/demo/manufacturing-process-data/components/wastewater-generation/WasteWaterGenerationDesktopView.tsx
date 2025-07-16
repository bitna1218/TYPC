'use client';

import React, { useState } from 'react';
import {
  FaTrash,
  FaPlusCircle,
  FaTag,
  FaTimes,
  FaUpload,
} from 'react-icons/fa';
import { WasteWaterItem } from './WasteWaterGenerationTabContent';
import UnitProcessSelectionModal from '../common/UnitProcessSelectionModal';

interface WasteWaterGenerationDesktopViewProps {
  wasteWaterData: WasteWaterItem[];
  wasteWaterTypes: { id: string; name: string }[];
  treatmentMethods: { id: string; name: string }[];
  unitProcesses: { id: string; name: string }[];
  units: { id: string; name: string }[];
  onAddWasteWaterItem: () => void;
  onDeleteWasteWaterItem: (id: string) => void;
  onFieldChange: (
    id: string,
    field: keyof WasteWaterItem,
    value: string | string[] | number
  ) => void;
  onMonthlyGenerationChange: (id: string, month: number, value: string) => void;
  onFileChange: (id: string, file: File | null) => void;
  onUnitProcessChange: (id: string, selectedUnitProcesses: string[]) => void;
}

const WasteWaterGenerationDesktopView: React.FC<
  WasteWaterGenerationDesktopViewProps
> = ({
  wasteWaterData,
  unitProcesses,
  units,
  onAddWasteWaterItem,
  onDeleteWasteWaterItem,
  onFieldChange,
  onMonthlyGenerationChange,
  onFileChange,
  onUnitProcessChange,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

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
    const item = wasteWaterData.find((item) => item.id === itemId);
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
    const item = wasteWaterData.find((item) => item.id === itemId);
    if (item) {
      const updatedProcesses = item.unitProcesses.filter(
        (id) => id !== processId
      );
      onUnitProcessChange(itemId, updatedProcesses);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-medium text-gray-700'></h3>
        <button
          type='button'
          onClick={onAddWasteWaterItem}
          className='px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center shadow-sm'
        >
          <FaPlusCircle className='mr-1.5' size={14} /> 항목 추가
        </button>
      </div>

      <div className='overflow-x-auto shadow-sm border border-gray-200 rounded-lg'>
        <table className='min-w-full border-collapse'>
          <thead className='bg-gray-100 text-gray-700 text-xs uppercase tracking-wider'>
            <tr>
              <th
                colSpan={4}
                className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
              >
                폐수 정보
              </th>
              <th
                colSpan={12}
                className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
              >
                월별 폐수 발생량 데이터
              </th>
              <th
                colSpan={3}
                className='px-3 py-2.5 font-semibold border-b-2 border-gray-400 text-center whitespace-nowrap bg-gray-200'
              >
                데이터 품질정보
              </th>
              <th
                rowSpan={2}
                className='px-2 py-2.5 font-semibold border-l border-gray-300 w-[50px] align-middle text-center whitespace-nowrap bg-gray-100'
              >
                삭제
              </th>
            </tr>
            <tr>
              <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[120px] whitespace-nowrap'>
                폐수명
              </th>
              <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[180px] whitespace-nowrap'>
                발생 단위공정
              </th>
              <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[70px] whitespace-nowrap'>
                단위
              </th>
              <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                합계
              </th>

              {months.map((month, index) => (
                <th
                  key={`month-header-${index}`}
                  className='px-2 py-1.5 font-semibold border border-gray-300 text-xs text-center min-w-[70px] whitespace-nowrap'
                >
                  {month}월
                </th>
              ))}

              <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[60px] whitespace-nowrap'>
                DQI
              </th>
              <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                비고
              </th>
              <th className='px-3 py-2.5 font-semibold border border-gray-300 text-center align-middle min-w-[100px] whitespace-nowrap'>
                파일첨부
              </th>
            </tr>
          </thead>
          <tbody className='bg-white text-xs divide-y divide-gray-200'>
            {wasteWaterData.map((item) => (
              <tr key={item.id} className='hover:bg-gray-50 align-top'>
                {/* 폐수명 */}
                <td className='p-1 align-middle border border-gray-300'>
                  <input
                    type='text'
                    value={item.wasteWaterName}
                    onChange={(e) =>
                      onFieldChange(item.id, 'wasteWaterName', e.target.value)
                    }
                    className='w-full py-1.5 px-2 text-xs border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='폐수명 입력'
                  />
                </td>

                {/* 발생 단위공정 */}
                <td className='p-1 align-middle border border-gray-300'>
                  <div className='flex flex-col'>
                    <button
                      type='button'
                      onClick={() => openUnitProcessModal(item.id)}
                      className='w-full text-xs py-1 px-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center'
                    >
                      <span>단위공정 선택 ({item.unitProcesses.length})</span>
                      <FaPlusCircle size={10} />
                    </button>
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {item.unitProcesses.map((processId) => {
                        const process = unitProcesses.find(
                          (p) => p.id === processId
                        );
                        return (
                          <div
                            key={processId}
                            className='bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs flex items-center'
                          >
                            <FaTag className='mr-1' size={9} />
                            <span className='mr-0.5'>{process?.name}</span>
                            <button
                              type='button'
                              className='text-blue-600 hover:text-blue-800'
                              onClick={() =>
                                removeUnitProcess(item.id, processId)
                              }
                            >
                              <FaTimes size={9} />
                            </button>
                          </div>
                        );
                      })}
                      {item.unitProcesses.length === 0 && (
                        <span className='text-gray-400 text-xs py-1'>
                          선택된 단위공정 없음
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* 단위 */}
                <td className='p-1 align-middle border border-gray-300'>
                  <select
                    value={item.unit}
                    onChange={(e) =>
                      onFieldChange(item.id, 'unit', e.target.value)
                    }
                    className='w-full py-1.5 px-2 text-xs border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                  >
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 합계 */}
                <td className='px-2 py-2 text-gray-700 bg-gray-50 text-right align-middle border border-gray-300'>
                  {item.totalAmount.toLocaleString()}
                </td>

                {/* 월별 발생량 */}
                {item.monthlyGeneration.map((monthData) => (
                  <td
                    key={monthData.month}
                    className='p-1 align-middle border border-gray-300'
                  >
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
                      className='w-full py-1.5 px-2 text-xs border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right'
                      placeholder='0'
                      min='0'
                      step='any'
                    />
                  </td>
                ))}

                {/* DQI */}
                <td className='px-2 py-2 text-gray-700 bg-gray-100 align-middle text-center border border-gray-300'>
                  <select
                    value={item.dqi}
                    onChange={(e) =>
                      onFieldChange(item.id, 'dqi', e.target.value)
                    }
                    className='w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500'
                  >
                    <option value=''>선택</option>
                    <option value='M'>M</option>
                    <option value='C'>C</option>
                    <option value='E'>E</option>
                  </select>
                </td>

                {/* 비고 */}
                <td className='p-1 align-middle border border-gray-300'>
                  <input
                    type='text'
                    value={item.note || ''}
                    onChange={(e) =>
                      onFieldChange(item.id, 'note', e.target.value)
                    }
                    className='w-full py-1.5 px-2 text-xs border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='비고'
                  />
                </td>

                {/* 파일첨부 */}
                <td className='p-1 align-middle border border-gray-300'>
                  <div className='flex flex-col items-center justify-center h-full'>
                    <label className='cursor-pointer p-1.5 rounded-md hover:bg-gray-100'>
                      <input
                        type='file'
                        className='hidden'
                        onChange={(e) =>
                          onFileChange(item.id, e.target.files?.[0] || null)
                        }
                      />
                      <FaUpload
                        className='text-blue-500 hover:text-blue-700'
                        size={16}
                      />
                    </label>
                    {item.attachedFile && (
                      <span
                        className='text-xs text-gray-500 mt-0.5 truncate max-w-[80px]'
                        title={item.attachedFile.name}
                      >
                        {item.attachedFile.name}
                      </span>
                    )}
                  </div>
                </td>

                {/* 삭제 버튼 */}
                <td className='px-2 py-2 text-center align-middle border border-gray-300'>
                  <button
                    type='button'
                    onClick={() => onDeleteWasteWaterItem(item.id)}
                    className='text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50'
                    aria-label='항목 삭제'
                    disabled={wasteWaterData.length <= 1}
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default WasteWaterGenerationDesktopView;
