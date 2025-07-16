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
import { ProductGroupItem } from '../product-groups/ProductGroupSection'; // From 5-2
// Assuming SubProcessItem and ProcessItem interfaces are available or defined here/imported
// For now, let's define simplified versions or assume they are passed via props.

// Simplified interface for a process that can have sub-processes
// This should align with your actual data structure from 4-1 and 4-2
export interface ProcessWithSubProcesses {
  id: string; // Process ID from 4-1
  processName: string; // Process Name from 4-1
  processClassification: '제조' | '유틸리티' | '환경오염물질 처리' | ''; // From 4-1
  subProcesses: SubProcessInfo[]; // Sub-processes from 4-2 linked to this process
}

export interface SubProcessInfo {
  id: string; // Sub-process ID
  name: string; // Sub-process name
  // Potentially other details like description, order within the main process, etc.
}

// Interface for the mapping data itself
export interface ProductProcessMap {
  mappableItemId: string; // Product ID or Product Group ID
  mappableItemType: 'product' | 'productGroup';
  subProcessOrders: { subProcessId: string; order: number }[]; // Key: subProcessId, Value: order number
}

interface ProductProcessMappingSectionProps {
  allProducts: ProductItem[]; // From 5-1
  allProductGroups: ProductGroupItem[]; // From 5-2 (only those where useProductGroups is true)
  allProcessesWithSubProcesses: ProcessWithSubProcesses[]; // From 4-1 and 4-2, filtered for '제조공정' and with their sub-processes
  // siteId?: string;
}

const ProductProcessMappingSection: React.FC<
  ProductProcessMappingSectionProps
> = ({ allProducts, allProductGroups, allProcessesWithSubProcesses }) => {
  const [sectionCollapsed, setSectionCollapsed] = useState(true);
  const [selectedMainProcessId, setSelectedMainProcessId] = useState<
    string | ''
  >('');
  const [productProcessMaps, setProductProcessMaps] = useState<
    ProductProcessMap[]
  >([]);

  const guidanceText =
    '선택한 제조 공정에 대해 제품 또는 제품군별로 거치는 세부 공정의 순서를 지정합니다. 셀을 클릭하여 순번을 매기세요.';

  // Filter processes to only include '제조' type for the dropdown
  const manufacturingProcesses = allProcessesWithSubProcesses.filter(
    (p) => p.processClassification === '제조',
  );

  const selectedProcessDetails = manufacturingProcesses.find(
    (p) => p.id === selectedMainProcessId,
  );
  const currentSubProcesses = selectedProcessDetails?.subProcesses || [];

  // Combine products and product groups into a single list for mapping
  const mappableItems: {
    id: string;
    name: string;
    type: 'product' | 'productGroup';
    associatedMainProcess?: string;
  }[] = [
    ...allProducts.map((p) => ({
      id: p.id.toString(),
      name: p.productName,
      type: 'product' as const,
      associatedMainProcess: p.processName,
    })),
    ...allProductGroups.map((pg) => ({
      id: pg.id,
      name: pg.groupName,
      type: 'productGroup' as const,
      associatedMainProcess: pg.processName,
    })),
  ].filter((item) =>
    selectedProcessDetails
      ? item.associatedMainProcess === selectedProcessDetails.processName
      : false,
  );
  // Further filter: Only show items whose associated main process (from 5-1 or 5-2)
  // matches the currently selected main process in 5-3.

  useEffect(() => {
    // Reset maps if selected process changes, or initialize if needed
    // This is a simplified reset; you might want to persist/load maps based on selectedMainProcessId
    setProductProcessMaps([]);
  }, [selectedMainProcessId]);

  const handleSubProcessOrderChange = (
    mappableItemId: string,
    mappableItemType: 'product' | 'productGroup',
    subProcessId: string,
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
          subProcessOrders: [...prevMaps[mapIndex].subProcessOrders],
        };
      } else {
        currentMap = { mappableItemId, mappableItemType, subProcessOrders: [] };
      }

      const existingOrderIndex = currentMap.subProcessOrders.findIndex(
        (spo) => spo.subProcessId === subProcessId,
      );

      if (existingOrderIndex > -1) {
        // Already exists, remove it (deselect)
        currentMap.subProcessOrders.splice(existingOrderIndex, 1);
        // Re-order remaining items
        currentMap.subProcessOrders.sort((a, b) => a.order - b.order);
        currentMap.subProcessOrders.forEach(
          (spo, index) => (spo.order = index + 1),
        );
      } else {
        // New selection, add it with the next order number
        const maxOrder = currentMap.subProcessOrders.reduce(
          (max, spo) => Math.max(max, spo.order),
          0,
        );
        currentMap.subProcessOrders.push({ subProcessId, order: maxOrder + 1 });
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
    mappableItemType: 'product' | 'productGroup',
    subProcessId: string,
  ): number | undefined => {
    const map = productProcessMaps.find(
      (m) =>
        m.mappableItemId === mappableItemId &&
        m.mappableItemType === mappableItemType,
    );
    return map?.subProcessOrders.find(
      (spo) => spo.subProcessId === subProcessId,
    )?.order;
  };

  const handleSaveProductProcessMapping = () => {
    const saveData = {
      selectedProcess:
        selectedProcessDetails?.processName || '선택된 공정 없음',
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
                  {proc.processName}
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
                    mappableItems.length === 0 ||
                    currentSubProcesses.length === 0
                  }
                >
                  <FaSave className="mr-1" /> 제품공정 저장
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block">
                <ProductProcessMappingDeskTopTable
                  mappableItems={mappableItems}
                  subProcesses={currentSubProcesses}
                  onSubProcessOrderChange={handleSubProcessOrderChange}
                  getOrderForSubProcess={getOrderForSubProcess}
                />
              </div>
              {/* Mobile View */}
              <div className="lg:hidden">
                <ProductProcessMappingMobileView
                  mappableItems={mappableItems}
                  subProcesses={currentSubProcesses}
                  onSubProcessOrderChange={handleSubProcessOrderChange}
                  getOrderForSubProcess={getOrderForSubProcess}
                />
              </div>
              {mappableItems.length === 0 && currentSubProcesses.length > 0 && (
                <p className="px-2 py-4 text-center text-sm text-gray-500">
                  선택된 제조 공정에 연결된 제품 또는 제품군이 없습니다. (5-1
                  제품목록 또는 5-2 제품군에서 해당 공정을 선택해야합니다)
                </p>
              )}
              {currentSubProcesses.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-gray-500">
                  선택된 제조 공정에 등록된 세부 공정이 없습니다. (4-2
                  세부공정에서 추가 필요)
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
