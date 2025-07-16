import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface WasteProcessModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  allProcesses: string[];
  selectedProcesses: string[];
  onSave: (selectedProcesses: string[]) => void;
}

const WasteProcessModal: React.FC<WasteProcessModalProps> = ({
  showModal,
  setShowModal,
  allProcesses,
  selectedProcesses,
  onSave,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelected, setLocalSelected] = useState<string[]>(selectedProcesses);

  // 모달이 열릴 때마다 선택된 항목을 초기화
  useEffect(() => {
    if (showModal) {
      setLocalSelected(selectedProcesses);
      setSearchTerm('');
    }
  }, [showModal, selectedProcesses]);

  const filteredProcesses = allProcesses.filter(process =>
    process.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProcess = (process: string) => {
    setLocalSelected(prev =>
      prev.includes(process)
        ? prev.filter(p => p !== process)
        : [...prev, process]
    );
  };

  const handleSave = () => {
    onSave(localSelected);
  };

  const handleCancel = () => {
    setLocalSelected(selectedProcesses);
    setSearchTerm('');
    setShowModal(false);
  };

  const handleSelectAll = () => {
    if (localSelected.length === filteredProcesses.length) {
      setLocalSelected([]);
    } else {
      setLocalSelected(filteredProcesses);
    }
  };

  const removeSelected = (process: string) => {
    setLocalSelected(prev => prev.filter(p => p !== process));
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col'>
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className='text-lg font-semibold text-gray-800'>공정명 선택</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* 검색 영역 */}
        <div className='p-4 border-b border-gray-200'>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type='text'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='공정명 검색...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 선택된 항목 표시 */}
        {localSelected.length > 0 && (
          <div className="p-4 bg-green-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">
                선택된 공정 ({localSelected.length}개)
              </span>
              <button
                onClick={() => setLocalSelected([])}
                className="text-xs text-green-600 hover:text-green-800"
              >
                전체 해제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localSelected.map((process) => (
                <span
                  key={process}
                  className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {process}
                  <button
                    onClick={() => removeSelected(process)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <FaTimes size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 목록 영역 */}
        <div className='flex-1 overflow-hidden'>
          {/* 전체 선택/해제 */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filteredProcesses.length > 0 && localSelected.length === filteredProcesses.length}
                onChange={handleSelectAll}
                className="mr-2 form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                전체 선택 ({filteredProcesses.length}개)
              </span>
            </label>
          </div>

          <div className='overflow-y-auto max-h-60'>
            {filteredProcesses.length > 0 ? (
              filteredProcesses.map((process, index) => (
                <div
                  key={index}
                  className='flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer'
                  onClick={() => toggleProcess(process)}
                >
                  <input
                    type='checkbox'
                    checked={localSelected.includes(process)}
                    onChange={() => toggleProcess(process)}
                    className='mr-3 form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className='flex-1 text-sm text-gray-700'>{process}</span>
                </div>
              ))
            ) : (
              <div className='p-6 text-center text-gray-500'>
                <p className="text-sm">검색 결과가 없습니다</p>
                {searchTerm && (
                  <p className='text-xs mt-1'>&quot;{searchTerm}&quot;에 대한 결과를 찾을 수 없습니다</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className='flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50'>
          <div className="text-sm text-gray-600">
            총 {allProcesses.length}개 중 {localSelected.length}개 선택
          </div>
          <div className="flex space-x-2">
            <button
              type='button'
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm'
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              type='button'
              className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'
              onClick={handleSave}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteProcessModal;