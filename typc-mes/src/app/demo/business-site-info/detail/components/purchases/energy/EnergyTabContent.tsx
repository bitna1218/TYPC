'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';

// Form component imports
import FuelMobileForm from './FuelMobileForm';
import FuelDeskTopForm from './FuelDeskTopForm';
import ElectricityMobileForm from './ElectricityMobileForm';
import ElectricityDeskTopForm from './ElectricityDeskTopForm';
import SteamMobileForm from './SteamMobileForm';
import SteamDeskTopForm from './SteamDeskTopForm';

// --- Interfaces ---
export interface Fuel {
  id: number;
  name: string;
  unit: 'kg' | 'L' | 'Nm³' | '';
  isBiomass: 'O' | 'X' | '';
  biomassPercentage: number | string;
  fileAttachment: File | null;
}

export interface Electricity {
  id: number;
  type:
    | '한전 전기'
    | 'PPA-태양광'
    | 'PPA-풍력'
    | 'PPA-기타'
    | 'REC-태양광'
    | 'REC-풍력'
    | 'REC-기타'
    | '기타'
    | '';
  unit: 'kWh';
  fileAttachment: File | null;
}

export interface Steam {
  id: number;
  name: string;
  isSelfGenerated: 'O' | 'X' | '';
  boilerName?: string;
  unit: 'kg' | 'ton' | 'MJ' | '';
  temperature: number | string;
  pressure: number | string;
  enthalpy: number | string;
  emissionFactor: number | string;
  fileAttachment: File | null;
}

export type InputValue =
  | string
  | number
  | boolean
  | File
  | null
  | undefined
  | string[];

interface EnergyTabContentProps {
  siteId?: string;
}

