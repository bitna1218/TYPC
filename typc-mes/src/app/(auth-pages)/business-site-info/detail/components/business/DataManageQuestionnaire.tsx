'use client';

import React, { useState, useEffect } from 'react';
import { FaCaretDown } from 'react-icons/fa';

interface DataManageQuestionnaireProps {
  className?: string;
  onDataChange?: (getData: () => DataManagementData) => void;
}

// 할당 방법 옵션
const allocationOptions = [
  { value: 'weight', label: '제품 생산량 (중량)' },
  { value: 'quantity', label: '제품 생산량 (수량)' },
  { value: 'direct', label: '비율 직접 입력' },
];

export interface DataManagementData {
  electricityMeasurement:
    | 'building'
    | 'process'
    | 'detail'
    | 'equipment'
    | 'none';
  steamMeasurement: 'building' | 'process' | 'detail' | 'equipment' | 'none';
  fuelAllocation: string;
  waterAllocation: string;
  gasAllocation: string;
  packagingAllocation: string;
  wasteAllocation: string;
  wasteGasAllocation: string;
  wasteWaterAllocation: string;
  coolingAllocation: string;
  refrigerantAllocation: string;
  fuelRatio: string;
  waterRatio: string;
  gasRatio: string;
  packagingRatio: string;
  wasteRatio: string;
  wasteGasRatio: string;
  wasteWaterRatio: string;
  coolingRatio: string;
  refrigerantRatio: string;
}

