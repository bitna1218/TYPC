'use client';

import React, { useState } from 'react';
import {
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaTimes,
  FaTag,
  FaInfoCircle,
} from 'react-icons/fa';
import Tooltip from '../common/Tooltip';
import {
  ProductItem,
  ProductInputValue,
} from './ProductTabcontent'; // Adjust path as needed

// Assuming types for options/dummy data are defined/imported as in ProductDeskTopForm
interface CnCodeInfo {
    code: string;
    displayName: string;
    item: string;
    itemGroup: string;
}

interface ProcessInfo {
    id: string;
    name: string;
    unitProcessName: string;
}

interface ProductMobileFormProps {
  item: ProductItem;
  classificationOptions: ProductItem['classification'][];
  salesUnitOptions: ProductItem['salesUnit'][];
  dummyCnCodes: CnCodeInfo[];
  dummyProcessList: ProcessInfo[];
  onProductInputChange: (
    id: number,
    field: keyof ProductItem,
    value: ProductInputValue
  ) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDeleteProduct: (id: number) => void;
  onOpenCustomerModal: (productId: number) => void;
  onRemoveCustomer: (productId: number, customerName: string) => void;
  isSelected: boolean; // To highlight if the card is currently active/focused
  onSelectProduct: (id: number | null) => void; // To handle card selection/expansion
}

const ProductMobileForm: React.FC<ProductMobileFormProps> = ({
  item,
  classificationOptions,
  salesUnitOptions,
  dummyCnCodes,
  dummyProcessList,
  onProductInputChange,
  onFileChange,
  onDeleteProduct,
  onOpenCustomerModal,
  onRemoveCustomer,
  isSelected,
  onSelectProduct,
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded for mobile

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      onSelectProduct(item.id); // Select when expanding
    } else if (isSelected && isExpanded) {
      // If collapsing the currently selected one, deselect it
      // onSelectProduct(null); // Optional: or keep it selected
    }
  };

  const fieldLabel = (label: string, tooltipText?: string, required?: boolean) => (
    <div className="flex items-center mb-1">
        <label className="block text-xs font-medium text-gray-600">
            {label} {required && <span className="text-red-500">*</span>}
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
          {item.productName || `제품 ${item.id}`}{item.modelName && `: ${item.modelName}`}
        </h4>
        <div className="flex items-center">
          <button
            type="button"
            className="p-1 text-gray-500 hover:text-gray-700"
            aria-label={isExpanded ? '접기' : '펼치기'}
          >
            {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3 bg-white text-xs">
          {/* Row 1: 구분, 제품명, 모델명 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              {fieldLabel('(1) 구분', undefined, true)}
              <select
                value={item.classification}
                onChange={(e) => onProductInputChange(item.id, 'classification', e.target.value as ProductItem['classification'])}
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
              >
                <option value="">선택</option>
                {classificationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              {fieldLabel('(2) 제품명', undefined, true)}
              <input
                type="text"
                value={item.productName}
                onChange={(e) => onProductInputChange(item.id, 'productName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
                placeholder="제품명 입력"
              />
            </div>
            <div>
              {fieldLabel('(3) 모델명')}
              <input
                type="text"
                value={item.modelName}
                onChange={(e) => onProductInputChange(item.id, 'modelName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
                placeholder="모델명 입력"
              />
            </div>
          </div>

          {/* Row 2: 판매단위, 단위 당 중량 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {fieldLabel('(4) 판매 단위', undefined, true)}
              <select
                value={item.salesUnit}
                onChange={(e) => onProductInputChange(item.id, 'salesUnit', e.target.value as ProductItem['salesUnit'])}
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
              >
                <option value="">선택</option>
                {salesUnitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              {fieldLabel('(5) 단위 당 중량 (kg/판매단위)', "판매 단위가 'kg'이 아닐 경우, 해당 판매 단위 1단위 당 kg 중량을 기입합니다. (예: EA -> 1개당 kg)")}
              <input
                type="number"
                value={item.weightPerUnit}
                onChange={(e) => onProductInputChange(item.id, 'weightPerUnit', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
                placeholder="숫자 입력"
              />
            </div>
          </div>
          
          {/* CBAM 관련 정보 Title */}
          <h5 className="text-sm font-medium text-gray-700 mt-3 mb-1 pt-2 border-t">CBAM 관련 정보</h5>

          {/* Row 3: CN/HS코드, 품목, 품목군 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              {fieldLabel('(6) CN코드/HS코드', "EU 수출 철강/알루미늄: CN코드 6자리 필수. UNIPASS 참고")}
              <select
                value={item.cnHsCode}
                onChange={(e) => onProductInputChange(item.id, 'cnHsCode', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
              >
                <option value="">CN/HS코드 선택</option>
                {dummyCnCodes.map(cn => (
                  <option key={cn.code} value={cn.code}>{cn.displayName}</option>
                ))}
              </select>
            </div>
            <div>
              {fieldLabel('(7) 품목 (CBAM)')}
              <p className="w-full p-2 border border-gray-300 rounded-md text-xs bg-gray-50 h-[34px] flex items-center">
                {item.itemCbam || '-'}
              </p>
            </div>
            <div>
              {fieldLabel('(8) 품목군 (CBAM)')}
              <p className="w-full p-2 border border-gray-300 rounded-md text-xs bg-gray-50 h-[34px] flex items-center">
                {item.itemGroupCbam || '-'}
              </p>
            </div>
          </div>

          {/* 일반 정보 Title */}
          <h5 className="text-sm font-medium text-gray-700 mt-3 mb-1 pt-2 border-t">일반 정보</h5>

          {/* Row 4: 공정명, 단위공정명 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {fieldLabel('(9) 공정명', undefined, true)}
              <select
                value={item.processName}
                onChange={(e) => onProductInputChange(item.id, 'processName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
              >
                <option value="">공정 선택</option>
                {dummyProcessList.map(proc => <option key={proc.id} value={proc.name}>{proc.name}</option>)}
              </select>
            </div>
            <div>
              {fieldLabel('(10) 단위공정명', "[6. 단위공정] 단계에서 단위공정 설정이 완료된 후에 표출됩니다.")}
              <p className="w-full p-2 border border-gray-300 rounded-md text-xs bg-gray-50 h-[34px] flex items-center">
                 {item.unitProcessName || '미설정'}
              </p>
            </div>
          </div>

          {/* Row 5: 고객사명, 파일첨부 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {fieldLabel('(11) 고객사명', "반제품, 부산물은 고객사를 선택하지 않을 수 있습니다.")}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onOpenCustomerModal(item.id)}
                  className="w-full text-xs py-2 px-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center"
                  disabled={item.classification === '반제품' || item.classification === '부산물'}
                >
                  <span>고객사 선택 ({item.customerNames.length})</span>
                  <FaPlus size={10} />
                </button>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.customerNames.map((customer, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs flex items-center"
                    >
                      <FaTag className="mr-1" size={9} />
                      <span className="mr-0.5">{customer}</span>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 ml-1"
                        onClick={() => onRemoveCustomer(item.id, customer)}
                        disabled={item.classification === '반제품' || item.classification === '부산물'}
                      >
                        <FaTimes size={9} />
                      </button>
                    </div>
                  ))}
                  {item.customerNames.length === 0 && (item.classification !== '반제품' && item.classification !== '부산물') && (
                      <span className="text-gray-400 text-xs py-1">선택된 고객사 없음</span>
                  )}
                  {(item.classification === '반제품' || item.classification === '부산물') && (
                      <span className="text-gray-400 text-xs py-1">해당 없음</span>
                  )}
                </div>
              </div>
            </div>
            <div>
              {fieldLabel('(12) 파일 첨부')}
              <input
                type="file"
                onChange={(e) => onFileChange(item.id, e.target.files ? e.target.files[0] : null)}
                className="text-xs w-full block py-1.5 px-2 border rounded-md shadow-sm border-gray-300 bg-white"
              />
              {typeof item.attachedFile === 'string' && item.attachedFile && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{item.attachedFile}</p>
              )}
              {item.attachedFile instanceof File && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{item.attachedFile.name}</p>
              )}
            </div>
          </div>

          {/* 삭제 버튼 */}
          <div className="flex justify-end pt-2 mt-2 border-t">
            <button
              type="button"
              onClick={() => onDeleteProduct(item.id)}
              className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100 text-xs flex items-center"
              aria-label="삭제"
            >
              <FaTrash className="mr-1" /> 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMobileForm; 