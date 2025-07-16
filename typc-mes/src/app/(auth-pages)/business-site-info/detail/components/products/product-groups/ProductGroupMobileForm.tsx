'use client';

import React, { useState } from 'react';
import {
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaInfoCircle,
  FaSave,
} from 'react-icons/fa';
import Tooltip from '../../common/Tooltip';
import { ProductGroupItem, ProductGroupInputValue } from './ProductGroupSection';
import { ProductItem } from '../ProductTabcontent';

interface ProcessInfoForGroup {
    id: string;
    name: string;
    unitProcessName?: string;
}

interface ProductGroupMobileFormProps {
  groupItem: ProductGroupItem;
  processList: ProcessInfoForGroup[];
  productItems: ProductItem[]; // To display product names
  onGroupInputChange: (id: string, field: keyof ProductGroupItem, value: ProductGroupInputValue) => void;
  onDeleteGroup: (id: string) => void;
  onOpenProductSelector: (groupId: string, processName: string) => void;
  isSelected: boolean;
  onSelectGroup: (id: string | null) => void;
  onSaveGroup?: () => void;
}

const ProductGroupMobileForm: React.FC<ProductGroupMobileFormProps> = ({
  groupItem,
  processList,
  productItems,
  onGroupInputChange,
  onDeleteGroup,
  onOpenProductSelector,
  isSelected,
  onSelectGroup,
  onSaveGroup,
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      onSelectGroup(groupItem.id);
    } else if (isSelected && isExpanded) {
      // onSelectGroup(null); // Optional: deselect if collapsing selected
    }
  };

  const getProductNamesByIds = (ids: string[]) => {
    if (ids.length === 0) return '선택된 제품 없음';
    return ids.map(id => productItems.find(p => p.id.toString() === id)?.productName || id).join(', ');
  };
  
  const fieldLabel = (label: string, tooltipText?: string) => (
    <div className="flex items-center mb-1">
        <label className="block text-xs font-medium text-gray-600">
            {label}
        </label>
        {tooltipText && (
            <Tooltip text={tooltipText} position="top">
                <FaInfoCircle className="ml-1 text-gray-400 cursor-pointer" />
            </Tooltip>
        )}
    </div>
  );

  return (
    <div className={`border rounded-md shadow-sm ${isSelected ? 'border-blue-500' : 'border-gray-200'} mb-3`}>
      <div
        className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={handleToggleExpand}
      >
        <h4 className="font-semibold text-gray-700 text-sm">
          {groupItem.groupName || `제품군 (ID: ${groupItem.id.substring(0,5)})`}
        </h4>
        <div className="flex items-center">
          <button type="button" className="p-1 text-gray-500 hover:text-gray-700">
            {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3 bg-white text-xs">
          <div>
            {fieldLabel('(1) 제품군명', '관리하고자 하는 제품군의 이름을 입력합니다.')}
            <input
              type="text"
              value={groupItem.groupName}
              onChange={(e) => onGroupInputChange(groupItem.id, 'groupName', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-xs"
              placeholder="예: 알루미늄 프레임 A타입"
            />
          </div>

          <div>
            {fieldLabel('(2) 공정명', '해당 제품군이 생산되는 주 공정을 선택합니다.')}
            <select
              value={groupItem.processName}
              onChange={(e) => onGroupInputChange(groupItem.id, 'processName', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white"
            >
              <option value="">공정 선택</option>
              {processList.map(proc => (
                <option key={proc.id} value={proc.name}>{proc.name}</option>
              ))}
            </select>
          </div>

          <div>
            {fieldLabel('(3) 단위공정명', '선택된 공정명의 단위공정입니다.')}
            <p className="w-full p-2 border border-gray-300 rounded-md text-xs bg-gray-50 h-[34px] flex items-center">
              {groupItem.unitProcessName || '-'}
            </p>
          </div>

          <div>
            {fieldLabel('(4) 제품명 (다중선택)', '이 제품군에 포함될 제품들을 선택합니다.')}
            <button
              type="button"
              onClick={() => onOpenProductSelector(groupItem.id, groupItem.processName)}
              className="w-full text-xs py-2 px-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center mb-1"
              disabled={!groupItem.processName}
            >
              <span>제품 선택 ({groupItem.productIds.length})</span>
              <FaPlus size={10} />
            </button>
            {groupItem.productIds.length > 0 && (
                <div className="text-gray-600 p-2 bg-gray-50 rounded-sm text-xs break-words border border-gray-200">
                    {getProductNamesByIds(groupItem.productIds)}
                </div>
            )}
            {!groupItem.processName && groupItem.productIds.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-1">공정을 먼저 선택해주세요.</p>
            )}
            {groupItem.processName && groupItem.productIds.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-1">선택된 제품이 없습니다.</p>
            )}
          </div>

          <div className="flex justify-between pt-2 mt-2 border-t">
            {onSaveGroup && (
              <button
                type="button"
                onClick={onSaveGroup}
                className="p-2 text-green-500 hover:text-green-700 rounded-md hover:bg-green-100 text-xs flex items-center"
              >
                <FaSave className="mr-1" /> 저장
              </button>
            )}
            <button
              type="button"
              onClick={() => onDeleteGroup(groupItem.id)}
              className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100 text-xs flex items-center"
            >
              <FaTrash className="mr-1" /> 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGroupMobileForm; 