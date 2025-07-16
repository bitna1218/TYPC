import React from 'react';

interface CustomerModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  customerSearchTerm: string;
  setCustomerSearchTerm: (term: string) => void;
  filteredCustomers: string[];
  selectedCustomers: string[];
  toggleCustomer: (customer: string) => void;
  saveCustomers: () => void;
  modalIdPrefix?: string; // Optional: To ensure unique IDs if multiple modals can be open
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  showModal,
  setShowModal,
  customerSearchTerm,
  setCustomerSearchTerm,
  filteredCustomers,
  selectedCustomers,
  toggleCustomer,
  saveCustomers,
  modalIdPrefix = 'customer', // Default prefix
}) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md p-4'>
        <h3 className='text-lg font-medium mb-4'>고객사 선택</h3>

        {/* 검색 영역 */}
        <div className='mb-4'>
          <input
            type='text'
            className='w-full p-2 border border-gray-300 rounded-md'
            placeholder='고객사 검색...'
            value={customerSearchTerm}
            onChange={(e) => setCustomerSearchTerm(e.target.value)}
          />
        </div>

        {/* 고객사 목록 */}
        <div className='max-h-60 overflow-y-auto border border-gray-200 rounded-md mb-4'>
          {filteredCustomers.map((customer, index) => (
            <div
              key={index}
              className='flex items-center p-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0'
            >
              <input
                type='checkbox'
                id={`${modalIdPrefix}-${index}`}
                checked={selectedCustomers.includes(customer)}
                onChange={() => toggleCustomer(customer)}
                className='mr-2'
              />
              <label htmlFor={`${modalIdPrefix}-${index}`} className='flex-1 cursor-pointer'>
                {customer}
              </label>
            </div>
          ))}

          {filteredCustomers.length === 0 && (
            <div className='p-4 text-center text-gray-500'>
              검색 결과가 없습니다
            </div>
          )}
        </div>

        {/* 선택된 고객사 요약 */}
        <div className='mb-4 text-sm'>
          <span className='font-medium'>선택됨: </span>
          <span>{selectedCustomers.length}개</span>
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
            onClick={saveCustomers}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal; 