'use client';

import React from 'react';
import { FaTrash, FaPaperclip, FaTimes } from 'react-icons/fa';
import { CompressedAirUtility, UtilityInputValue } from './UtilitiesTabContent';

interface CompressedAirDeskTopFormProps {
  items: CompressedAirUtility[];
  isAirCompressorSystemAvailable: boolean;
  onInputChange: (
    id: number,
    field: keyof CompressedAirUtility,
    value: UtilityInputValue
  ) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDelete: (id: number) => void;
}

const CompressedAirDeskTopForm: React.FC<CompressedAirDeskTopFormProps> = ({
  items,
  isAirCompressorSystemAvailable,
  onInputChange,
  onFileChange,
  onDelete,
}) => {
  if (!items || items.length === 0) {
    return (
      <p className='text-center text-gray-500 py-4'>
        압축공기 정보가 없습니다. &quot;압축공기 추가&quot; 버튼을 클릭하여
        추가해주세요.
      </p>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200 text-sm'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[15%]'>
              구분
            </th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[25%]'>
              물질명
            </th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[20%]'>
              자체 생산 여부
            </th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[15%]'>
              단위
            </th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[25%]'>
              파일첨부
            </th>
            <th className='px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider w-[10%]'>
              작업
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {items.map((item) => (
            <tr key={item.id}>
              <td className='px-3 py-3 whitespace-nowrap'>
                <input
                  type='text'
                  value='압축공기'
                  readOnly
                  className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm text-center'
                />
              </td>
              <td className='px-3 py-3 whitespace-nowrap'>
                <input
                  type='text'
                  value={item.materialName}
                  onChange={(e) =>
                    onInputChange(item.id, 'materialName', e.target.value)
                  }
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                  placeholder='예: 공기'
                />
              </td>
              <td className='px-3 py-3 whitespace-nowrap'>
                <select
                  value={item.isSelfGenerated}
                  onChange={(e) =>
                    onInputChange(
                      item.id,
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
                  <p className='text-xs text-gray-500 mt-1'>공기압축기 없음</p>
                )}
              </td>
              <td className='px-3 py-3 whitespace-nowrap'>
                <input
                  type='text'
                  value='Nm³'
                  readOnly
                  className='w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm text-center'
                />
              </td>
              <td className='px-3 py-3 whitespace-nowrap'>
                {item.fileAttachment ? (
                  <div className='flex items-center justify-between'>
                    <span
                      className='text-blue-600 truncate max-w-[calc(100%-2rem)]'
                      title={item.fileAttachment.name}
                    >
                      {item.fileAttachment.name}
                    </span>
                    <button
                      onClick={() => onFileChange(item.id, null)}
                      className='text-red-500 hover:text-red-700 ml-2'
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <label className='w-full flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm'>
                    <FaPaperclip className='mr-2 text-gray-400' />
                    <span className='text-gray-500'>파일 선택</span>
                    <input
                      type='file'
                      className='hidden'
                      onChange={(e) =>
                        onFileChange(
                          item.id,
                          e.target.files && e.target.files.length > 0
                            ? e.target.files[0]
                            : null
                        )
                      }
                    />
                  </label>
                )}
              </td>
              <td className='px-3 py-3 whitespace-nowrap text-center'>
                <button
                  type='button'
                  onClick={() => onDelete(item.id)}
                  className='p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100'
                  aria-label='삭제'
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompressedAirDeskTopForm;
