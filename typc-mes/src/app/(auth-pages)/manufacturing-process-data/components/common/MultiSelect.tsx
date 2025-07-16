'use client';

import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className='w-full'>
      {/* 검색 입력 */}
      <div className='mb-2 relative'>
        <input
          type='text'
          placeholder='검색...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded'
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className='absolute right-2 top-1/2 transform -translate-y-1/2'
          >
            <FaTimes className='text-gray-400 hover:text-gray-600' />
          </button>
        )}
      </div>

      {/* 선택된 옵션 표시 */}
      {selectedValues.length > 0 && (
        <div className='mb-2'>
          <div className='flex flex-wrap gap-1'>
            {selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <div
                  key={value}
                  className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center'
                >
                  {option?.label || value}
                  <button
                    onClick={() => handleToggleOption(value)}
                    className='ml-1 text-blue-600 hover:text-blue-800'
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 옵션 목록 */}
      <div className='max-h-60 overflow-y-auto border border-gray-300 rounded'>
        {filteredOptions.length === 0 ? (
          <div className='p-2 text-center text-gray-500'>
            검색 결과가 없습니다
          </div>
        ) : (
          filteredOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleToggleOption(option.value)}
              className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                selectedValues.includes(option.value)
                  ? 'bg-blue-50'
                  : 'bg-white'
              }`}
            >
              <div
                className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
                  selectedValues.includes(option.value)
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-400'
                }`}
              >
                {selectedValues.includes(option.value) && (
                  <FaCheck size={10} className='text-white' />
                )}
              </div>
              {option.label}
            </div>
          ))
        )}
      </div>

      {/* 전체 선택/해제 버튼 */}
      <div className='mt-2 flex justify-between'>
        <button
          onClick={() => onChange(options.map((option) => option.value))}
          className='text-sm text-blue-600 hover:text-blue-800'
        >
          전체 선택
        </button>
        <button
          onClick={() => onChange([])}
          className='text-sm text-red-600 hover:text-red-800'
        >
          전체 해제
        </button>
      </div>
    </div>
  );
};

export default MultiSelect; 