export default function DataManageQuestionnaire({
  className = '',
  onDataChange,
}: DataManageQuestionnaireProps) {
  // 전력 계측 관련 상태
  const [electricityMeasurement, setElectricityMeasurement] = useState<
    'building' | 'process' | 'detail' | 'equipment' | 'none'
  >('none');

  // 스팀 계측 관련 상태
  const [steamMeasurement, setSteamMeasurement] = useState<
    'building' | 'process' | 'detail' | 'equipment' | 'none'
  >('none');

  // 할당 방법 선택 상태
  const [fuelAllocation, setFuelAllocation] = useState<string>('');
  const [waterAllocation, setWaterAllocation] = useState<string>('');
  const [gasAllocation, setGasAllocation] = useState<string>('');
  const [packagingAllocation, setPackagingAllocation] = useState<string>('');
  const [wasteAllocation, setWasteAllocation] = useState<string>('');
  const [wasteGasAllocation, setWasteGasAllocation] = useState<string>('');
  const [wasteWaterAllocation, setWasteWaterAllocation] = useState<string>('');
  const [coolingAllocation, setCoolingAllocation] = useState<string>('');
  const [refrigerantAllocation, setRefrigerantAllocation] =
    useState<string>('');

  // 직접 입력 비율 상태
  const [fuelRatio, setFuelRatio] = useState<string>('');
  const [waterRatio, setWaterRatio] = useState<string>('');
  const [gasRatio, setGasRatio] = useState<string>('');
  const [packagingRatio, setPackagingRatio] = useState<string>('');
  const [wasteRatio, setWasteRatio] = useState<string>('');
  const [wasteGasRatio, setWasteGasRatio] = useState<string>('');
  const [wasteWaterRatio, setWasteWaterRatio] = useState<string>('');
  const [coolingRatio, setCoolingRatio] = useState<string>('');
  const [refrigerantRatio, setRefrigerantRatio] = useState<string>('');

  // 드롭다운 표시 상태
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // 데이터 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    if (onDataChange) {
      onDataChange(() => ({
        electricityMeasurement,
        steamMeasurement,
        fuelAllocation,
        waterAllocation,
        gasAllocation,
        packagingAllocation,
        wasteAllocation,
        wasteGasAllocation,
        wasteWaterAllocation,
        coolingAllocation,
        refrigerantAllocation,
        fuelRatio,
        waterRatio,
        gasRatio,
        packagingRatio,
        wasteRatio,
        wasteGasRatio,
        wasteWaterRatio,
        coolingRatio,
        refrigerantRatio,
      }));
    }
  }, [
    electricityMeasurement,
    steamMeasurement,
    fuelAllocation,
    waterAllocation,
    gasAllocation,
    packagingAllocation,
    wasteAllocation,
    wasteGasAllocation,
    wasteWaterAllocation,
    coolingAllocation,
    refrigerantAllocation,
    fuelRatio,
    waterRatio,
    gasRatio,
    packagingRatio,
    wasteRatio,
    wasteGasRatio,
    wasteWaterRatio,
    coolingRatio,
    refrigerantRatio,
    onDataChange,
  ]);

  // 세부공정 또는 설비를 선택했는지 확인
  const isDetailOrEquipmentSelected = () => {
    return (
      electricityMeasurement === 'detail' ||
      electricityMeasurement === 'equipment' ||
      steamMeasurement === 'detail' ||
      steamMeasurement === 'equipment'
    );
  };

  // 드롭다운 토글 함수
  const toggleDropdown = (dropdownName: string) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };

  // 비율 입력 핸들러
  const handleRatioChange = (type: string, value: string) => {
    // 숫자와 소수점만 허용 (최대 100까지)
    const validatedValue = value.replace(/[^\d.]/g, '');
    const numValue = parseFloat(validatedValue);

    if (validatedValue === '' || (numValue >= 0 && numValue <= 100)) {
      switch (type) {
        case 'fuel':
          setFuelRatio(validatedValue);
          break;
        case 'water':
          setWaterRatio(validatedValue);
          break;
        case 'gas':
          setGasRatio(validatedValue);
          break;
        case 'packaging':
          setPackagingRatio(validatedValue);
          break;
        case 'waste':
          setWasteRatio(validatedValue);
          break;
        case 'wasteGas':
          setWasteGasRatio(validatedValue);
          break;
        case 'wasteWater':
          setWasteWaterRatio(validatedValue);
          break;
        case 'cooling':
          setCoolingRatio(validatedValue);
          break;
        case 'refrigerant':
          setRefrigerantRatio(validatedValue);
          break;
      }
    }
  };

  // 할당 방법 선택 함수
  const handleAllocationSelect = (type: string, value: string) => {
    switch (type) {
      case 'fuel':
        setFuelAllocation(value);
        break;
      case 'water':
        setWaterAllocation(value);
        break;
      case 'gas':
        setGasAllocation(value);
        break;
      case 'packaging':
        setPackagingAllocation(value);
        break;
      case 'waste':
        setWasteAllocation(value);
        break;
      case 'wasteGas':
        setWasteGasAllocation(value);
        break;
      case 'wasteWater':
        setWasteWaterAllocation(value);
        break;
      case 'cooling':
        setCoolingAllocation(value);
        break;
      case 'refrigerant':
        setRefrigerantAllocation(value);
        break;
    }
    setOpenDropdown(null);
  };

  // 선택된 할당 방법 라벨 가져오기
  const getAllocationLabel = (value: string) => {
    const option = allocationOptions.find((opt) => opt.value === value);
    return option ? option.label : '할당 방법';
  };

  // 특정 할당 방법의 비율 값 가져오기
  const getRatioValue = (type: string) => {
    switch (type) {
      case 'fuel':
        return fuelRatio;
      case 'water':
        return waterRatio;
      case 'gas':
        return gasRatio;
      case 'packaging':
        return packagingRatio;
      case 'waste':
        return wasteRatio;
      case 'wasteGas':
        return wasteGasRatio;
      case 'wasteWater':
        return wasteWaterRatio;
      case 'cooling':
        return coolingRatio;
      case 'refrigerant':
        return refrigerantRatio;
      default:
        return '';
    }
  };

  // 특정 할당 방법의 현재 선택 값 가져오기
  const getAllocationValue = (type: string) => {
    switch (type) {
      case 'fuel':
        return fuelAllocation;
      case 'water':
        return waterAllocation;
      case 'gas':
        return gasAllocation;
      case 'packaging':
        return packagingAllocation;
      case 'waste':
        return wasteAllocation;
      case 'wasteGas':
        return wasteGasAllocation;
      case 'wasteWater':
        return wasteWaterAllocation;
      case 'cooling':
        return coolingAllocation;
      case 'refrigerant':
        return refrigerantAllocation;
      default:
        return '';
    }
  };

  // 할당 방법 드롭다운 렌더링
  const renderAllocationDropdown = (
    type: string,
    value: string,
    label: string = '할당 방법'
  ) => {
    const allocationValue = getAllocationValue(type);
    const showRatioInput = allocationValue === 'direct';

    return (
      <div className='relative'>
        <div className='mb-2'>
          <button
            type='button'
            className='flex items-center justify-between w-full px-4 py-2 bg-orange-100 border border-gray-300 rounded-md focus:outline-none'
            onClick={() => toggleDropdown(type)}
          >
            <span>{value ? getAllocationLabel(value) : label}</span>
            <FaCaretDown className='text-gray-500' />
          </button>

          {openDropdown === type && (
            <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg'>
              {allocationOptions.map((option) => (
                <div
                  key={option.value}
                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => handleAllocationSelect(type, option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {showRatioInput && (
          <div className='flex items-center'>
            <input
              type='text'
              className='w-full px-4 py-2 bg-yellow-50 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-300'
              value={getRatioValue(type)}
              onChange={(e) => handleRatioChange(type, e.target.value)}
              placeholder='0 ~ 100'
            />
            <span className='px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md text-gray-700'>
              %
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div className='p-6'>
        {/* 전력과 스팀을 계측할 경우 계측값의 범위를 선택해주십시오 */}
        <div className='mt-6'>
          <div className='flex items-start mb-6'>
            <div className='text-blue-600 mr-2'>✓</div>
            <div className='flex-grow'>
              <p className='font-medium text-blue-700 mb-4'>
                전력과 스팀을 계측할 경우 계측 값의 범위를 선택해주십시오
              </p>

              {/* 전력 */}
              <div className='flex flex-col md:flex-row items-start md:items-center gap-4 ml-0 md:ml-4 mb-6'>
                <span className='font-medium text-blue-600 min-w-[100px]'>
                  전력
                </span>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={electricityMeasurement === 'building'}
                      onChange={() => setElectricityMeasurement('building')}
                    />
                    <span className='ml-2'>건물</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={electricityMeasurement === 'process'}
                      onChange={() => setElectricityMeasurement('process')}
                    />
                    <span className='ml-2'>공정</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={electricityMeasurement === 'detail'}
                      onChange={() => setElectricityMeasurement('detail')}
                    />
                    <span className='ml-2'>세부공정</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={electricityMeasurement === 'equipment'}
                      onChange={() => setElectricityMeasurement('equipment')}
                    />
                    <span className='ml-2'>설비</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={electricityMeasurement === 'none'}
                      onChange={() => setElectricityMeasurement('none')}
                    />
                    <span className='ml-2'>계측 안함</span>
                  </label>
                </div>
              </div>

              {/* 스팀 */}
              <div className='flex flex-col md:flex-row items-start md:items-center gap-4 ml-0 md:ml-4'>
                <span className='font-medium text-blue-600 min-w-[100px]'>
                  스팀
                </span>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={steamMeasurement === 'building'}
                      onChange={() => setSteamMeasurement('building')}
                    />
                    <span className='ml-2'>건물</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={steamMeasurement === 'process'}
                      onChange={() => setSteamMeasurement('process')}
                    />
                    <span className='ml-2'>공정</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={steamMeasurement === 'detail'}
                      onChange={() => setSteamMeasurement('detail')}
                    />
                    <span className='ml-2'>세부공정</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={steamMeasurement === 'equipment'}
                      onChange={() => setSteamMeasurement('equipment')}
                    />
                    <span className='ml-2'>설비</span>
                  </label>

                  <label className='flex items-center cursor-pointer'>
                    <input
                      type='radio'
                      className='h-5 w-5 text-blue-600'
                      checked={steamMeasurement === 'none'}
                      onChange={() => setSteamMeasurement('none')}
                    />
                    <span className='ml-2'>계측 안함</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 할당 방법을 선택해주십시오 */}
        <div className='mt-8'>
          <div className='flex items-start'>
            <div className='text-blue-600 mr-2'>✓</div>
            <div className='flex-grow'>
              <p className='font-medium text-blue-700 mb-4'>
                할당 방법을 선택해주십시오
              </p>

              {isDetailOrEquipmentSelected() && (
                <div className='mb-6 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-md'>
                  계측 범위로 세부공정 또는 설비를 선택한 경우 할당 방법을
                  선택하지 않아도 됩니다.
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-4'>
                {/* 연료 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    연료
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown('fuel', fuelAllocation)}
                  </div>
                </div>

                {/* 용수 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    용수
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown('water', waterAllocation)}
                  </div>
                </div>

                {/* 산업용 가스 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    산업용 가스
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown('gas', gasAllocation)}
                  </div>
                </div>

                {/* 압축 공기 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    압축 공기
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown('cooling', coolingAllocation)}
                  </div>
                </div>

                {/* 냉매 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    냉매
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown(
                      'refrigerant',
                      refrigerantAllocation
                    )}
                  </div>
                </div>

                {/* 부자재 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    부자재
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown('packaging', packagingAllocation)}
                  </div>
                </div>

                {/* 폐기물 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    폐기물
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown('waste', wasteAllocation)}
                  </div>
                </div>

                {/* 폐가스 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    폐가스
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown('wasteGas', wasteGasAllocation)}
                  </div>
                </div>

                {/* 페수 */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                  <span className='font-medium text-blue-600 min-w-[120px]'>
                    폐수
                  </span>
                  <div className='w-full md:w-64'>
                    {renderAllocationDropdown(
                      'wasteWater',
                      wasteWaterAllocation
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
