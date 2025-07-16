'use client';

import React, { useState } from 'react';
import { UnitProcessInfo } from './ProductProcessMappingSection'; // Import interfaces
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface MappableItem {
  id: string;
  name: string;
  type: 'product';
}

interface ProductProcessMappingMobileViewProps {
  mappableItems: MappableItem[];
  subProcesses: UnitProcessInfo[];
  onSubProcessOrderChange: (mappableItemId: string, mappableItemType: 'product', subProcessId: string) => void;
  getOrderForSubProcess: (mappableItemId: string, mappableItemType: 'product', subProcessId: string) => number | undefined;
}

const ProductProcessMappingMobileView: React.FC<ProductProcessMappingMobileViewProps> = ({
  mappableItems,
  subProcesses,
  onSubProcessOrderChange,
  getOrderForSubProcess,
}) => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  if (mappableItems.length === 0 ) {
    return null; // Parent handles this message
  }
  if (subProcesses.length === 0) {
    return null; // Parent handles this message
  }

  const toggleExpand = (itemId: string) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  return (
    <div className="space-y-3 p-2">
      {mappableItems.map(item => (
        <div key={item.id + item.type} className="border border-gray-200 rounded-md shadow-sm">
          <button 
            type="button"
            className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 text-left"
            onClick={() => toggleExpand(item.id + item.type)}
          >
            <div className='flex flex-col'>
                 <span className="font-semibold text-sm text-gray-800">
                     {item.name}
                 </span>
                 <span className="text-gray-500 text-xs">제품</span>
              </div>
            {expandedItemId === (item.id + item.type) ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {expandedItemId === (item.id + item.type) && (
            <div className="p-3 bg-white text-xs">
              <p className="text-xs text-gray-600 mb-2">세부 공정을 클릭하여 순서를 지정/해제하세요.</p>
              <div className="space-y-2">
                {subProcesses.map(sp => {
                  const order = getOrderForSubProcess(item.id, item.type, sp.id);
                  return (
                    <div 
                      key={sp.id} 
                      className={`p-2 border rounded-md flex justify-between items-center cursor-pointer transition-colors ${order ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                      onClick={() => onSubProcessOrderChange(item.id, item.type, sp.id)}
                    >
                      <span>{sp.name}</span>
                      {order !== undefined && (
                        <span className="w-5 h-5 bg-indigo-500 text-white rounded-full text-xs font-semibold flex items-center justify-center">
                          {order}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductProcessMappingMobileView; 