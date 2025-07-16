'use client';

import React from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';

interface PurchasesToolbarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  onAddMaterial: () => void;
}

const PurchasesToolbar: React.FC<PurchasesToolbarProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  onAddMaterial,
}) => {
  return (
    <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2'>
      <div className='flex-1 md:max-w-md'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Database 검색...'
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md pr-10'
          />
          <button
            type='button'
            onClick={onSearch}
            className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
          >
            <FaSearch />
          </button>
        </div>
      </div>
      <button
        type='button'
        onClick={onAddMaterial}
        className='px-3 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none flex items-center'
      >
        <FaPlus className='mr-2' size={14} />
        <span>추가</span>
      </button>
    </div>
  );
};

export default PurchasesToolbar;
