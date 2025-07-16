import React from 'react';

interface SupplierModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  supplierSearchTerm: string;
  setSupplierSearchTerm: (term: string) => void;
  filteredSuppliers: string[];
  selectedSuppliers: string[];
  toggleSupplier: (supplier: string) => void;
  saveSuppliers: () => void;
  modalIdPrefix?: string; // Optional: To ensure unique IDs if multiple modals can be open
}

const SupplierModal: React.FC<SupplierModalProps> = ({
  showModal,
  setShowModal,
  supplierSearchTerm,
  setSupplierSearchTerm,
  filteredSuppliers,
  selectedSuppliers,
  toggleSupplier,
  saveSuppliers,
  modalIdPrefix = 'supplier', // Default prefix
}) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md p-4'>
        <h3 className='text-lg font-medium mb-4'>공급업체 선택</h3>

        {/* 검색 영역 */}
        <div className='mb-4'>
          <input
            type='text'
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder='공급업체 검색...'
            value={supplierSearchTerm}
            onChange={(e) => setSupplierSearchTerm(e.target.value)}
          />
        </div>

        {/* 공급업체 목록 */}
        <div className='max-h-60 overflow-y-auto border border-gray-200 rounded-md mb-4'>
          {filteredSuppliers.map((supplier, index) => (
            <div
              key={index}
              className='flex items-center p-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0'
            >
              <input
                type='checkbox'
                id={`${modalIdPrefix}-${index}`}
                checked={selectedSuppliers.includes(supplier)}
                onChange={() => toggleSupplier(supplier)}
                className='mr-2'
              />
              <label htmlFor={`${modalIdPrefix}-${index}`} className='flex-1 cursor-pointer'>
                {supplier}
              </label>
            </div>
          ))}

          {filteredSuppliers.length === 0 && (
            <div className='p-4 text-center text-gray-500'>
              검색 결과가 없습니다
            </div>
          )}
        </div>

        {/* 선택된 공급업체 요약 */}
        <div className='mb-4 text-sm'>
          <span className='font-medium'>선택됨: </span>
          <span>{selectedSuppliers.length}개</span>
        </div>

        {/* 버튼 영역 */}
        <div className='flex justify-end space-x-2'>
          <button
            type='button'
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
            onClick={() => setShowModal(false)}
          >
            취소
          </button>
          <button
            type='button'
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            onClick={saveSuppliers}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal; 