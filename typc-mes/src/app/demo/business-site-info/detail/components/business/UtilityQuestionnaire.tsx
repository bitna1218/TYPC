'use client';

import React, { useState, useEffect } from 'react';

interface UtilityQuestionnaireProps {
  className?: string;
  onDataChange?: (getData: () => UtilityData) => void;
}

export interface UtilityData {
  // 유틸리티 시설 데이터
  hasBoiler: 'yes' | 'no' | null;
  boilerCount: number | null;
  hasCompressor: 'yes' | 'no' | null;
  compressorCount: number | null;

  // 환경오염물질 처리 시설 데이터
  hasWastewaterTreatment: 'yes' | 'no' | null;
  wastewaterCount: number | null;
  hasBiologicalTreatment: boolean;
  hasChemicalTreatment: boolean;

  hasAirPollutionFacility: 'yes' | 'no' | null;
  airPollutionCount: number | null;
  hasDesulfurizationProcess: boolean;
  hasDenitrationProcess: boolean;
  hasOtherProcess: boolean;
}

export default function UtilityQuestionnaire({
  className = '',
  onDataChange,
}: UtilityQuestionnaireProps) {
  // 유틸리티 시설 상태
  const [hasBoiler, setHasBoiler] = useState<'yes' | 'no' | null>(null);
  const [boilerCount, setBoilerCount] = useState<number | null>(null);
  const [hasCompressor, setHasCompressor] = useState<'yes' | 'no' | null>(null);
  const [compressorCount, setCompressorCount] = useState<number | null>(null);

  // 환경오염물질 처리 시설 상태
  const [hasWastewaterTreatment, setHasWastewaterTreatment] = useState<
    'yes' | 'no' | null
  >(null);
  const [wastewaterCount, setWastewaterCount] = useState<number | null>(null);
  const [hasBiologicalTreatment, setHasBiologicalTreatment] =
    useState<boolean>(false);
  const [hasChemicalTreatment, setHasChemicalTreatment] =
    useState<boolean>(false);

  const [hasAirPollutionFacility, setHasAirPollutionFacility] = useState<
    'yes' | 'no' | null
  >(null);
  const [airPollutionCount, setAirPollutionCount] = useState<number | null>(
    null
  );
  const [hasDesulfurizationProcess, setHasDesulfurizationProcess] =
    useState<boolean>(false);
  const [hasDenitrationProcess, setHasDenitrationProcess] =
    useState<boolean>(false);
  const [hasOtherProcess, setHasOtherProcess] = useState<boolean>(false);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(() => ({
        hasBoiler,
        boilerCount,
        hasCompressor,
        compressorCount,
        hasWastewaterTreatment,
        wastewaterCount,
        hasBiologicalTreatment,
        hasChemicalTreatment,
        hasAirPollutionFacility,
        airPollutionCount,
        hasDesulfurizationProcess,
        hasDenitrationProcess,
        hasOtherProcess,
      }));
    }
  }, [
    hasBoiler,
    boilerCount,
    hasCompressor,
    compressorCount,
    hasWastewaterTreatment,
    wastewaterCount,
    hasBiologicalTreatment,
    hasChemicalTreatment,
    hasAirPollutionFacility,
    airPollutionCount,
    hasDesulfurizationProcess,
    hasDenitrationProcess,
    hasOtherProcess,
    onDataChange,
  ]);

  // 숫자 입력 핸들러
  const handleNumberChange = (
    type: 'boiler' | 'compressor' | 'wastewater' | 'airPollution',
    value: string
  ) => {
    const numberValue = value === '' ? null : Math.max(1, parseInt(value) || 0);

    switch (type) {
      case 'boiler':
        setBoilerCount(numberValue);
        break;
      case 'compressor':
        setCompressorCount(numberValue);
        break;
      case 'wastewater':
        setWastewaterCount(numberValue);
        break;
      case 'airPollution':
        setAirPollutionCount(numberValue);
        break;
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 유틸리티 시설 조사 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            유틸리티 시설 조사
          </h2>
        </div>

        {/* 스팀 생산보일러 */}
        <div className='mt-6'>
          <div className='flex items-start mb-4'>
            <div className='text-blue-600 mr-2'>✓</div>
            <div className='flex flex-col md:flex-row md:items-center flex-grow gap-4'>
              <span className='font-medium text-blue-700 min-w-[230px]'>
                스팀 생산보일러가 있습니까?
              </span>

              <div className='flex items-center space-x-8'>
                <label className='flex items-center cursor-pointer'>
                  <input
                    type='radio'
                    className='h-5 w-5 text-blue-600'
                    checked={hasBoiler === 'yes'}
                    onChange={() => setHasBoiler('yes')}
                  />
                  <span className='ml-2'>예</span>
                </label>

                <label className='flex items-center cursor-pointer'>
                  <input
                    type='radio'
                    className='h-5 w-5 text-blue-600'
                    checked={hasBoiler === 'no'}
                    onChange={() => setHasBoiler('no')}
                  />
                  <span className='ml-2'>아니오</span>
                </label>
              </div>

              {hasBoiler === 'yes' && (
                <div className='flex items-center ml-0 md:ml-4'>
                  <input
                    type='number'
                    min='1'
                    className='px-4 py-2 w-28 border border-gray-300 rounded-md'
                    value={boilerCount || ''}
                    onChange={(e) =>
                      handleNumberChange('boiler', e.target.value)
                    }
                  />
                  <span className='ml-2'>개</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 공기압축기 */}
        <div className='mt-6'>
          <div className='flex items-start mb-4'>
            <div className='text-blue-600 mr-2'>✓</div>
            <div className='flex flex-col md:flex-row md:items-center flex-grow gap-4'>
              <span className='font-medium text-blue-700 min-w-[230px]'>
                공기압축기가 있습니까?
              </span>

              <div className='flex items-center space-x-8'>
                <label className='flex items-center cursor-pointer'>
                  <input
                    type='radio'
                    className='h-5 w-5 text-blue-600'
                    checked={hasCompressor === 'yes'}
                    onChange={() => setHasCompressor('yes')}
                  />
                  <span className='ml-2'>예</span>
                </label>

                <label className='flex items-center cursor-pointer'>
                  <input
                    type='radio'
                    className='h-5 w-5 text-blue-600'
                    checked={hasCompressor === 'no'}
                    onChange={() => setHasCompressor('no')}
                  />
                  <span className='ml-2'>아니오</span>
                </label>
              </div>

              {hasCompressor === 'yes' && (
                <div className='flex items-center ml-0 md:ml-4'>
                  <input
                    type='number'
                    min='1'
                    className='px-4 py-2 w-28 border border-gray-300 rounded-md'
                    value={compressorCount || ''}
                    onChange={(e) =>
                      handleNumberChange('compressor', e.target.value)
                    }
                  />
                  <span className='ml-2'>개</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 환경오염물질 처리 시설 조사 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            환경오염물질 처리 시설 조사
          </h2>
        </div>

        {/* 폐수처리장 */}
        <div className='mt-6'>
          <div className='flex items-start mb-4'>
            <div className='text-blue-600 mr-2'>✓</div>
            <div className='flex flex-col flex-grow gap-4'>
              <div className='flex flex-col md:flex-row md:items-center gap-4'>
                <span className='font-medium text-blue-700 min-w-[230px]'>
                  폐수처리장이 있습니까?
                </span>

                <div className='flex items-center space-x-8'>
                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={hasWastewaterTreatment === 'yes'}
                      onChange={() => setHasWastewaterTreatment('yes')}
                    />
                    <span className='ml-2'>예</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={hasWastewaterTreatment === 'no'}
                      onChange={() => setHasWastewaterTreatment('no')}
                    />
                    <span className='ml-2'>아니오</span>
                  </label>
                </div>

                {hasWastewaterTreatment === 'yes' && (
                  <div className='flex items-center ml-0 md:ml-4'>
                    <input
                      type='number'
                      min='1'
                      className='px-4 py-2 w-28 border border-gray-300 rounded-md'
                      value={wastewaterCount || ''}
                      onChange={(e) =>
                        handleNumberChange('wastewater', e.target.value)
                      }
                    />
                    <span className='ml-2'>개</span>
                  </div>
                )}
              </div>

              {hasWastewaterTreatment === 'yes' && (
                <div className='flex flex-col md:flex-row md:items-center ml-0 md:ml-[230px] gap-4'>
                  <div className='flex space-x-8'>
                    <label className='flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 text-blue-600 rounded'
                        checked={hasBiologicalTreatment}
                        onChange={(e) =>
                          setHasBiologicalTreatment(e.target.checked)
                        }
                      />
                      <span className='ml-2'>생물학적 처리</span>
                    </label>

                    <label className='flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 text-blue-600 rounded'
                        checked={hasChemicalTreatment}
                        onChange={(e) =>
                          setHasChemicalTreatment(e.target.checked)
                        }
                      />
                      <span className='ml-2'>화학적 처리</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 대기오염방지시설 */}
        <div className='mt-8'>
          <div className='flex items-start mb-4'>
            <div className='text-blue-600 mr-2'>✓</div>
            <div className='flex flex-col flex-grow gap-4'>
              <div className='flex flex-col md:flex-row md:items-center gap-4'>
                <span className='font-medium text-blue-700 min-w-[230px]'>
                  대기오염방지시설이 있습니까?
                </span>

                <div className='flex items-center space-x-8'>
                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={hasAirPollutionFacility === 'yes'}
                      onChange={() => setHasAirPollutionFacility('yes')}
                    />
                    <span className='ml-2'>예</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={hasAirPollutionFacility === 'no'}
                      onChange={() => setHasAirPollutionFacility('no')}
                    />
                    <span className='ml-2'>아니오</span>
                  </label>
                </div>

                {hasAirPollutionFacility === 'yes' && (
                  <div className='flex items-center ml-0 md:ml-4'>
                    <input
                      type='number'
                      min='1'
                      className='px-4 py-2 w-28 border border-gray-300 rounded-md'
                      value={airPollutionCount || ''}
                      onChange={(e) =>
                        handleNumberChange('airPollution', e.target.value)
                      }
                    />
                    <span className='ml-2'>개</span>
                  </div>
                )}
              </div>

              {hasAirPollutionFacility === 'yes' && (
                <div className='flex flex-wrap md:ml-[230px] gap-4'>
                  <div className='flex items-center space-x-6'>
                    <label className='flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 text-blue-600 rounded'
                        checked={hasDesulfurizationProcess}
                        onChange={(e) =>
                          setHasDesulfurizationProcess(e.target.checked)
                        }
                      />
                      <span className='ml-2'>탈황 공정</span>
                    </label>

                    <label className='flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 text-blue-600 rounded'
                        checked={hasDenitrationProcess}
                        onChange={(e) =>
                          setHasDenitrationProcess(e.target.checked)
                        }
                      />
                      <span className='ml-2'>탈질 공정</span>
                    </label>

                    <label className='flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 text-blue-600 rounded'
                        checked={hasOtherProcess}
                        onChange={(e) => setHasOtherProcess(e.target.checked)}
                      />
                      <span className='ml-2'>그 외</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