const EnergyTabContent: React.FC<EnergyTabContentProps> = ({ siteId }) => {
  const [energySectionCollapsed, setEnergySectionCollapsed] = useState(false);
  const [fuelSectionCollapsed, setFuelSectionCollapsed] = useState(false);
  const [electricitySectionCollapsed, setElectricitySectionCollapsed] =
    useState(false);
  const [steamSectionCollapsed, setSteamSectionCollapsed] = useState(false);

  const [fuels, setFuels] = useState<Fuel[]>([
    {
      id: 1,
      name: '',
      unit: '',
      isBiomass: '',
      biomassPercentage: '',
      fileAttachment: null,
    },
  ]);
  const [selectedFuelId, setSelectedFuelId] = useState<number | null>(
    fuels.length > 0 ? fuels[0].id : null
  );

  const [electricityItems, setElectricityItems] = useState<Electricity[]>([
    { id: 1, type: '', unit: 'kWh', fileAttachment: null },
  ]);
  const [selectedElectricityId, setSelectedElectricityId] = useState<
    number | null
  >(electricityItems.length > 0 ? electricityItems[0].id : null);

  const [steamItems, setSteamItems] = useState<Steam[]>([
    {
      id: 1,
      name: '',
      isSelfGenerated: '',
      unit: '',
      temperature: '',
      pressure: '',
      enthalpy: '',
      emissionFactor: '',
      fileAttachment: null,
    },
  ]);
  const [selectedSteamId, setSelectedSteamId] = useState<number | null>(
    steamItems.length > 0 ? steamItems[0].id : null
  );
  const [fixedSteamUnit, setFixedSteamUnit] = useState<Steam['unit'] | ''>('');
  const isBoilerDataAvailable = true;

  const unitOptionsFuel: Fuel['unit'][] = ['kg', 'L', 'Nm³'];
  const electricityTypeOptions: Electricity['type'][] = [
    '한전 전기',
    'PPA-태양광',
    'PPA-풍력',
    'PPA-기타',
    'REC-태양광',
    'REC-풍력',
    'REC-기타',
    '기타',
  ];
  const steamUnitOptions: Steam['unit'][] = ['kg', 'ton', 'MJ'];
  const boilerOptionsExample = ['보일러 A', '보일러 B', '신규 보일러 123'];

  useEffect(() => {
    if (siteId) {
      console.log(`EnergyTabContent: Loading data for site ID ${siteId}`);
    }
  }, [siteId]);

  const handleAddFuel = () => {
    const newId =
      fuels.length > 0 ? Math.max(...fuels.map((f) => f.id)) + 1 : 1;
    const newFuel: Fuel = {
      id: newId,
      name: '',
      unit: '',
      isBiomass: '',
      biomassPercentage: '',
      fileAttachment: null,
    };
    setFuels([...fuels, newFuel]);
    setSelectedFuelId(newId);
  };

  const handleDeleteFuel = (id: number) => {
    if (fuels.length <= 1) {
      alert('최소 1개 이상의 연료 정보가 필요합니다.');
      return;
    }
    if (window.confirm('선택한 연료를 삭제하시겠습니까?')) {
      const updatedFuels = fuels.filter((f) => f.id !== id);
      setFuels(updatedFuels);
      if (selectedFuelId === id)
        setSelectedFuelId(updatedFuels.length > 0 ? updatedFuels[0].id : null);
    }
  };

  const handleFuelInputChange = (
    id: number,
    field: string,
    value: InputValue
  ) => {
    setFuels((prevFuels) =>
      prevFuels.map((fuel) => {
        if (fuel.id === id) {
          const updatedFuel = {
            ...fuel,
            [field as keyof Fuel]: value as Fuel[keyof Fuel],
          };
          if (field === 'isBiomass' && value === 'X') {
            updatedFuel.biomassPercentage = '';
          }
          return updatedFuel;
        }
        return fuel;
      })
    );
  };

  const handleFuelFileChange = (id: number, file: File | null) => {
    handleFuelInputChange(id, 'fileAttachment', file);
  };

  const handleAddElectricity = () => {
    const newId =
      electricityItems.length > 0
        ? Math.max(...electricityItems.map((e) => e.id)) + 1
        : 1;
    const newElectricityItem: Electricity = {
      id: newId,
      type: '',
      unit: 'kWh',
      fileAttachment: null,
    };
    setElectricityItems([...electricityItems, newElectricityItem]);
    setSelectedElectricityId(newId);
  };

  const handleDeleteElectricity = (id: number) => {
    if (electricityItems.length <= 1) {
      alert('최소 1개 이상의 전력 정보가 필요합니다.');
      return;
    }
    if (window.confirm('선택한 전력 정보를 삭제하시겠습니까?')) {
      const updatedItems = electricityItems.filter((e) => e.id !== id);
      setElectricityItems(updatedItems);
      if (selectedElectricityId === id)
        setSelectedElectricityId(
          updatedItems.length > 0 ? updatedItems[0].id : null
        );
    }
  };

  const handleElectricityInputChange = (
    id: number,
    field: string,
    value: InputValue
  ) => {
    setElectricityItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field as keyof Electricity]:
                value as Electricity[keyof Electricity],
            }
          : item
      )
    );
  };

  const handleElectricityFileChange = (id: number, file: File | null) => {
    handleElectricityInputChange(id, 'fileAttachment', file);
  };

  const handleAddSteam = () => {
    const newId =
      steamItems.length > 0 ? Math.max(...steamItems.map((s) => s.id)) + 1 : 1;
    const newSteamItem: Steam = {
      id: newId,
      name: '',
      isSelfGenerated: '',
      unit: fixedSteamUnit || '',
      temperature: '',
      pressure: '',
      enthalpy: '',
      emissionFactor: '',
      fileAttachment: null,
    };
    setSteamItems([...steamItems, newSteamItem]);
    setSelectedSteamId(newId);
  };

  const handleDeleteSteam = (id: number) => {
    if (steamItems.length <= 1) {
      alert('최소 1개 이상의 스팀 정보가 필요합니다.');
      return;
    }
    if (window.confirm('선택한 스팀 정보를 삭제하시겠습니까?')) {
      const updatedItems = steamItems.filter((s) => s.id !== id);
      setSteamItems(updatedItems);
      if (selectedSteamId === id)
        setSelectedSteamId(updatedItems.length > 0 ? updatedItems[0].id : null);
      if (updatedItems.length === 0) setFixedSteamUnit('');
    }
  };

  const handleSteamInputChange = (
    id: number,
    field: string,
    value: InputValue
  ) => {
    setSteamItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            [field as keyof Steam]: value as Steam[keyof Steam],
          };
          if (field === 'isSelfGenerated') {
            if (value === 'O') {
              if (!updatedItem.boilerName) updatedItem.boilerName = '';
              updatedItem.emissionFactor = '';
            } else if (value === 'X') {
              updatedItem.boilerName = undefined;
            } else {
              updatedItem.boilerName = undefined;
              updatedItem.emissionFactor = '';
            }
          }
          if (field === 'unit') {
            const newUnitSelected = updatedItem.unit;

            if (newUnitSelected) {
              if (fixedSteamUnit !== newUnitSelected) {
                setFixedSteamUnit(newUnitSelected);
              }
            } else {
              if (prevItems.length === 1) {
                if (fixedSteamUnit !== '') {
                  setFixedSteamUnit('');
                }
              }
            }
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  useEffect(() => {
    if (fixedSteamUnit) {
      setSteamItems((prevItems) =>
        prevItems.map((item) =>
          item.unit === fixedSteamUnit
            ? item
            : { ...item, unit: fixedSteamUnit }
        )
      );
    }
  }, [fixedSteamUnit]);

  const handleSteamFileChange = (id: number, file: File | null) => {
    handleSteamInputChange(id, 'fileAttachment', file);
  };

  const handleSaveEnergy = () => {
    console.log('Saving Energy Data:', { fuels, electricityItems, steamItems });
    alert('에너지 정보가 저장되었습니다. (콘솔 확인)');
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-xl font-semibold text-gray-800'>3-2. 에너지</h2>
          <button
            type='button'
            className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
            onClick={() => setEnergySectionCollapsed(!energySectionCollapsed)}
            aria-label={
              energySectionCollapsed ? '에너지 섹션 펼치기' : '에너지 섹션 접기'
            }
          >
            {energySectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
      </div>

      {!energySectionCollapsed && (
        <div className='space-y-8'>
          {/* (1) 연료 섹션 */}
          <div className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>(1) 연료</h3>
              <div className='flex items-center space-x-2'>
                <button
                  type='button'
                  onClick={handleAddFuel}
                  className='px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm flex items-center'
                >
                  <FaPlus className='mr-1' /> 연료 추가
                </button>
                <button
                  type='button'
                  className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                  onClick={() => setFuelSectionCollapsed(!fuelSectionCollapsed)}
                  aria-label={
                    fuelSectionCollapsed ? '연료 섹션 펼치기' : '연료 섹션 접기'
                  }
                >
                  {fuelSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
              </div>
            </div>
            {!fuelSectionCollapsed && (
              <div>
                <div className='lg:hidden space-y-2'>
                  {fuels.map((fuel) => (
                    <FuelMobileForm
                      key={fuel.id}
                      fuel={fuel}
                      unitOptions={unitOptionsFuel}
                      onInputChange={handleFuelInputChange}
                      onFileChange={handleFuelFileChange}
                      onDelete={handleDeleteFuel}
                      isSelected={selectedFuelId === fuel.id}
                      onSelect={setSelectedFuelId}
                    />
                  ))}
                  {fuels.length === 0 && (
                    <p className='text-center text-gray-500 py-2'>
                      연료 정보가 없습니다.
                    </p>
                  )}
                </div>
                <div className='hidden lg:block'>
                  <FuelDeskTopForm
                    fuels={fuels}
                    unitOptions={unitOptionsFuel}
                    onInputChange={handleFuelInputChange}
                    onFileChange={handleFuelFileChange}
                    onDelete={handleDeleteFuel}
                  />
                </div>
              </div>
            )}
          </div>

          {/* (2) 전력 섹션 */}
          <div className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>(2) 전력</h3>
              <div className='flex items-center space-x-2'>
                <button
                  type='button'
                  onClick={handleAddElectricity}
                  className='px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm flex items-center'
                >
                  <FaPlus className='mr-1' /> 전력 추가
                </button>
                <button
                  type='button'
                  className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                  onClick={() =>
                    setElectricitySectionCollapsed(!electricitySectionCollapsed)
                  }
                  aria-label={
                    electricitySectionCollapsed
                      ? '전력 섹션 펼치기'
                      : '전력 섹션 접기'
                  }
                >
                  {electricitySectionCollapsed ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronUp />
                  )}
                </button>
              </div>
            </div>
            {!electricitySectionCollapsed && (
              <div>
                <div className='lg:hidden space-y-2'>
                  {electricityItems.map((item) => (
                    <ElectricityMobileForm
                      key={item.id}
                      item={item}
                      typeOptions={electricityTypeOptions}
                      onInputChange={handleElectricityInputChange}
                      onFileChange={handleElectricityFileChange}
                      onDelete={handleDeleteElectricity}
                      isSelected={selectedElectricityId === item.id}
                      onSelect={setSelectedElectricityId}
                    />
                  ))}
                  {electricityItems.length === 0 && (
                    <p className='text-center text-gray-500 py-2'>
                      전력 정보가 없습니다.
                    </p>
                  )}
                </div>
                <div className='hidden lg:block'>
                  <ElectricityDeskTopForm
                    items={electricityItems}
                    typeOptions={electricityTypeOptions}
                    onInputChange={handleElectricityInputChange}
                    onFileChange={handleElectricityFileChange}
                    onDelete={handleDeleteElectricity}
                  />
                </div>
              </div>
            )}
          </div>

          {/* (3) 스팀 섹션 */}
          <div className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>(3) 스팀</h3>
              <div className='flex items-center space-x-2'>
                <button
                  type='button'
                  onClick={handleAddSteam}
                  className='px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm flex items-center'
                >
                  <FaPlus className='mr-1' /> 스팀 추가
                </button>
                <button
                  type='button'
                  className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                  onClick={() =>
                    setSteamSectionCollapsed(!steamSectionCollapsed)
                  }
                  aria-label={
                    steamSectionCollapsed
                      ? '스팀 섹션 펼치기'
                      : '스팀 섹션 접기'
                  }
                >
                  {steamSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
              </div>
            </div>
            {!steamSectionCollapsed && (
              <div>
                <div className='lg:hidden space-y-2'>
                  {steamItems.map((item) => (
                    <SteamMobileForm
                      key={item.id}
                      item={item}
                      unitOptions={steamUnitOptions}
                      boilerOptions={boilerOptionsExample}
                      fixedUnit={fixedSteamUnit}
                      isBoilerAvailable={isBoilerDataAvailable}
                      onInputChange={handleSteamInputChange}
                      onFileChange={handleSteamFileChange}
                      onDelete={handleDeleteSteam}
                      isSelected={selectedSteamId === item.id}
                      onSelect={setSelectedSteamId}
                    />
                  ))}
                  {steamItems.length === 0 && (
                    <p className='text-center text-gray-500 py-2'>
                      스팀 정보가 없습니다.
                    </p>
                  )}
                </div>
                <div className='hidden lg:block'>
                  <SteamDeskTopForm
                    items={steamItems}
                    unitOptions={steamUnitOptions}
                    boilerOptions={boilerOptionsExample}
                    fixedUnit={fixedSteamUnit}
                    isBoilerAvailable={isBoilerDataAvailable}
                    onInputChange={handleSteamInputChange}
                    onFileChange={handleSteamFileChange}
                    onDelete={handleDeleteSteam}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 하단 전체 저장 버튼 */}
          <div className='flex justify-end mt-8 pt-6 border-t'>
            <button
              type='button'
              onClick={handleSaveEnergy}
              className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            >
              에너지 정보 전체 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyTabContent;
