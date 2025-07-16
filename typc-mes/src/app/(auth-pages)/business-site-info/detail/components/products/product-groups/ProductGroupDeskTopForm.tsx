'use client';

import React from 'react';
import { FaTrash, FaPlus, FaInfoCircle } from 'react-icons/fa';
import Tooltip from '../../common/Tooltip';
import {
  ProductGroupItem,
  ProductGroupInputValue,
} from './ProductGroupSection';
import { ProductItem } from '../ProductTabcontent';

interface ProcessInfoForGroup {
  id: string;
  name: string;
  unitProcessName?: string;
}

interface ProductGroupDeskTopFormProps {
  productGroupItems: ProductGroupItem[];
  processList: ProcessInfoForGroup[];
  productItems: ProductItem[]; // Full list of products from 5-1 to find names by ID
  onGroupInputChange: (
    id: string,
    field: keyof ProductGroupItem,
    value: ProductGroupInputValue
  ) => void;
  onDeleteGroup: (id: string) => void;
  onOpenProductSelector: (groupId: string, processName: string) => void;
  onSaveGroups?: () => void; // 저장 함수 추가
}

const ProductGroupDeskTopForm: React.FC<ProductGroupDeskTopFormProps> = ({
  productGroupItems,
  processList,
  productItems,
  onGroupInputChange,
  onDeleteGroup,
  onOpenProductSelector,
}) => {
  if (productGroupItems.length === 0) {
    return (
      <p className='text-center text-gray-500 py-4'>
        &quot;제품군 추가&quot; 버튼을 클릭하여 제품군을 생성해주세요.
      </p>
    );
  }

  const getProductNamesByIds = (ids: string[]) => {
    return ids
      .map(
        (id) =>
          productItems.find((p) => p.id.toString() === id)?.productName || id
      )
      .join(', ');
  };

  return (
    <div className='overflow-x-auto'>

      <table className='min-w-full border-collapse border border-gray-300 text-xs'>
        <thead className='bg-blue-100'>
          <tr>
            <th className='border border-gray-300 px-2 py-2 font-medium text-gray-700 whitespace-nowrap'>
              (1) 제품군명
              <Tooltip text='관리하고자 하는 제품군의 이름을 입력합니다.'>
                <FaInfoCircle className='inline ml-1 text-gray-400 cursor-pointer' />
              </Tooltip>
            </th>
            <th className='border border-gray-300 px-2 py-2 font-medium text-gray-700 whitespace-nowrap'>
              (2) 공정명
              <Tooltip text='해당 제품군이 생산되는 주 공정을 선택합니다. (4-1 공정 목록)'>
                <FaInfoCircle className='inline ml-1 text-gray-400 cursor-pointer' />
              </Tooltip>
            </th>
            <th className='border border-gray-300 px-2 py-2 font-medium text-gray-700 whitespace-nowrap'>
              (3) 단위공정명
              <Tooltip text='선택된 공정명의 단위공정입니다. [6. 단위공정] 설정 후 자동 표출됩니다.'>
                <FaInfoCircle className='inline ml-1 text-gray-400 cursor-pointer' />
              </Tooltip>
            </th>
            <th className='border border-gray-300 px-2 py-2 font-medium text-gray-700 whitespace-nowrap'>
              (4) 제품명 (다중선택)
              <Tooltip text='선택한 공정에서 생산되는 제품 중 이 제품군에 포함될 제품들을 선택합니다.'>
                <FaInfoCircle className='inline ml-1 text-gray-400 cursor-pointer' />
              </Tooltip>
            </th>
            <th className='border border-gray-300 px-1 py-1 whitespace-nowrap'>
              {/* 삭제 버튼용 */}
            </th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {productGroupItems.map((group) => (
            <tr key={group.id} className='align-top'>
              <td className='border border-gray-300 p-1 whitespace-nowrap min-w-[200px]'>
                <input
                  type='text'
                  value={group.groupName}
                  onChange={(e) =>
                    onGroupInputChange(group.id, 'groupName', e.target.value)
                  }
                  className='block w-full py-1.5 px-2 border border-gray-300 rounded-md shadow-sm sm:text-xs'
                  placeholder='예: 알루미늄 프레임 A타입'
                />
              </td>
              <td className='border border-gray-300 p-1 whitespace-nowrap min-w-[200px]'>
                <select
                  value={group.processName}
                  onChange={(e) =>
                    onGroupInputChange(group.id, 'processName', e.target.value)
                  }
                  className='block w-full py-1.5 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs'
                >
                  <option value=''>공정 선택</option>
                  {processList.map((proc) => (
                    <option key={proc.id} value={proc.name}>
                      {proc.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className='border border-gray-300 p-1 whitespace-nowrap min-w-[150px] text-center'>
                <span className='py-1.5 px-2 text-gray-600'>
                  {group.unitProcessName || '-'}
                </span>
              </td>
              <td className='border border-gray-300 p-1 whitespace-nowrap min-w-[300px]'>
                <button
                  type='button'
                  onClick={() =>
                    onOpenProductSelector(group.id, group.processName)
                  }
                  className='w-full text-xs py-1.5 px-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center mb-1'
                  disabled={!group.processName} // 공정명이 선택되어야 제품 선택 가능
                >
                  <span>제품 선택 ({group.productIds.length})</span>
                  <FaPlus size={10} />
                </button>
                {group.productIds.length > 0 && (
                  <div className='text-gray-600 p-1 bg-gray-50 rounded-sm text-xs break-all'>
                    {getProductNamesByIds(group.productIds)}
                  </div>
                )}
                {!group.processName && group.productIds.length === 0 && (
                  <p className='text-xs text-gray-400 text-center py-1'>
                    공정을 먼저 선택해주세요.
                  </p>
                )}
                {group.processName && group.productIds.length === 0 && (
                  <p className='text-xs text-gray-400 text-center py-1'>
                    선택된 제품이 없습니다.
                  </p>
                )}
              </td>
              <td className='border border-gray-300 p-1 whitespace-nowrap text-center'>
                <button
                  type='button'
                  onClick={() => onDeleteGroup(group.id)}
                  className='text-red-600 hover:text-red-800 p-1.5'
                  aria-label='제품군 삭제'
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductGroupDeskTopForm;
