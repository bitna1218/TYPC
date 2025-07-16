'use client';

import React, { useState } from 'react';
import { FaPlus, FaTimes, FaTag } from 'react-icons/fa';
import UnitProcessSelectorModal from '../boiler/UnitProcessSelectorModal';

interface UnitProcess {
  id: string;
  name: string;
  processGroup: string;
  hasBoiler?: boolean;
}

interface UnitProcessSelectorProps {
  title: string;
  unitProcesses: UnitProcess[];
  selectedProcesses: string[];
  onSelectionChange: (selectedProcesses: string[]) => void;
  showBoilerIndicator?: boolean;
  className?: string;
}

const UnitProcessSelector: React.FC<UnitProcessSelectorProps> = ({
  title,
  unitProcesses,
  selectedProcesses,
  onSelectionChange,
  showBoilerIndicator = false,
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  // 모달 열기
  const openModal = () => {
    setTempSelected(selectedProcesses);
    setShowModal(true);
  };

  // 단위공정 토글
  const toggleUnitProcess = (processId: string) => {
    setTempSelected((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId],
    );
  };

  // 전체 선택/해제
  const selectAll = () => {
    setTempSelected(unitProcesses.map((p) => p.id));
  };

  const deselectAll = () => {
    setTempSelected([]);
  };

  // 모달에서 선택 저장
  const saveSelection = () => {
    onSelectionChange(tempSelected);
    setShowModal(false);
  };

  // 개별 단위공정 제거
  const removeUnitProcess = (processId: string) => {
    const newSelection = selectedProcesses.filter((id) => id !== processId);
    onSelectionChange(newSelection);
  };

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-medium text-gray-800">{title}</h4>
        <button
          onClick={openModal}
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          <FaPlus className="mr-1" size={12} />
          선택 ({selectedProcesses.length})
        </button>
      </div>

      {selectedProcesses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProcesses.map((processId) => {
            const process = unitProcesses.find((p) => p.id === processId);
            return (
              <div
                key={processId}
                className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                <FaTag className="mr-2" size={10} />
                <span className="mr-1">{process?.name}</span>
                <span className="mr-2 text-xs text-blue-600">
                  ({process?.processGroup})
                </span>
                {showBoilerIndicator && process?.hasBoiler && (
                  <span className="mr-2 text-orange-600" title="보일러 연동">
                    🔥
                  </span>
                )}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => removeUnitProcess(processId)}
                  title="제거"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedProcesses.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          단위공정을 선택해주세요.
        </div>
      )}

      {/* 단위공정 선택 모달 */}
      <UnitProcessSelectorModal
        show={showModal}
        unitProcesses={unitProcesses}
        selectedProcesses={tempSelected}
        onToggleProcess={toggleUnitProcess}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onConfirm={saveSelection}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default UnitProcessSelector; 