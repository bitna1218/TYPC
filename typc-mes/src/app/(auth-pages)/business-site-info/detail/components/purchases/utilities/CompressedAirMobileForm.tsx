'use client';

import React from 'react';
import {
  FaTrash,
  FaPaperclip,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
import { CompressedAirUtility, UtilityInputValue } from './UtilitiesTabContent';

interface CompressedAirMobileFormProps {
  item: CompressedAirUtility;
  isAirCompressorSystemAvailable: boolean;
  onInputChange: (
    id: number,
    field: keyof CompressedAirUtility,
    value: UtilityInputValue
  ) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
}

const CompressedAirMobileForm: React.FC<CompressedAirMobileFormProps> = ({
  item,
  isAirCompressorSystemAvailable,
  onInputChange,
  onFileChange,
  onDelete,
  isSelected,
  onSelect,
}) => {
  const handleLocalInputChange = (
    field: keyof CompressedAirUtility,
    value: UtilityInputValue
  ) => {
    onInputChange(item.id, field, value);
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(
      item.id,
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null
    );
  };

  return (
    <div
      className={`p-3 my-2 border rounded-md shadow-sm bg-white ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div
        className='flex justify-between items-center cursor-pointer'
        onClick={() => onSelect(isSelected ? null : item.id)}
      >
        <h4 className='text-md font-medium text-gray-800'>
          {item.materialName || `압축공기 ${item.id}`}
        </h4>
        {isSelected ? (
          <FaChevronDown className='text-gray-500' />
        ) : (
          <FaChevronRight className='text-gray-500' />
        )}
      </div>

      {isSelected && (
        <div className='mt-3 space-y-3'>
          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              구분
            </label>
            <input
              type='text'
              value='압축공기'
              readOnly
              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              물질명
            </label>
            <input
              type='text'
              value={item.materialName}
              onChange={(e) =>
                handleLocalInputChange('materialName', e.target.value)
              }
              className='w-full p-2 border border-gray-300 rounded-md text-sm'
              placeholder='예: 공기'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              자체 생산 여부
            </label>
            <select
              value={item.isSelfGenerated}
              onChange={(e) =>
                handleLocalInputChange(
                  'isSelfGenerated',
                  e.target.value as CompressedAirUtility['isSelfGenerated']
                )
              }
              className={`w-full p-2 border border-gray-300 rounded-md text-sm ${
                isAirCompressorSystemAvailable
                  ? ''
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
              disabled={!isAirCompressorSystemAvailable}
            >
              <option value=''>
                {isAirCompressorSystemAvailable ? '선택' : '비활성'}
              </option>
              {isAirCompressorSystemAvailable && (
                <option value='O'>O (자체생산)</option>
              )}
              {isAirCompressorSystemAvailable && (
                <option value='X'>X (외부구매)</option>
              )}
            </select>
            {!isAirCompressorSystemAvailable && (
              <p className='text-xs text-gray-500 mt-1'>
                공기압축기가 없는 경우 비활성화 됩니다.
              </p>
            )}
          </div>
          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              단위
            </label>
            <input
              type='text'
              value='Nm³'
              readOnly
              className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              파일첨부
            </label>
            {item.fileAttachment ? (
              <div className='flex items-center justify-between text-xs'>
                <span
                  className='text-blue-600 truncate max-w-[calc(100%-3rem)]'
                  title={item.fileAttachment.name}
                >
                  {item.fileAttachment.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileChange(item.id, null);
                  }}
                  className='text-red-500 hover:text-red-700'
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label className='w-full flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-xs'>
                <FaPaperclip className='mr-2 text-gray-500' />
                <span className='text-gray-700'>파일 선택</span>
                <input
                  type='file'
                  className='hidden'
                  onChange={handleLocalFileChange}
                />
              </label>
            )}
          </div>

          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className='w-full mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center justify-center'
          >
            <FaTrash className='mr-2' /> 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default CompressedAirMobileForm;
