'use client';

import React from 'react';
import { SubProcessInfo } from './ProductProcessMappingSection'; // Import interfaces

interface MappableItem {
  id: string;
  name: string;
  type: 'product' | 'productGroup';
}

interface ProductProcessMappingDeskTopTableProps {
  mappableItems: MappableItem[];
  subProcesses: SubProcessInfo[];
  onSubProcessOrderChange: (mappableItemId: string, mappableItemType: 'product' | 'productGroup', subProcessId: string) => void;
  getOrderForSubProcess: (mappableItemId: string, mappableItemType: 'product' | 'productGroup', subProcessId: string) => number | undefined;
}

const ProductProcessMappingDeskTopTable: React.FC<ProductProcessMappingDeskTopTableProps> = ({
  mappableItems,
  subProcesses,
  onSubProcessOrderChange,
  getOrderForSubProcess,
}) => {
  if (mappableItems.length === 0) {
    // This case is handled by the parent, but added defensively.
    // Or, if subProcesses are also 0, then display a message like "Please select a process with sub-processes and ensure products/groups are linked."
    return null;
  }
  if (subProcesses.length === 0) {
    // This case is handled by the parent.
    return null;
  }

  return (
    <div className="overflow-x-auto p-1">
      <table className="min-w-full border-collapse border border-gray-300 text-xs">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-gray-300 px-3 py-2 font-medium text-gray-700 whitespace-nowrap sticky left-0 z-10 bg-blue-100">제품/제품군</th>
            {subProcesses.map(sp => (
              <th key={sp.id} className="border border-gray-300 px-2 py-2 font-medium text-gray-700 whitespace-nowrap min-w-[100px]">
                {sp.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {mappableItems.map(item => (
            <tr key={item.id + item.type} className="align-middle hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2 whitespace-nowrap sticky left-0 z-10 bg-white hover:bg-gray-50">
                <span className={`font-medium ${item.type === 'productGroup' ? 'text-blue-600' : 'text-gray-800'}`}>
                  {item.name}
                </span>
                <span className="text-gray-500 ml-1 text-[10px]">
                  ({item.type === 'product' ? '제품' : '제품군'})
                </span>
              </td>
              {subProcesses.map(sp => {
                const order = getOrderForSubProcess(item.id, item.type, sp.id);
                return (
                  <td 
                    key={sp.id}
                    className="border border-gray-300 p-0.5 whitespace-nowrap text-center cursor-pointer hover:bg-blue-50 transition-colors select-none min-w-[100px] h-[40px]" // Ensure cells have min height for clickability
                    onClick={() => onSubProcessOrderChange(item.id, item.type, sp.id)}
                    title={`클릭하여 ${item.name}의 ${sp.name} 공정 순서 ${order ? '해제' : '지정'}`}
                  >
                    {order !== undefined && (
                      <span 
                        className="flex items-center justify-center w-6 h-6 bg-indigo-500 text-white rounded-full text-xs font-semibold mx-auto"
                      >
                        {order}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductProcessMappingDeskTopTable; 