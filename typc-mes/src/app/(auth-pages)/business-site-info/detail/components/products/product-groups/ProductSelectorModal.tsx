'use client';

import React from 'react';
import { ProductItem } from '../ProductTabcontent'; // Adjust path as needed

interface ProductSelectorModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  availableProducts: ProductItem[]; // Products filtered by process name and search term
  selectedProductIds: string[];
  setSelectedProductIds: (ids: string[]) => void; // To manage selection within the modal
  onSave: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  // processNameForFilter?: string | null; // Optional: to display info like "Products for [Process Name]"
}

const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({
  showModal,
  setShowModal,
  availableProducts,
  selectedProductIds,
  setSelectedProductIds,
  onSave,
  searchTerm,
  setSearchTerm,
  // processNameForFilter,
}) => {
  if (!showModal) {
    return null;
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(
      selectedProductIds.includes(productId)
        ? selectedProductIds.filter(id => id !== productId)
        : [...selectedProductIds, productId]
    );
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-lg p-5'>
        <h3 className='text-lg font-semibold mb-4 text-gray-800'>
          제품 선택
          {/* {processNameForFilter && <span className="text-sm text-gray-600"> (공정: {processNameForFilter})</span>} */}
        </h3>

        <div className='mb-4'>
          <input
            type='text'
            className='w-full p-2 border border-gray-300 rounded-md text-sm'
            placeholder='제품명 검색...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='max-h-72 overflow-y-auto border border-gray-200 rounded-md mb-4 text-sm'>
          {availableProducts.length > 0 ? (
            availableProducts.map((product) => (
              <div
                key={product.id}
                className='flex items-center p-2.5 hover:bg-gray-100 border-b border-gray-200 last:border-b-0'
              >
                <input
                  type='checkbox'
                  id={`product-select-${product.id}`}
                  checked={selectedProductIds.includes(product.id.toString())}
                  onChange={() => toggleProductSelection(product.id.toString())}
                  className='mr-2.5 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                />
                <label htmlFor={`product-select-${product.id}`} className='flex-1 cursor-pointer text-gray-700'>
                  {product.productName} (모델: {product.modelName || 'N/A'}, ID: {product.id})
                </label>
              </div>
            ))
          ) : (
            <div className='p-4 text-center text-gray-500'>
              선택 가능한 제품이 없거나 검색 결과가 없습니다.
            </div>
          )}
        </div>

        <div className='mb-4 text-sm text-gray-600'>
          <span className='font-medium'>선택됨: </span>
          <span>{selectedProductIds.length}개 제품</span>
        </div>

        <div className='flex justify-end space-x-2'>
          <button
            type='button'
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm'
            onClick={() => setShowModal(false)}
          >
            취소
          </button>
          <button
            type='button'
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm'
            onClick={onSave}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectorModal; 