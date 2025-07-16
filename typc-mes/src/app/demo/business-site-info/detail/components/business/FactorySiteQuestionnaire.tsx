'use client';

import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';

export interface FactorySiteData {
  landUsageDuration: 'yes' | 'no' | null;
  emissionType: 'direct' | 'indirect' | null;
  landArea: string;
  attachedFile: File | null;
}

interface QuestionnaireProps {
  className?: string;
  onDataChange?: (getData: () => FactorySiteData) => void;
}

export default function FactorySiteQuestionnaire({
  className = '',
  onDataChange,
}: QuestionnaireProps) {
  const [landUsageDuration, setLandUsageDuration] = useState<
    'yes' | 'no' | null
  >(null);
  const [emissionType, setEmissionType] = useState<
    'direct' | 'indirect' | null
  >(null);
  const [landArea, setLandArea] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(() => ({
        landUsageDuration,
        emissionType,
        landArea,
        attachedFile,
      }));
    }
  }, [landUsageDuration, emissionType, landArea, attachedFile, onDataChange]);

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* 질문 1: 부지조성일 20년 이내 여부 */}
      <div className='mb-8'>
        <div className='flex items-start mb-4'>
          <div className='text-blue-600 mr-2'>✓</div>
          <div>
            <p className='font-medium'>
              부지조성일이 현재 시점에서부터 20년 이내입니까?{' '}
              <span className='text-red-500'>*</span>
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-8 ml-6'>
          <label className='flex items-center cursor-pointer'>
            <input
              type='radio'
              className='h-5 w-5 text-blue-600'
              checked={landUsageDuration === 'yes'}
              onChange={() => setLandUsageDuration('yes')}
            />
            <span className='ml-2'>예</span>
          </label>

          <label className='flex items-center cursor-pointer'>
            <input
              type='radio'
              className='h-5 w-5 text-blue-600'
              checked={landUsageDuration === 'no'}
              onChange={() => setLandUsageDuration('no')}
            />
            <span className='ml-2'>아니오</span>
          </label>
        </div>
      </div>

      {landUsageDuration === 'yes' && (
        <>
          {/* 질문 2: 공장부지조성 이전의 토지종류 */}
          <div className='mb-8'>
            <div className='flex items-start mb-4'>
              <div className='text-blue-600 mr-2'>✓</div>
              <div>
                <p className='font-medium'>
                  공장부지조성 이전의 토지종류를 선택해주시기 바랍니다.
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-8 ml-6'>
              <label className='flex items-center cursor-pointer'>
                <input
                  type='radio'
                  className='h-5 w-5 text-blue-600'
                  checked={emissionType === 'direct'}
                  onChange={() => setEmissionType('direct')}
                  disabled={landUsageDuration !== 'yes'}
                />
                <span className='ml-2'>산림</span>
              </label>

              <label className='flex items-center cursor-pointer'>
                <input
                  type='radio'
                  className='h-5 w-5 text-blue-600'
                  checked={emissionType === 'indirect'}
                  onChange={() => setEmissionType('indirect')}
                  disabled={landUsageDuration !== 'yes'}
                />
                <span className='ml-2'>농경지</span>
              </label>
            </div>
          </div>

          {/* 질문 3: 공장부지면적 */}
          <div className='mb-8'>
            <div className='flex items-start mb-4'>
              <div className='text-blue-600 mr-2'>✓</div>
              <div>
                <p className='font-medium'>
                  공장부지면적 (m²)을 작성해주시기 바랍니다.{' '}
                  <span className='text-red-500'>*</span>
                </p>
              </div>
            </div>

            <div className='flex items-center ml-6'>
              <input
                type='text'
                className='w-64 px-4 py-2 bg-yellow-100 border border-gray-300 rounded-md'
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                disabled={landUsageDuration !== 'yes'}
                placeholder='숫자만 입력'
              />
              <span className='ml-2'>m²</span>

              <div className='flex flex-col ml-4'>
                <label className='flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-300 cursor-pointer hover:bg-blue-100 w-fit'>
                  <FaUpload className='mr-2' />
                  <span>파일 선택</span>
                  <input
                    type='file'
                    className='hidden'
                    onChange={handleFileUpload}
                    accept='.pdf,.jpg,.jpeg,.png'
                    disabled={landUsageDuration !== 'yes'}
                  />
                </label>

                {attachedFile && (
                  <div className='flex items-center mt-2'>
                    <span className='text-gray-700 text-sm break-all mr-2 max-w-xs'>
                      {attachedFile.name}
                    </span>
                    <button
                      type='button'
                      className='text-red-600 hover:text-red-800'
                      onClick={() => setAttachedFile(null)}
                    >
                      삭제
                    </button>
                  </div>
                )}

                <p className='mt-1 text-sm text-gray-500'>
                  PDF, JPG, JPEG, PNG 파일 (최대 10MB)
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
