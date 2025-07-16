// components/electricity-steam/UnitProcessSelector.tsx
'use client';

import React, { useState } from 'react';
import { FaPlus, FaTimes, FaTag, FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../Tooltip';

interface UnitProcess {
  id: string;
  name: string;
}

interface UnitProcessSelectorProps {
  selectedUnitProcesses: string[];
  onSelectionChange: (processes: string[]) => void;
  unitProcesses: UnitProcess[];
}

const UnitProcessSelector: React.FC<UnitProcessSelectorProps> = ({
  selectedUnitProcesses,
  onSelectionChange,
  unitProcesses,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  const openModal = () => {
    setTempSelected([...selectedUnitProcesses]);
    setShowModal(true);
  };

  const toggleUnitProcess = (processId: string) => {
    setTempSelected(prev =>
      prev.includes(processId)
        ? prev.filter(id => id !== processId)
        : [...prev, processId]
    );
  };

  const selectAll = () => {
    setTempSelected(unitProcesses.map(p => p.id));
  };

  const deselectAll = () => {
    setTempSelected([]);
  };

  const saveSelection = () => {
    onSelectionChange(tempSelected);
    setShowModal(false);
  };

  const removeUnitProcess = (processId: string) => {
    onSelectionChange(selectedUnitProcesses.filter(id => id !== processId));
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        (4) 전력 사용 단위공정
        <Tooltip text="단위공정 목록 중에서 다중 선택하도록 합니다. 전체 선택 기능이 꼭 필요합니다!">
          <FaInfoCircle className="inline ml-1 text-blue-500 cursor-pointer" />
        </Tooltip>
      </h3>
      
      <div className="space-y-4">
        <button
          type="button"
          onClick={openModal}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          <FaPlus className="mr-2" />
          전력 사용 단위공정 선택 ({selectedUnitProcesses.length})
        </button>

        {selectedUnitProcesses.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">선택된 단위공정:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedUnitProcesses.map(processId => {
                const process = unitProcesses.find(p => p.id === processId);
                return (
                  <div
                    key={processId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <FaTag className="mr-2" size={10} />
                    <span className="mr-2">{process?.name}</span>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => removeUnitProcess(processId)}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-4">전력 사용 단위공정 선택</h3>
            
            <div className="mb-4 flex space-x-2">
              <button
                type="button"
                onClick={selectAll}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                전체 선택
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                전체 해제
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md mb-4">
              {unitProcesses.map(process => (
                <div
                  key={process.id}
                  className="flex items-center p-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    id={`process-${process.id}`}
                    checked={tempSelected.includes(process.id)}
                    onChange={() => toggleUnitProcess(process.id)}
                    className="mr-3"
                  />
                  <label htmlFor={`process-${process.id}`} className="flex-1 cursor-pointer">
                    {process.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-4 text-sm">
              <span className="font-medium">선택됨: </span>
              <span>{tempSelected.length}개</span>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={saveSelection}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitProcessSelector;