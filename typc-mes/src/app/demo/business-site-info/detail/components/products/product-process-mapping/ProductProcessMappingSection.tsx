'use client';

import React, { useState, useEffect } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaSave,
} from 'react-icons/fa';
import Tooltip from '../../common/Tooltip';
import ProductProcessMappingDeskTopTable from './ProductProcessMappingDeskTopTable';
import ProductProcessMappingMobileView from './ProductProcessMappingMobileView';
import { ProductItem } from '../ProductTabcontent'; // From 5-1
// Assuming SubProcessItem and ProcessItem interfaces are available or defined here/imported
// For now, let's define simplified versions or assume they are passed via props.

// Simplified interface for a process that can have unit processes
// This should align with the ProcessInfo structure from ProductTabContent
export interface ProcessWithUnitProcesses {
  id: string; // Process ID
  name: string; // Process Name
  classification: '제조' | '유틸리티설비' | '환경오염물처리시설';
  unitProcessNames: string[]; // Unit processes from the updated structure
}

export interface UnitProcessInfo {
  id: string; // Unit process ID (generated from index + process id)
  name: string; // Unit process name
  processId: string; // Parent process ID
}

// Interface for the mapping data itself
export interface ProductProcessMap {
  mappableItemId: string; // Product ID
  mappableItemType: 'product';
  unitProcessOrders: { unitProcessId: string; order: number }[]; // Key: unitProcessId, Value: order number
}

interface ProductProcessMappingSectionProps {
  allProducts: ProductItem[]; // From 5-1
  allProcesses: ProcessWithUnitProcesses[]; // From ProductTabContent DUMMY_PROCESS_LIST_WITH_UNIT
  // siteId?: string;
}

const ProductProcessMappingSection: React.FC<
  ProductProcessMappingSectionProps
