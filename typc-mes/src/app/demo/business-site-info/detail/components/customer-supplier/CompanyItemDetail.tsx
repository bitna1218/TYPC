'use client';

import React from 'react';
import {
  FaPlus,
  FaTrash,
  FaUpload,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from 'react-icons/fa';

export interface CompanyItem {
  id: number;
  name: string;
  originCountry: string;
  destinationCountry: string;
  transportation: string[];
  distance: string;
  file: File | null;
}

interface CompanyItemDetailProps {
  title: string;
  items: CompanyItem[];
  selectedItemId: number | null;
  onSelect: (id: number) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  onInputChange: (field: keyof Omit<CompanyItem, 'transportation'>, value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDelete: () => void;
  transportationOptions: string[];
  selectedTransportations: string[];
  isTransportationExpanded: boolean;
  toggleTransportationExpanded: () => void;
  toggleTransportation: (transport: string) => void;
  removeTransportation: (transport: string) => void;
}

// 공통으로 사용할 마스터-디테일 컴포넌트
export default function CompanyItemDetail({
  title,
  items,
  selectedItemId,
  onSelect,
  onAdd,
  onDelete,
  onInputChange,
  onFileUpload,
  onFileDelete,
  transportationOptions,
  selectedTransportations,
  isTransportationExpanded,
  toggleTransportationExpanded,
  toggleTransportation,
  removeTransportation,
}: CompanyItemDetailProps) {
  const selectedItem = items.find((item) => item.id === selectedItemId) || null;
  const selectedTransportationCount = selectedTransportations.length;

  // 항목이 없을 때 빈 화면 렌더링
  if (items.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
        </div>
        
        <div className='py-12 flex flex-col items-center justify-center text-center'>
          <div className='text-gray-400 mb-4'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className='text-lg text-gray-600 mb-4'>등록된 항목이 없습니다.</p>
          <p className='text-sm text-gray-500 mb-6'>아래 버튼을 클릭하여 첫 번째 항목을 등록해보세요.</p>
          <button
            type='button'
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center'
            onClick={onAdd}
          >
            <FaPlus className='mr-2' size={14} />
            <span>항목 추가하기</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
      </div>
      
      {/* 상단 버튼 영역 */}
      <div className='flex justify-end mb-4 gap-2'>
        <button
          type='button'
          className='px-3 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none flex items-center'
          onClick={onAdd}
        >
          <FaPlus className='mr-2' size={14} />
          <span>추가</span>
        </button>
      </div>
      
      {/* 마스터-디테일 레이아웃 */}
      <div className='flex flex-col md:flex-row gap-6'>
        {/* 마스터 뷰 (목록) */}
        <div className='w-full md:w-1/3 border border-gray-200 rounded-md overflow-hidden'>
          <div className='bg-blue-100 py-2 px-3 border-b border-gray-200'>
            <h3 className='font-medium text-blue-800'>목록</h3>
          </div>
          <div className='overflow-y-auto max-h-96'>
            {items.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`px-3 py-3 flex justify-between items-center border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedItemId === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className='flex-1 truncate'>
                  <p className={`font-medium ${item.name ? '' : 'text-gray-400 italic'}`}>
                    {item.name || '(이름 없음)'}
                  </p>
                  {item.transportation.length > 0 && (
                    <p className='text-xs text-gray-500 mt-1 truncate'>{item.transportation.join(', ')}</p>
                  )}
                </div>
                <FaChevronRight size={12} className='text-gray-400' />
              </div>
            ))}
          </div>
        </div>
        
        {/* 디테일 뷰 (선택된 항목 상세) */}
        <div className='w-full md:w-2/3 border border-gray-200 rounded-md'>
          {selectedItem ? (
            <div className='p-4'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-medium text-lg'>상세 정보</h3>
                <button
                  type='button'
                  className='text-red-600 hover:text-red-800 flex items-center'
                  onClick={() => onDelete(selectedItem.id)}
                >
                  <FaTrash size={14} className='mr-1' />
                  <span className='text-sm'>삭제</span>
                </button>
              </div>
              
              <div className='space-y-4'>
                {/* 이름 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    {title === '2-1. 제품 고객사' ? '고객사명' : '공급업체명'} <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                    value={selectedItem.name}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    placeholder={title === '2-1. 제품 고객사' ? '고객사명' : '공급업체명'}
                  />
                </div>
                
                {/* 출발지 주소 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    출발지 주소
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                    value={selectedItem.originCountry}
                    onChange={(e) => onInputChange('originCountry', e.target.value)}
                    placeholder='출발지 주소'
                  />
                </div>
                
                {/* 도착지 주소 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    도착지 주소
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                    value={selectedItem.destinationCountry}
                    onChange={(e) => onInputChange('destinationCountry', e.target.value)}
                    placeholder='도착지 주소'
                  />
                </div>
                
                {/* 운송수단 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    운송수단 <span className='text-red-500'>*</span>
                  </label>
                  <div className='rounded-md border border-gray-200 bg-yellow-50'>
                    {/* 헤더 영역 */}
                    <div className='flex items-center justify-between border-b border-gray-200 p-3'>
                      <div className='flex items-center'>
                        <button
                          type='button'
                          onClick={toggleTransportationExpanded}
                          className='flex items-center text-blue-600 hover:text-blue-800 focus:outline-none'
                        >
                          {isTransportationExpanded ? (
                            <FaChevronUp className='mr-2' />
                          ) : (
                            <FaChevronDown className='mr-2' />
                          )}
                          <span>
                            운송수단 선택{' '}
                            {selectedTransportationCount > 0
                              ? `(${selectedTransportationCount})`
                              : ''}
                          </span>
                        </button>
                      </div>
                      <div className='text-sm text-gray-600'>
                        해당하는 운송수단을 모두 선택하세요
                      </div>
                    </div>

                    {/* 선택된 운송수단 표시 영역 */}
                    {selectedTransportationCount > 0 && (
                      <div className='flex flex-wrap gap-2 border-b border-gray-200 bg-white p-3'>
                        {selectedTransportations.map((transport, index) => (
                          <div
                            key={`selected-${index}`}
                            className='flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'
                          >
                            <span>{transport}</span>
                            <button
                              onClick={() => removeTransportation(transport)}
                              className='ml-2 text-blue-600 hover:text-blue-800 focus:outline-none'
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 펼쳐진 상태일 때만 모든 옵션 표시 */}
                    {isTransportationExpanded && (
                      <div className='max-h-60 overflow-y-auto bg-white p-3'>
                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                          {transportationOptions.map((transport, index) => (
                            <div
                              key={index}
                              className='flex items-center rounded p-2 hover:bg-gray-50'
                            >
                              <input
                                type='checkbox'
                                className='form-checkbox h-4 w-4 rounded text-blue-600'
                                id={`transport-${index}`}
                                checked={selectedTransportations.includes(
                                  transport,
                                )}
                                onChange={() => toggleTransportation(transport)}
                              />
                              <label
                                htmlFor={`transport-${index}`}
                                className='ml-2 cursor-pointer select-none text-sm'
                              >
                                {transport}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 운송거리 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    운송거리 (km) <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                    value={selectedItem.distance}
                    onChange={(e) => onInputChange('distance', e.target.value)}
                    placeholder='거리(km)'
                  />
                </div>
                
                {/* 파일 첨부 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    파일 첨부
                  </label>
                  <div className='flex flex-col'>
                    <div className='flex space-x-2'>
                      <label className='flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-300 cursor-pointer hover:bg-blue-100'>
                        <FaUpload className='mr-2' size={14} />
                        <span>파일 선택</span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={onFileUpload}
                          accept='.pdf,.jpg,.jpeg,.png'
                        />
                      </label>
                      
                      {selectedItem.file && (
                        <button
                          type='button'
                          className='px-3 py-2 bg-red-50 text-red-700 border border-red-300 rounded-md hover:bg-red-100'
                          onClick={onFileDelete}
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>

                    {selectedItem.file ? (
                      <div className='mt-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md'>
                        <span className='text-gray-700 break-all'>
                          {selectedItem.file.name}
                        </span>
                      </div>
                    ) : (
                      <p className='mt-2 text-sm text-gray-500'>
                        선택된 파일 없음
                      </p>
                    )}
                    
                    <p className='text-xs text-gray-500 mt-1'>
                      PDF, JPG, JPEG, PNG 파일 (최대 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='p-6 text-center text-gray-500'>
              선택된 항목이 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 