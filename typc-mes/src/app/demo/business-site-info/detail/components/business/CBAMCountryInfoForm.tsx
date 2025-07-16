'use client';

import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import CountrySelectModal from './CountrySelectModal';

export interface CBAMCountryData {
  postalCode: string;
  poBox: string;
  cityName: string;
  countryName: string;
  unlocode: string;
  longitude: string;
  latitude: string;
}

interface CBAMCountryInfoFormProps {
  className?: string;
  onDataChange?: (getData: () => CBAMCountryData) => void;
}

export default function CBAMCountryInfoForm({
  className = '',
  onDataChange,
}: CBAMCountryInfoFormProps) {
  const [postalCode, setPostalCode] = useState<string>('');
  const [poBox, setPoBox] = useState<string>('');
  const [cityName, setCityName] = useState<string>('');
  const [countryName, setCountryName] = useState<string>('');
  const [unlocode, setUnlocode] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');

  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(() => ({
        postalCode,
        poBox,
        cityName,
        countryName,
        unlocode,
        longitude,
        latitude,
      }));
    }
  }, [
    postalCode,
    poBox,
    cityName,
    countryName,
    unlocode,
    longitude,
    latitude,
    onDataChange,
  ]);

  return (
    <div className={`${className}`}>
      {/* CBAM 국가 정보 폼 */}
      <div className='p-4 md:p-6'>


        <div className='space-y-6 md:space-y-8'>
          {/* 우편번호 */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center'>
            <div className='md:col-span-3 flex items-center text-blue-700'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>
                우편번호 <span className='text-red-500'>*</span>
              </span>
            </div>
            <div className='md:col-span-9'>
              <input
                type='text'
                className='w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md'
                placeholder='우편번호 입력'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          {/* P.O.BOX */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center'>
            <div className='md:col-span-3 flex items-center text-blue-700'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>
                P.O.BOX <span className='text-red-500'>*</span>
              </span>
            </div>
            <div className='md:col-span-9'>
              <input
                type='text'
                className='w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md'
                placeholder='P.O.BOX 입력'
                value={poBox}
                onChange={(e) => setPoBox(e.target.value)}
              />
            </div>
          </div>

          {/* 도시명 */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center'>
            <div className='md:col-span-3 flex items-center text-blue-700'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>
                도시명 <span className='text-red-500'>*</span>
              </span>
            </div>
            <div className='md:col-span-9'>
              <input
                type='text'
                className='w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md'
                placeholder='도시명 입력'
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
              />
            </div>
          </div>

          {/* 나라 선택 버튼 */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center'>
            <div className='md:col-span-3'></div>
            <div className='md:col-span-9'>
              <button
                type='button'
                className='px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-200 flex items-center'
                onClick={() => setShowCountryModal(true)}
              >
                <FaSearch className='mr-2' />
                <span>나라 선택</span>
              </button>
              <p className='mt-1 text-sm text-gray-500'>
                아래 항목을 채우려면 나라를 선택하세요
              </p>
            </div>
          </div>

          {/* 나라명 */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center'>
            <div className='md:col-span-3 flex items-center text-blue-700'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>
                나라명 <span className='text-red-500'>*</span>
              </span>
            </div>
            <div className='md:col-span-9'>
              <input
                type='text'
                className='w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md'
                placeholder='나라명 입력'
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                readOnly
              />
            </div>
          </div>

          {/* UNLOCODE */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center'>
            <div className='md:col-span-3 flex items-center text-blue-700'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>
                UNLOCODE <span className='text-red-500'>*</span>
              </span>
            </div>
            <div className='md:col-span-9'>
              <input
                type='text'
                className='w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md'
                placeholder='UNLOCODE 입력'
                value={unlocode}
                onChange={(e) => setUnlocode(e.target.value)}
                readOnly
              />
            </div>
          </div>

          {/* 좌표-경도 */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center'>
            <div className='md:col-span-3 flex items-center text-blue-700'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>
                좌표-경도 <span className='text-red-500'>*</span>
              </span>
            </div>
            <div className='md:col-span-9'>
              <input
                type='text'
                className='w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md'
                placeholder='경도 입력'
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>

          {/* 좌표-위도 */}
          <div className='grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center'>
            <div className='md:col-span-3 flex items-center text-blue-700'>
              <span className='text-blue-600 mr-2'>✓</span>
              <span>
                좌표-위도 <span className='text-red-500'>*</span>
              </span>
            </div>
            <div className='md:col-span-9'>
              <input
                type='text'
                className='w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md'
                placeholder='위도 입력'
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 국가 선택 모달 */}
      <CountrySelectModal
        isOpen={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        onSelect={(country) => {
          setCountryName(country.name);
          setUnlocode(country.code);
          setShowCountryModal(false);
        }}
        title='국가 선택'
      />
    </div>
  );
}
