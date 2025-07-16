'use client';

import React, { useState } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';

interface OutsourcingSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCompanies: string[];
  selectedCompanies: string[];
  onSelectionChange: (companies: string[]) => void;
  processName: string;
}

const OutsourcingSelectionModal: React.FC<OutsourcingSelectionModalProps> = ({
  isOpen,
  onClose,
  availableCompanies,
  selectedCompanies,
  onSelectionChange,
  processName,
}) => {
  const [tempSelectedCompanies, setTempSelectedCompanies] = useState<string[]>(selectedCompanies);

  // 모달이 열릴 때마다 현재 선택된 상태로 초기화
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedCompanies(selectedCompanies);
    }
  }, [isOpen, selectedCompanies]);

  const handleCheckboxChange = (company: string, checked: boolean) => {
    if (checked) {
      setTempSelectedCompanies(prev => [...prev, company]);
    } else {
      setTempSelectedCompanies(prev => prev.filter(c => c !== company));
    }
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelectedCompanies);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedCompanies(selectedCompanies); // 원래 상태로 되돌리기
    onClose();
  };

  const handleSelectAll = () => {
    setTempSelectedCompanies(availableCompanies);
  };

  const handleDeselectAll = () => {
    setTempSelectedCompanies([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">외주업체 선택</h3>
            <p className="text-sm text-gray-600 mt-1">{processName}</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="닫기"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 전체 선택/해제 버튼 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded hover:bg-orange-200"
            >
              전체 선택
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              전체 해제
            </button>
            <div className="ml-auto text-xs text-gray-500">
              {tempSelectedCompanies.length}/{availableCompanies.length}개 선택
            </div>
          </div>

          {/* 외주업체 목록 */}
          <div className="space-y-2">
            {availableCompanies.map((company) => {
              const isChecked = tempSelectedCompanies.includes(company);
              return (
                <label
                  key={company}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(company, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                      isChecked
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isChecked && <FaCheck className="text-white text-xs" />}
                  </div>
                  <span className={`text-sm ${isChecked ? 'text-orange-700 font-medium' : 'text-gray-700'}`}>
                    {company}
                  </span>
                </label>
              );
            })}
          </div>

          {availableCompanies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>선택할 수 있는 외주업체가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            확인 ({tempSelectedCompanies.length}개 선택)
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutsourcingSelectionModal; 