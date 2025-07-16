'use client';

import React, { useState, useEffect } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaInfoCircle,
  FaSave,
} from 'react-icons/fa';
import Tooltip from '../../common/Tooltip';
import ProductGroupDeskTopForm from './ProductGroupDeskTopForm';
import ProductGroupMobileForm from './ProductGroupMobileForm';
import ProductSelectorModal from './ProductSelectorModal';
import { ProductItem } from '../ProductTabcontent'; // From 5-1

// Interfaces for 5-2. 제품군
export interface ProductGroupItem {
  id: string; // Unique ID for the group (e.g., UUID)
  groupName: string; // (1) 제품군명
  processName: string; // (2) 공정명 (Selected from 4-1 process list)
  unitProcessName?: string; // (3) 단위공정명 (Auto-filled)
  productIds: string[]; // (4) 제품 ID 목록 (Selected from 5-1 products, matching the processName)
  // productNames?: string[]; // Optionally store names for display, though IDs are primary
}

export type ProductGroupInputValue = string | string[] | number | null | undefined;

interface ProcessInfoForGroup {
    id: string;
    name: string;
    unitProcessName?: string; // Make sure this matches how DUMMY_PROCESS_LIST_WITH_UNIT is structured
}

interface ProductGroupSectionProps {
  productItems: ProductItem[]; // From 5-1, for product selection modal
  processList: ProcessInfoForGroup[]; // From 4-1, for 공정명 dropdown
  // Props for lifted state
  productGroupItemsState: ProductGroupItem[];
  onProductGroupItemsChange: React.Dispatch<React.SetStateAction<ProductGroupItem[]>>;
  useProductGroupsState: boolean;
  onUseProductGroupsChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductGroupSection: React.FC<ProductGroupSectionProps> = ({
  productItems,
  processList,
  productGroupItemsState,
  onProductGroupItemsChange,
  useProductGroupsState,
  onUseProductGroupsChange,
}) => {
  const [sectionCollapsed, setSectionCollapsed] = useState(false);
  const [hasSavedProductGroups, setHasSavedProductGroups] = useState(false);
  
  const [showProductSelectorModal, setShowProductSelectorModal] = useState(false);
  const [currentEditingGroupId, setCurrentEditingGroupId] = useState<string | null>(null);
  const [modalSelectedProductIds, setModalSelectedProductIds] = useState<string[]>([]);
  const [productSelectorSearchTerm, setProductSelectorSearchTerm] = useState('');
  const [selectedProcessForModalFilter, setSelectedProcessForModalFilter] = useState<string | null>(null);

  // Mobile view selected card
  const [selectedProductGroupIdMobile, setSelectedProductGroupIdMobile] = useState<string | null>(null);

  const guidanceText = "유사한 제품들을 그룹화하여 관리하고, 해당 제품군이 어떤 공정에서 생산되는지 연결합니다. \n'예'를 선택하면 제품군을 추가하고 편집할 수 있습니다.";

  useEffect(() => {
    // Initialize with one empty group if '예' is selected and no groups exist
    if (useProductGroupsState && productGroupItemsState.length === 0) {
      // handleAddProductGroup(); // Consider if auto-add is desired
    }
    if (!useProductGroupsState) {
      // onProductGroupItemsChange([]); // Clear items if not used - check if this is desired behavior
    }
  }, [useProductGroupsState, productGroupItemsState.length, onProductGroupItemsChange]);

  const handleAddProductGroup = () => {
    onProductGroupItemsChange(prev => [
      ...prev,
      {
        id: Date.now().toString(), // Simple unique ID
        groupName: '',
        processName: '',
        productIds: [],
      },
    ]);
  };

  const handleDeleteProductGroup = (id: string) => {
    if (productGroupItemsState.length === 1 && !window.confirm("마지막 제품군입니다. 삭제하시겠습니까?")) return;
    onProductGroupItemsChange(prev => prev.filter(group => group.id !== id));
  };

  const handleGroupInputChange = (
    id: string,
    field: keyof ProductGroupItem,
    value: ProductGroupInputValue
  ) => {
    onProductGroupItemsChange(prev =>
      prev.map(group => {
        if (group.id === id) {
          const updatedGroup = { ...group, [field]: value };
          if (field === 'processName') {
            const selectedProcess = processList.find(p => p.name === value);
            updatedGroup.unitProcessName = selectedProcess?.unitProcessName || '';
            // Reset productIds when processName changes as the available products will change
            updatedGroup.productIds = []; 
          }
          return updatedGroup;
        }
        return group;
      })
    );
  };

  const openProductSelector = (groupId: string, currentProcessName: string) => {
    const group = productGroupItemsState.find(g => g.id === groupId);
    if (group) {
      setCurrentEditingGroupId(groupId);
      setModalSelectedProductIds(group.productIds || []);
      setSelectedProcessForModalFilter(currentProcessName);
      setProductSelectorSearchTerm('');
      setShowProductSelectorModal(true);
    }
  };

  const handleSaveProductSelection = () => {
    if (currentEditingGroupId) {
      handleGroupInputChange(currentEditingGroupId, 'productIds', modalSelectedProductIds);
    }
    setShowProductSelectorModal(false);
    setCurrentEditingGroupId(null);
  };

  const availableProductsForModal = productItems.filter(p => 
    selectedProcessForModalFilter ? p.processName === selectedProcessForModalFilter : true
  ).filter(p => 
    p.productName.toLowerCase().includes(productSelectorSearchTerm.toLowerCase())
  );

  const handleSaveProductGroups = () => {
    console.log('제품군 저장 정보:', {
      useProductGroups: useProductGroupsState,
      productGroups: productGroupItemsState,
    });
    // 여기에 실제 저장 로직 추가 (API 호출 등)
    alert('제품군 정보가 저장되었습니다.');
    setHasSavedProductGroups(true);
  };

  // 저장 버튼 렌더링 함수
  const renderSaveButton = (
    onSave: () => void,
    isSaved: boolean,
    label: string,
    disabled: boolean = false
  ) => (
    <div className='flex items-center gap-2'>
      {isSaved && (
        <span className='text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full'>
          저장됨
        </span>
      )}
      <button
        type='button'
        onClick={onSave}
        disabled={disabled}
        className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isSaved
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        <FaSave className='mr-1' />
        {label} 저장
      </button>
    </div>
  );

  // 저장 버튼 활성화 조건
  const isSaveButtonDisabled = !useProductGroupsState || productGroupItemsState.length === 0;

  if (!processList) {
      return <p>공정 데이터 로딩 중... 또는 공정 데이터가 없습니다.</p>; // Or some other loading/error state
  }

  return (
    <div className="bg-white rounded-lg mt-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-800">5-2. 제품군</h2>
          <Tooltip text={guidanceText} position="right">
            <FaInfoCircle className="text-gray-400 hover:text-gray-600 cursor-pointer" />
          </Tooltip>
          <button
            type="button"
            onClick={() => setSectionCollapsed(!sectionCollapsed)}
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {sectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
        {renderSaveButton(handleSaveProductGroups, hasSavedProductGroups, "제품군", isSaveButtonDisabled)}
      </div>

      {!sectionCollapsed && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
            <label className="text-sm font-medium text-gray-700">
              유사 제품들을 묶어서 제품군 단위로 배출량을 산정 하시겠습니까?
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="useProductGroups"
                  checked={useProductGroupsState === true}
                  onChange={() => onUseProductGroupsChange(true)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="text-sm">예</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="useProductGroups"
                  checked={useProductGroupsState === false}
                  onChange={() => onUseProductGroupsChange(false)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="text-sm">아니오</span>
              </label>
            </div>
            {useProductGroupsState && <p className="text-sm text-green-600">‘예’ 선택 시 활성화됩니다.</p>}
          </div>

          {useProductGroupsState && (
            <div className="border rounded-md p-4">
              <div className="flex justify-end items-center mb-4">
                <button
                  type="button"
                  onClick={handleAddProductGroup}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center"
                >
                  <FaPlus className="mr-1" /> 제품군 추가
                </button>
              </div>

              {/* Desktop Form */}
              <div className="hidden lg:block">
                <ProductGroupDeskTopForm 
                  productGroupItems={productGroupItemsState}
                  processList={processList}
                  productItems={productItems} // For getting product names for display if needed, and for modal logic
                  onGroupInputChange={handleGroupInputChange}
                  onDeleteGroup={handleDeleteProductGroup}
                  onOpenProductSelector={openProductSelector}
                />
              </div>

              {/* Mobile Form */}
              <div className="lg:hidden space-y-3">
                {productGroupItemsState.map(group => (
                  <ProductGroupMobileForm 
                    key={group.id}
                    groupItem={group}
                    processList={processList}
                    productItems={productItems}
                    onGroupInputChange={handleGroupInputChange}
                    onDeleteGroup={handleDeleteProductGroup}
                    onOpenProductSelector={openProductSelector}
                    isSelected={selectedProductGroupIdMobile === group.id}
                    onSelectGroup={setSelectedProductGroupIdMobile}
                  />
                ))}
              </div>
              {productGroupItemsState.length === 0 && (
                <p className='text-center text-gray-500 py-4'>제품군 정보가 없습니다. &quot;제품군 추가&quot; 버튼을 클릭하여 추가해주세요.</p>
              )}
            </div>
          )}
        </div>
      )}

      {showProductSelectorModal && currentEditingGroupId && (
        <ProductSelectorModal
          showModal={showProductSelectorModal}
          setShowModal={setShowProductSelectorModal}
          availableProducts={availableProductsForModal}
          selectedProductIds={modalSelectedProductIds}
          setSelectedProductIds={setModalSelectedProductIds} // Allow direct modification in modal
          onSave={handleSaveProductSelection}
          searchTerm={productSelectorSearchTerm}
          setSearchTerm={setProductSelectorSearchTerm}
          // processNameForFilter={selectedProcessForModalFilter} // For title or info
        />
      )}
    </div>
  );
};

export default ProductGroupSection; 