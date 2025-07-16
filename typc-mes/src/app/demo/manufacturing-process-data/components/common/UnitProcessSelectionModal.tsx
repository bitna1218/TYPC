'use client';

import React, { useState } from 'react';
import { FaCheck, FaTimes, FaSearch } from 'react-icons/fa';

interface UnitProcessSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitProcesses: { id: string; name: string }[];
  selectedProcesses: string[];
  onProcessToggle: (processId: string) => void;
  onSave: () => void;
}

const UnitProcessSelectionModal: React.FC<UnitProcessSelectionModalProps> = ({
  isOpen,
  onClose,
  unitProcesses,
  selectedProcesses,
  onProcessToggle,
  onSave,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어 기반 필터링
  const filteredProcesses = unitProcesses.filter((process) =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 전체 선택
  const handleSelectAll = () => {
    const allProcessIds = unitProcesses.map((process) => process.id);
    
    // 이미 모두 선택된 경우, 전체 해제
    if (allProcessIds.every(id => selectedProcesses.includes(id))) {
      selectedProcesses.forEach(id => {
        if (allProcessIds.includes(id)) {
          onProcessToggle(id);
        }
      });
    } else {
      // 선택되지 않은 프로세스만 선택
      allProcessIds.forEach(id => {
        if (!selectedProcesses.includes(id)) {
          onProcessToggle(id);
        }
      });
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  const allSelected = unitProcesses.length > 0 && 
    unitProcesses.every(process => selectedProcesses.includes(process.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 max-h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">단위공정 선택</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
          >
            <FaTimes />
          </button>
        </div>

        {/* 검색 */}
        <div className="mb-4 relative">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="단위공정 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 전체 선택 버튼 */}
        <div className="mb-2">
          <button
            onClick={handleSelectAll}
            className={`w-full py-2 px-3 rounded-md text-sm flex justify-between items-center ${
              allSelected
                ? "bg-blue-100 text-blue-800 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <span className="font-medium">전체 {allSelected ? '해제' : '선택'}</span>
            {allSelected && <FaCheck className="text-blue-600" />}
          </button>
        </div>

        {/* 단위공정 목록 */}
        <div className="overflow-y-auto flex-grow">
          {filteredProcesses.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              검색 결과가 없습니다
            </div>
          ) : (
            <div className="space-y-1">
              {filteredProcesses.map((process) => {
                const isSelected = selectedProcesses.includes(process.id);
                return (
                  <div
                    key={process.id}
                    onClick={() => onProcessToggle(process.id)}
                    className={`p-2 rounded-md cursor-pointer flex items-center ${
                      isSelected
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 mr-3 border rounded flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-400"
                      }`}
                    >
                      {isSelected && (
                        <FaCheck className="text-white" size={12} />
                      )}
                    </div>
                    <span>{process.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            선택 완료 ({selectedProcesses.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitProcessSelectionModal;
