'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';

import WasteGasDeskTopForm from './WasteGasDeskTopForm';
import WasteGasMobileForm from './WasteGasMobileForm';

// --- Interfaces ---
export interface WasteGas {
  id: number;
  name: string; // (1) 폐가스명
  unit: 'ton' | 'm³' | ''; // (2) 단위
  density: number | string; // (3) 밀도 (ton/m³)
  netCalorificValue: number | string; // (4) 순발열량 (TJ/ton)
  emissionFactor: number | string; // (5) 배출계수 (kgCO₂/ton)
  fileAttachment: File | null; // (6) 파일첨부
}

export type WasteGasInputValue =
  | string
  | number
  | File
  | null
  | undefined;

interface WasteGasTabContentProps {
  siteId?: string;
}

const WasteGasTabContent: React.FC<WasteGasTabContentProps> = ({ siteId }) => {
  const [wasteGasSectionCollapsed, setWasteGasSectionCollapsed] = useState(false);
  
  const [wasteGasItems, setWasteGasItems] = useState<WasteGas[]>([
    {
      id: 1,
      name: '',
      unit: '',
      density: '',
      netCalorificValue: '',
      emissionFactor: '',
      fileAttachment: null,
    },
  ]);
  const [selectedWasteGasId, setSelectedWasteGasId] = useState<number | null>(
    wasteGasItems.length > 0 ? wasteGasItems[0].id : null
  );

  const unitOptionsWasteGas: WasteGas['unit'][] = ['ton', 'm³'];

  useEffect(() => {
    if (siteId) {
      console.log(`WasteGasTabContent: Loading data for site ID ${siteId}`);
      // Placeholder for data fetching logic
    }
  }, [siteId]);

  const handleAddWasteGas = () => {
    setWasteGasItems(prevItems => {
      const newId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) + 1 : 1;
      const newItem: WasteGas = {
        id: newId,
        name: '',
        unit: '',
        density: '',
        netCalorificValue: '',
        emissionFactor: '',
        fileAttachment: null,
      };
      setSelectedWasteGasId(newId);
      return [...prevItems, newItem];
    });
  };

  const handleDeleteWasteGas = (id: number) => {
    if (wasteGasItems.length <= 1) {
      alert('최소 1개 이상의 폐가스 정보가 필요합니다.');
      return;
    }
    if (window.confirm('선택한 폐가스를 삭제하시겠습니까?')) {
      const updatedItems = wasteGasItems.filter(item => item.id !== id);
      setWasteGasItems(updatedItems);
      if (selectedWasteGasId === id) {
        setSelectedWasteGasId(updatedItems.length > 0 ? updatedItems[0].id : null);
      }
    }
  };

  const handleWasteGasInputChange = (id: number, field: keyof WasteGas, value: WasteGasInputValue) => {
    setWasteGasItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const handleWasteGasFileChange = (id: number, file: File | null) => {
    setWasteGasItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, fileAttachment: file } : item
      )
    );
  };

  const handleSaveWasteGas = () => {
    // Basic validation example
    if (wasteGasItems.some(item => !item.name || !item.unit)) { // Add more checks as needed
        alert('폐가스명과 단위를 모두 입력해주세요.');
        return;
    }
    console.log('Saving Waste Gas Data:', { wasteGasItems });
    alert('폐가스 정보가 저장되었습니다. (콘솔 확인)');
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-xl font-semibold text-gray-800'>3-4. 폐가스</h2>
          <button
            type='button'
            className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
            onClick={() => setWasteGasSectionCollapsed(!wasteGasSectionCollapsed)}
            aria-label={wasteGasSectionCollapsed ? '폐가스 섹션 펼치기' : '폐가스 섹션 접기'}
          >
            {wasteGasSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
      </div>

      {!wasteGasSectionCollapsed && (
        <div className='space-y-8'>
          <div className='border rounded-md p-4'>
            <div className='flex justify-end items-center mb-4'> {/* Toolbar-like area */}
                <button
                  type='button'
                  onClick={handleAddWasteGas}
                  className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center'
                >
                  <FaPlus className='mr-1' /> 폐가스 추가
                </button>
            </div>
            <div>
              <div className='lg:hidden space-y-2'>
                {wasteGasItems.map(item => (
                  <WasteGasMobileForm
                    key={item.id}
                    item={item}
                    unitOptions={unitOptionsWasteGas}
                    onInputChange={handleWasteGasInputChange}
                    onFileChange={handleWasteGasFileChange}
                    onDelete={handleDeleteWasteGas}
                    isSelected={selectedWasteGasId === item.id}
                    onSelect={setSelectedWasteGasId}
                  />
                ))}
                {wasteGasItems.length === 0 && <p className="text-center text-gray-500 py-2">정보 없음</p>}
              </div>
              <div className='hidden lg:block'>
                <WasteGasDeskTopForm
                  items={wasteGasItems}
                  unitOptions={unitOptionsWasteGas}
                  onInputChange={handleWasteGasInputChange}
                  onFileChange={handleWasteGasFileChange}
                  onDelete={handleDeleteWasteGas}
                />
              </div>
            </div>
          </div>
          
          {/* 하단 전체 저장 버튼 */}
          <div className='flex justify-end mt-8 pt-6 border-t'>
            <button
              type='button'
              onClick={handleSaveWasteGas}
              className='px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50' // Changed color for distinction
            >
              폐가스 정보 전체 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteGasTabContent; 