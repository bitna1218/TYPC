'use client';

import React from 'react';
import {
  FaInfoCircle,
  FaTrash,
  FaPlus,
  FaTimes,
  FaTag,
} from 'react-icons/fa';
import Tooltip from '../common/Tooltip';
import {
  ProductItem,
  ProductInputValue,
  // Assuming DUMMY_CN_CODES, DUMMY_PROCESS_LIST_WITH_UNIT, classificationOptions, salesUnitOptions are exported or passed as props
} from './ProductTabcontent'; // Adjust path as needed

// Re-define or import necessary dummy data if not passed as props
// For simplicity, assuming they are passed as props or defined globally if static
// For this example, let's assume DUMMY_CN_CODES and DUMMY_PROCESS_LIST_WITH_UNIT
// and options are passed as props.

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

interface ProductDeskTopFormProps {
  productItems: ProductItem[];
  classificationOptions: ProductItem['classification'][];
  salesUnitOptions: ProductItem['salesUnit'][];
  dummyCnCodes: CnCodeInfo[];
  dummyProcessList: ProcessInfo[];
  // DUMMY_CUSTOMERS is used by the modal logic within ProductTabContent, so not directly needed here
  onProductInputChange: (
    id: number,
    field: keyof ProductItem,
    value: ProductInputValue
  ) => void;
  onFileChange: (id: number, file: File | null) => void;
  onDeleteProduct: (id: number) => void;
  onOpenCustomerModal: (productId: number) => void; // To open the modal
  onRemoveCustomer: (productId: number, customerName: string) => void; // To remove a customer tag
}

const ProductDeskTopForm: React.FC<ProductDeskTopFormProps> = ({
  productItems,
  classificationOptions,
  salesUnitOptions,
  dummyCnCodes,
  dummyProcessList,
  onProductInputChange,
  onFileChange,
  onDeleteProduct,
  onOpenCustomerModal,
  onRemoveCustomer,
}) => {
  if (!productItems || productItems.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">
        제품 정보가 없습니다. &quot;제품 추가&quot; 버튼을 클릭하여 추가해주세요.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(1)</div>구분</th>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(2)</div>제품명</th>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(3)</div>모델명</th>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(4)</div>판매 단위</th>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
              <div>(5)</div>
              <div>단위 당 중량</div>
              <div className="font-normal text-xs">(kg/판매단위) 
                <Tooltip position='right' text="판매 단위가 'kg'이 아닐 경우, 해당 판매 단위 1단위 당 kg 중량을 기입합니다. (예: EA -> 1개당 kg)"><FaInfoCircle className="inline ml-1 text-gray-400 cursor-pointer" /></Tooltip>
              </div>
            </th>
            <th colSpan={3} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">CBAM 관련 정보</th>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(9)</div>공정명</th>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
              <div>(10)</div>단위공정명
              <Tooltip position='right' text="[6. 단위공정] 단계에서 단위공정 설정이 완료된 후에 표출됩니다."><FaInfoCircle className="inline ml-1 text-gray-400 cursor-pointer" /></Tooltip>
            </th>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
              <div>(11)</div>고객사명
              <Tooltip position='right' text="고객사명을 선택합니다. 반제품, 부산물은 고객사를 선택하지 않을 수 있습니다."><FaInfoCircle className="inline ml-1 text-gray-400 cursor-pointer" /></Tooltip>
            </th>
            <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(12)</div>파일 첨부</th>
            <th rowSpan={2} className="border border-gray-300 px-1 py-1 whitespace-nowrap"></th>{/* 삭제 버튼용 헤더 */}</tr>
          <tr>
            <th className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                <div>(6)</div>CN코드<br />/HS코드
                <Tooltip position='right' text="EU 수출 철강/알루미늄: CN코드 6자리 필수. UNIPASS 참고 (https://unipass.customs.go.kr/clip/index.do '세계 HS > 관세율표')"><FaInfoCircle className="inline ml-1 text-gray-400 cursor-pointer" /></Tooltip>
            </th>
            <th className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(7)</div>품목</th>
            <th className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(8)</div>품목군</th></tr>
        </thead>
        <tbody className="text-xs bg-white">
          {productItems.map((item) => (
            <tr key={item.id} className="align-top">
              <td className="border border-gray-300 p-1 whitespace-nowrap">
                <select
                  value={item.classification}
                  onChange={(e) => onProductInputChange(item.id, 'classification', e.target.value as ProductItem['classification'])}
                  className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs min-w-[100px]"
                >
                  <option value="">선택</option>
                  {classificationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap">
                <input type="text" value={item.productName} onChange={(e) => onProductInputChange(item.id, 'productName', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-xs py-1 px-2 min-w-[150px]" />
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap">
                <input type="text" value={item.modelName} onChange={(e) => onProductInputChange(item.id, 'modelName', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-xs py-1 px-2 min-w-[150px]" />
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap">
                <select
                  value={item.salesUnit}
                  onChange={(e) => onProductInputChange(item.id, 'salesUnit', e.target.value as ProductItem['salesUnit'])}
                  className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs min-w-[100px]"
                >
                  <option value="">선택</option>
                  {salesUnitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap">
                <input type="number" value={item.weightPerUnit} onChange={(e) => onProductInputChange(item.id, 'weightPerUnit', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-xs py-1 px-2 min-w-[100px]" placeholder="숫자 입력"/>
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap">
                <select
                  value={item.cnHsCode}
                  onChange={(e) => onProductInputChange(item.id, 'cnHsCode', e.target.value)}
                  className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs min-w-[150px]"
                >
                  <option value="">CN/HS코드 선택</option>
                  {dummyCnCodes.map(cn => (
                    <option key={cn.code} value={cn.code}>{cn.displayName}</option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap text-center text-gray-500">
                {item.itemCbam || '-'}
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap text-center text-gray-500">
                {item.itemGroupCbam || '-'}
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap">
                <select
                  value={item.processName}
                  onChange={(e) => onProductInputChange(item.id, 'processName', e.target.value)}
                  className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs min-w-[150px]"
                >
                  <option value="">공정 선택</option>
                  {dummyProcessList.map(proc => <option key={proc.id} value={proc.name}>{proc.name}</option>)}
                </select>
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap text-center text-gray-500">
                {item.unitProcessName || '미설정'}
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap min-w-[250px]">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => onOpenCustomerModal(item.id)}
                    className="w-full text-xs py-1 px-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center"
                    disabled={item.classification === '반제품' || item.classification === '부산물'}
                  >
                    <span>고객사 선택</span>
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
                          className="text-blue-600 hover:text-blue-800"
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
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap">
                <input 
                  type="file" 
                  onChange={(e) => onFileChange(item.id, e.target.files ? e.target.files[0] : null)}
                  className="text-xs w-full min-w-[200px] block py-1 px-2 border rounded-md shadow-sm border-gray-300 bg-white"
                />
                 {/* Display uploaded file name if needed */}
                 {typeof item.attachedFile === 'string' && item.attachedFile && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.attachedFile}</p>
                 )}
                 {item.attachedFile instanceof File && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.attachedFile.name}</p>
                 )}
              </td>
              <td className="border border-gray-300 p-1 whitespace-nowrap text-center">
                <button
                  type="button"
                  onClick={() => onDeleteProduct(item.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  aria-label="제품 삭제"
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

export default ProductDeskTopForm; 