'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';

// Import form components (will be created in next steps)
import WaterDeskTopForm from './WaterDeskTopForm';
import WaterMobileForm from './WaterMobileForm';
import CompressedAirDeskTopForm from './CompressedAirDeskTopForm';
import CompressedAirMobileForm from './CompressedAirMobileForm';
import RefrigerantDeskTopForm from './RefrigerantDeskTopForm';
import RefrigerantMobileForm from './RefrigerantMobileForm';
import IndustrialGasDeskTopForm from './IndustrialGasDeskTopForm';
import IndustrialGasMobileForm from './IndustrialGasMobileForm';

// --- Interfaces ---
export interface UtilityFileAttachment {
  id: string; // Or use a more specific ID if needed
  file: File;
  name: string;
}

export interface WaterUtility {
  id: number;
  // 구분: "용수" (fixed)
  kind: string; // 종류 (공업용수, 지하수, 상수도, 기타)
  usage: string; // 용도 (공정수, 냉각수, 보일러수, 기타)
  unit: 'kg' | 'm³' | '';
  fileAttachment: File | null;
}

export interface CompressedAirUtility {
  id: number;
  // 구분: "압축공기" (fixed)
  materialName: string; // 물질명
  isSelfGenerated: 'O' | 'X' | ''; // 자체 생산 여부
  // 단위: "Nm³" (fixed)
  fileAttachment: File | null;
}

export interface RefrigerantUtility {
  id: number;
  // 구분: "냉매" (fixed)
  materialName: string; // 물질명
  // 단위: "kg" (fixed)
  casNumber: string;
  fileAttachment: File | null;
}

export interface IndustrialGasUtility {
  id: number;
  // 구분: "산업용가스" (fixed)
  materialName: string; // 물질명
  // 단위: "Nm³" (fixed)
  casNumber: string;
  fileAttachment: File | null;
}

export type UtilityInputValue =
  | string
  | number
  | boolean
  | File
  | null
  | undefined
  | string[];

interface UtilitiesTabContentProps {
  siteId?: string;
}

const UtilitiesTabContent: React.FC<UtilitiesTabContentProps> = ({ siteId }) => {
  const [utilitiesSectionCollapsed, setUtilitiesSectionCollapsed] = useState(false);
  const [waterSectionCollapsed, setWaterSectionCollapsed] = useState(false);
  const [compressedAirSectionCollapsed, setCompressedAirSectionCollapsed] = useState(false);
  const [refrigerantSectionCollapsed, setRefrigerantSectionCollapsed] = useState(false);
  const [industrialGasSectionCollapsed, setIndustrialGasSectionCollapsed] = useState(false);

  // --- Water State ---
  const [waterItems, setWaterItems] = useState<WaterUtility[]>([
    { id: 1, kind: '', usage: '', unit: '', fileAttachment: null },
  ]);
  const [selectedWaterId, setSelectedWaterId] = useState<number | null>(
    waterItems.length > 0 ? waterItems[0].id : null
  );
  const waterUnitOptions: WaterUtility['unit'][] = ['kg', 'm³'];

  // --- Compressed Air State ---
  const [compressedAirItems, setCompressedAirItems] = useState<CompressedAirUtility[]>([
    { id: 1, materialName: '', isSelfGenerated: '', fileAttachment: null },
  ]);
  const [selectedCompressedAirId, setSelectedCompressedAirId] = useState<number | null>(
    compressedAirItems.length > 0 ? compressedAirItems[0].id : null
  );
  // This state determines if "자체 생산 여부" can be enabled.
  // For now, it's a local state. In a real app, this might come from other system data.
  const isAirCompressorSystemAvailable = true; // Set as a constant as the setter is not used


  // --- Refrigerant State ---
  const [refrigerantItems, setRefrigerantItems] = useState<RefrigerantUtility[]>([
    { id: 1, materialName: '', casNumber: '', fileAttachment: null },
  ]);
  const [selectedRefrigerantId, setSelectedRefrigerantId] = useState<number | null>(
    refrigerantItems.length > 0 ? refrigerantItems[0].id : null
  );

  // --- Industrial Gas State ---
  const [industrialGasItems, setIndustrialGasItems] = useState<IndustrialGasUtility[]>([
    { id: 1, materialName: '', casNumber: '', fileAttachment: null },
  ]);
  const [selectedIndustrialGasId, setSelectedIndustrialGasId] = useState<number | null>(
    industrialGasItems.length > 0 ? industrialGasItems[0].id : null
  );
  
  useEffect(() => {
    if (siteId) {
      console.log(`UtilitiesTabContent: Loading data for site ID ${siteId}`);
      // Example: Fetch existing utility data based on siteId
    }
    // Simulate checking for air compressor system availability
    // setIsAirCompressorSystemAvailable(checkSystemConfiguration()); 
  }, [siteId]);

  // --- Generic Handlers ---
  const createAddItemHandler = <T extends { id: number }>(
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>,
    defaultItem: Omit<T, 'id'>
  ) => () => {
    setItems(prevItems => {
      const newId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) + 1 : 1;
      const newItem = { ...defaultItem, id: newId } as T;
      setSelectedId(newId);
      return [...prevItems, newItem];
    });
  };

  const createDeleteItemHandler = <T extends { id: number }>(
    items: T[],
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    selectedId: number | null,
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>,
    itemName: string
  ) => (id: number) => {
    if (items.length <= 1) {
      alert(`최소 1개 이상의 ${itemName} 정보가 필요합니다.`);
      return;
    }
    if (window.confirm(`선택한 ${itemName}을(를) 삭제하시겠습니까?`)) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      if (selectedId === id) {
        setSelectedId(updatedItems.length > 0 ? updatedItems[0].id : null);
      }
    }
  };

  const createInputChangeHandler = <T extends { id: number }>(
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    itemType?: 'compressedAir' // To handle specific logic like conditional disabling
  ) => (id: number, field: string, value: UtilityInputValue) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Specific logic for compressed air self-generation based on system availability
          if (itemType === 'compressedAir' && field === 'isSelfGenerated' && !isAirCompressorSystemAvailable) {
             // Potentially prevent change or reset if system not available, though UI disable is primary
          }
          return updatedItem;
        }
        return item;
      })
    );
  };
  
 const createFileChangeHandler = <T extends { id: number }>(
    setItems: React.Dispatch<React.SetStateAction<T[]>>
  ) => (id: number, file: File | null) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, fileAttachment: file } : item
      )
    );
  };

  // --- Water Handlers ---
  const defaultWaterItem: Omit<WaterUtility, 'id'> = { kind: '', usage: '', unit: '', fileAttachment: null };
  const handleAddWater = createAddItemHandler(setWaterItems, setSelectedWaterId, defaultWaterItem);
  const handleDeleteWater = createDeleteItemHandler(waterItems, setWaterItems, selectedWaterId, setSelectedWaterId, '용수');
  const handleWaterInputChange = createInputChangeHandler(setWaterItems);
  const handleWaterFileChange = createFileChangeHandler(setWaterItems);

  // --- Compressed Air Handlers ---
  const defaultCompressedAirItem: Omit<CompressedAirUtility, 'id'> = { materialName: '', isSelfGenerated: '', fileAttachment: null };
  const handleAddCompressedAir = createAddItemHandler(setCompressedAirItems, setSelectedCompressedAirId, defaultCompressedAirItem);
  const handleDeleteCompressedAir = createDeleteItemHandler(compressedAirItems, setCompressedAirItems, selectedCompressedAirId, setSelectedCompressedAirId, '압축공기');
  const handleCompressedAirInputChange = createInputChangeHandler(setCompressedAirItems, 'compressedAir');
  const handleCompressedAirFileChange = createFileChangeHandler(setCompressedAirItems);

  // --- Refrigerant Handlers ---
  const defaultRefrigerantItem: Omit<RefrigerantUtility, 'id'> = { materialName: '', casNumber: '', fileAttachment: null };
  const handleAddRefrigerant = createAddItemHandler(setRefrigerantItems, setSelectedRefrigerantId, defaultRefrigerantItem);
  const handleDeleteRefrigerant = createDeleteItemHandler(refrigerantItems, setRefrigerantItems, selectedRefrigerantId, setSelectedRefrigerantId, '냉매');
  const handleRefrigerantInputChange = createInputChangeHandler(setRefrigerantItems);
  const handleRefrigerantFileChange = createFileChangeHandler(setRefrigerantItems);
  
  // --- Industrial Gas Handlers ---
  const defaultIndustrialGasItem: Omit<IndustrialGasUtility, 'id'> = { materialName: '', casNumber: '', fileAttachment: null };
  const handleAddIndustrialGas = createAddItemHandler(setIndustrialGasItems, setSelectedIndustrialGasId, defaultIndustrialGasItem);
  const handleDeleteIndustrialGas = createDeleteItemHandler(industrialGasItems, setIndustrialGasItems, selectedIndustrialGasId, setSelectedIndustrialGasId, '산업용 가스');
  const handleIndustrialGasInputChange = createInputChangeHandler(setIndustrialGasItems);
  const handleIndustrialGasFileChange = createFileChangeHandler(setIndustrialGasItems);

  const handleSaveUtilities = () => {
    // Basic validation example
    if (waterItems.some(item => !item.kind || !item.usage || !item.unit)) {
        alert('용수 정보를 모두 입력해주세요.');
        return;
    }
    if (compressedAirItems.some(item => !item.materialName || (isAirCompressorSystemAvailable && !item.isSelfGenerated) )) {
        alert('압축공기 정보를 모두 입력해주세요.');
        return;
    }
     if (refrigerantItems.some(item => !item.materialName )) { // CAS No. might be optional based on context
        alert('냉매 정보를 모두 입력해주세요.');
        return;
    }
    if (industrialGasItems.some(item => !item.materialName )) { // CAS No. might be optional
        alert('산업용 가스 정보를 모두 입력해주세요.');
        return;
    }

    console.log('Saving Utilities Data:', {
      waterItems,
      compressedAirItems,
      refrigerantItems,
      industrialGasItems,
    });
    alert('유틸리티 정보가 저장되었습니다. (콘솔 확인)');
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-xl font-semibold text-gray-800'>3-3. 유틸리티</h2>
          <button
            type='button'
            className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
            onClick={() => setUtilitiesSectionCollapsed(!utilitiesSectionCollapsed)}
            aria-label={utilitiesSectionCollapsed ? '유틸리티 섹션 펼치기' : '유틸리티 섹션 접기'}
          >
            {utilitiesSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
      </div>

      {!utilitiesSectionCollapsed && (
        <div className='space-y-8'>
          {/* (1) 용수 섹션 */}
          <div className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>(1) 용수</h3>
              <div className='flex items-center space-x-2'>
                <button
                  type='button'
                  onClick={handleAddWater}
                  className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center'
                >
                  <FaPlus className='mr-1' /> 용수 추가
                </button>
                <button
                  type='button'
                  className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                  onClick={() => setWaterSectionCollapsed(!waterSectionCollapsed)}
                  aria-label={waterSectionCollapsed ? '용수 섹션 펼치기' : '용수 섹션 접기'}
                >
                  {waterSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
              </div>
            </div>
            {!waterSectionCollapsed && (
              <div>
                <div className='lg:hidden space-y-2'>
                  {waterItems.map(item => (
                    <WaterMobileForm
                      key={item.id}
                      item={item}
                      unitOptions={waterUnitOptions}
                      onInputChange={handleWaterInputChange}
                      onFileChange={handleWaterFileChange}
                      onDelete={handleDeleteWater}
                      isSelected={selectedWaterId === item.id}
                      onSelect={setSelectedWaterId}
                    />
                  ))}
                  {waterItems.length === 0 && <p className="text-center text-gray-500 py-2">정보 없음</p>}
                </div>
                <div className='hidden lg:block'>
                  <WaterDeskTopForm
                    items={waterItems}
                    unitOptions={waterUnitOptions}
                    onInputChange={handleWaterInputChange}
                    onFileChange={handleWaterFileChange}
                    onDelete={handleDeleteWater}
                  />
                </div>
              </div>
            )}
          </div>

          {/* (2) 압축공기 섹션 */}
          <div className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>(2) 압축공기</h3>
              <div className='flex items-center space-x-2'>
                <button
                  type='button'
                  onClick={handleAddCompressedAir}
                  className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center'
                >
                  <FaPlus className='mr-1' /> 압축공기 추가
                </button>
                <button
                  type='button'
                  className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                  onClick={() => setCompressedAirSectionCollapsed(!compressedAirSectionCollapsed)}
                  aria-label={compressedAirSectionCollapsed ? '압축공기 섹션 펼치기' : '압축공기 섹션 접기'}
                >
                  {compressedAirSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
              </div>
            </div>
            {!compressedAirSectionCollapsed && (
              <div>
                <div className='lg:hidden space-y-2'>
                  {compressedAirItems.map(item => (
                    <CompressedAirMobileForm
                      key={item.id}
                      item={item}
                      isAirCompressorSystemAvailable={isAirCompressorSystemAvailable}
                      onInputChange={handleCompressedAirInputChange}
                      onFileChange={handleCompressedAirFileChange}
                      onDelete={handleDeleteCompressedAir}
                      isSelected={selectedCompressedAirId === item.id}
                      onSelect={setSelectedCompressedAirId}
                    />
                  ))}
                   {compressedAirItems.length === 0 && <p className="text-center text-gray-500 py-2">정보 없음</p>}
                </div>
                <div className='hidden lg:block'>
                  <CompressedAirDeskTopForm
                    items={compressedAirItems}
                    isAirCompressorSystemAvailable={isAirCompressorSystemAvailable}
                    onInputChange={handleCompressedAirInputChange}
                    onFileChange={handleCompressedAirFileChange}
                    onDelete={handleDeleteCompressedAir}
                  />
                </div>
              </div>
            )}
          </div>

          {/* (3) 냉매 섹션 */}
          <div className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>(3) 냉매</h3>
              <div className='flex items-center space-x-2'>
                <button
                  type='button'
                  onClick={handleAddRefrigerant}
                  className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center'
                >
                  <FaPlus className='mr-1' /> 냉매 추가
                </button>
                <button
                  type='button'
                  className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                  onClick={() => setRefrigerantSectionCollapsed(!refrigerantSectionCollapsed)}
                  aria-label={refrigerantSectionCollapsed ? '냉매 섹션 펼치기' : '냉매 섹션 접기'}
                >
                  {refrigerantSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
              </div>
            </div>
            {!refrigerantSectionCollapsed && (
              <div>
                <div className='lg:hidden space-y-2'>
                  {refrigerantItems.map(item => (
                    <RefrigerantMobileForm
                      key={item.id}
                      item={item}
                      onInputChange={handleRefrigerantInputChange}
                      onFileChange={handleRefrigerantFileChange}
                      onDelete={handleDeleteRefrigerant}
                      isSelected={selectedRefrigerantId === item.id}
                      onSelect={setSelectedRefrigerantId}
                    />
                  ))}
                  {refrigerantItems.length === 0 && <p className="text-center text-gray-500 py-2">정보 없음</p>}
                </div>
                <div className='hidden lg:block'>
                  <RefrigerantDeskTopForm
                    items={refrigerantItems}
                    onInputChange={handleRefrigerantInputChange}
                    onFileChange={handleRefrigerantFileChange}
                    onDelete={handleDeleteRefrigerant}
                  />
                </div>
              </div>
            )}
          </div>

          {/* (4) 산업용 가스 섹션 */}
          <div className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-700'>(4) 산업용 가스</h3>
              <div className='flex items-center space-x-2'>
                <button
                  type='button'
                  onClick={handleAddIndustrialGas}
                  className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center'
                >
                  <FaPlus className='mr-1' /> 산업용 가스 추가
                </button>
                <button
                  type='button'
                  className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                  onClick={() => setIndustrialGasSectionCollapsed(!industrialGasSectionCollapsed)}
                  aria-label={industrialGasSectionCollapsed ? '산업용 가스 섹션 펼치기' : '산업용 가스 섹션 접기'}
                >
                  {industrialGasSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
              </div>
            </div>
            {!industrialGasSectionCollapsed && (
              <div>
                <div className='lg:hidden space-y-2'>
                  {industrialGasItems.map(item => (
                    <IndustrialGasMobileForm
                      key={item.id}
                      item={item}
                      onInputChange={handleIndustrialGasInputChange}
                      onFileChange={handleIndustrialGasFileChange}
                      onDelete={handleDeleteIndustrialGas}
                      isSelected={selectedIndustrialGasId === item.id}
                      onSelect={setSelectedIndustrialGasId}
                    />
                  ))}
                  {industrialGasItems.length === 0 && <p className="text-center text-gray-500 py-2">정보 없음</p>}
                </div>
                <div className='hidden lg:block'>
                  <IndustrialGasDeskTopForm
                    items={industrialGasItems}
                    onInputChange={handleIndustrialGasInputChange}
                    onFileChange={handleIndustrialGasFileChange}
                    onDelete={handleDeleteIndustrialGas}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* 하단 전체 저장 버튼 */}
          <div className='flex justify-end mt-8 pt-6 border-t'>
            <button
              type='button'
              onClick={handleSaveUtilities}
              className='px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
            >
              유틸리티 정보 전체 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilitiesTabContent; 