> = ({ allProducts, allProcesses }) => {
  const [sectionCollapsed, setSectionCollapsed] = useState(true);
  const [selectedMainProcessId, setSelectedMainProcessId] = useState<
    string | ''
  >('');
  const [productProcessMaps, setProductProcessMaps] = useState<
    ProductProcessMap[]
  >([]);

  const guidanceText =
    '선택한 제조 공정에 대해 제품별로 거치는 단위 공정의 순서를 지정합니다. 셀을 클릭하여 순번을 매기세요.';

  // Filter processes to only include '제조' type for the dropdown
  const manufacturingProcesses = allProcesses.filter(
    (p) => p.classification === '제조',
  );

  const selectedProcessDetails = manufacturingProcesses.find(
    (p) => p.id === selectedMainProcessId,
  );

  // Only include products for mapping (removed product groups)
  const mappableItems: {
    id: string;
    name: string;
    type: 'product';
    associatedMainProcess?: string;
  }[] = allProducts.map((p) => ({
    id: p.id.toString(),
    name: p.productName,
    type: 'product' as const,
    associatedMainProcess: p.processName,
  })).filter((item) =>
    selectedProcessDetails
      ? item.associatedMainProcess === selectedProcessDetails.name
      : false,
  );
  // Filter: Only show products whose associated main process (from 5-1)
  // matches the currently selected main process in 5-3.

  // Convert unitProcessNames array to UnitProcessInfo objects for compatibility
  const currentUnitProcesses: UnitProcessInfo[] = selectedProcessDetails 
    ? selectedProcessDetails.unitProcessNames.map((name, index) => ({
        id: `${selectedProcessDetails.id}_unit_${index}`,
        name: name,
        processId: selectedProcessDetails.id,
      }))
    : [];

  useEffect(() => {
    // Reset maps if selected process changes, or initialize if needed
    // This is a simplified reset; you might want to persist/load maps based on selectedMainProcessId
    setProductProcessMaps([]);
  }, [selectedMainProcessId]);

  const handleSubProcessOrderChange = (
    mappableItemId: string,
    mappableItemType: 'product',
    unitProcessId: string,
  ) => {
    setProductProcessMaps((prevMaps) => {
      const mapIndex = prevMaps.findIndex(
        (m) =>
          m.mappableItemId === mappableItemId &&
          m.mappableItemType === mappableItemType,
      );

      let currentMap: ProductProcessMap;
      if (mapIndex > -1) {
        currentMap = {
          ...prevMaps[mapIndex],
          unitProcessOrders: [...prevMaps[mapIndex].unitProcessOrders],
        };
      } else {
        currentMap = { mappableItemId, mappableItemType, unitProcessOrders: [] };
      }

      const existingOrderIndex = currentMap.unitProcessOrders.findIndex(
        (spo) => spo.unitProcessId === unitProcessId,
      );

      if (existingOrderIndex > -1) {
        // Already exists, remove it (deselect)
        currentMap.unitProcessOrders.splice(existingOrderIndex, 1);
        // Re-order remaining items
        currentMap.unitProcessOrders.sort((a, b) => a.order - b.order);
        currentMap.unitProcessOrders.forEach(
          (spo, index) => (spo.order = index + 1),
        );
      } else {
        // New selection, add it with the next order number
        const maxOrder = currentMap.unitProcessOrders.reduce(
          (max, spo) => Math.max(max, spo.order),
          0,
        );
        currentMap.unitProcessOrders.push({ unitProcessId, order: maxOrder + 1 });
      }

      if (mapIndex > -1) {
        const newMaps = [...prevMaps];
        newMaps[mapIndex] = currentMap;
        return newMaps;
      } else {
        return [...prevMaps, currentMap];
      }
    });
  };

  const getOrderForSubProcess = (
    mappableItemId: string,
    mappableItemType: 'product',
    unitProcessId: string,
  ): number | undefined => {
    const map = productProcessMaps.find(
      (m) =>
        m.mappableItemId === mappableItemId &&
        m.mappableItemType === mappableItemType,
    );
    return map?.unitProcessOrders.find(
      (spo) => spo.unitProcessId === unitProcessId,
    )?.order;
  };

  const handleSaveProductProcessMapping = () => {
    const saveData = {
      selectedProcess:
        selectedProcessDetails?.name || '선택된 공정 없음',
      mappingData: productProcessMaps,
    };

    console.log('제품공정 저장 정보:', saveData);
    // 여기에 실제 저장 로직 추가 (API 호출 등)
    alert('제품공정 정보가 저장되었습니다.');
  };

  return (
    <div className="mt-12 rounded-lg bg-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-800">5-3. 제품공정</h2>
          <Tooltip text={guidanceText} position="right">
            <FaInfoCircle className="cursor-pointer text-gray-400 hover:text-gray-600" />
          </Tooltip>
          <button
            type="button"
            onClick={() => setSectionCollapsed(!sectionCollapsed)}
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {sectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
      </div>

      {!sectionCollapsed && (
        <div className="space-y-4">
          <div className="rounded-md bg-gray-50 p-4">
            <label
              htmlFor="mainProcessSelect"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              공정명 선택 (공정 구분이 &apos;제조 공정&apos;인 공정)
            </label>
            <select
              id="mainProcessSelect"
              value={selectedMainProcessId}
              onChange={(e) => setSelectedMainProcessId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm lg:w-1/3"
            >
              <option value="">공정을 선택하세요</option>
              {manufacturingProcesses.map((proc) => (
                <option key={proc.id} value={proc.id}>
                  {proc.name}
                </option>
              ))}
            </select>
          </div>

          {selectedMainProcessId && selectedProcessDetails && (
            <div className="overflow-hidden rounded-md border p-0">
              <div className="flex items-center justify-end border-b bg-gray-50 p-3">
                <button
                  type="button"
                  onClick={handleSaveProductProcessMapping}
                  className="flex items-center rounded-md bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600"
                  disabled={
                    mappableItems.length === 0
                  }
                >
                  <FaSave className="mr-1" /> 제품공정 저장
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block">
                <ProductProcessMappingDeskTopTable
                  mappableItems={mappableItems}
                  subProcesses={currentUnitProcesses}
                  onSubProcessOrderChange={handleSubProcessOrderChange}
                  getOrderForSubProcess={getOrderForSubProcess}
                />
              </div>
              {/* Mobile View */}
              <div className="flex w-full flex-col lg:hidden">
                <ProductProcessMappingMobileView
                  mappableItems={mappableItems}
                  subProcesses={currentUnitProcesses}
                  onSubProcessOrderChange={handleSubProcessOrderChange}
                  getOrderForSubProcess={getOrderForSubProcess}
                />
              </div>
              {mappableItems.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-gray-500">
                  선택된 제조 공정에 연결된 제품이 없습니다. (5-1 제품목록에서 해당 공정을 선택해야합니다)
                </p>
              )}
            </div>
          )}
          {!selectedMainProcessId && (
            <p className="py-4 text-center text-gray-500">
              먼저 공정명을 선택해주세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductProcessMappingSection;
