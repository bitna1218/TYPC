'use client';

import React, { useState, useEffect } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaInfoCircle,
  FaSave,
} from 'react-icons/fa';
import Tooltip from '../common/Tooltip'; // 경로 수정 필요시 확인
import CustomerModal from './CustomerModal'; // CustomerModal 임포트
import ProductDeskTopForm from './ProductDeskTopForm'; // Import Desktop Form
import ProductMobileForm from './ProductMobileForm'; // Import Mobile Form
import ProductGroupSection, {
  ProductGroupItem,
} from './product-groups/ProductGroupSection'; // Import Product Group Section
import ProductProcessMappingSection, {
  ProcessWithSubProcesses,
} from './product-process-mapping/ProductProcessMappingSection'; // Import Product Process Mapping Section & ProductProcessMap

// --- Interfaces ---
export interface ProductItem {
  id: number;
  classification: '제품' | '반제품' | '부산물' | '';
  productName: string;
  modelName: string;
  salesUnit: 'kg' | 'EA' | 'L' | 'm' | 'm²' | 'm³' | 'MJ' | 'kWh' | '';
  weightPerUnit: string; // 사용자 입력 편의를 위해 string, 저장 시 number로 변환 고려
  cnHsCode: string; // CN/HS 코드 (사용자 선택 값)
  itemCbam?: string; // (7) 품목 (자동표출)
  itemGroupCbam?: string; // (8) 품목군 (자동표출)
  processName: string; // (9) 공정명 (사용자 선택 값)
  unitProcessName?: string; // (10) 단위공정명 (자동표출)
  customerNames: string[]; // (11) 고객사명 (다중 선택된 고객사 이름 배열)
  attachedFile?: File | string; // 파일 객체 또는 경로
}

export type ProductInputValue =
  | string
  | number
  | string[]
  | File
  | null
  | undefined;

interface ProductTabContentProps {
  siteId?: string;
  // 다른 탭(예: 공정 탭)에서 가져올 데이터 Props
  // processListFromOtherTab?: { id: string, name: string }[];
}

// 임시 데이터 (향후 실제 데이터로 대체)

// (6) CN코드/HS코드, (7)품목, (8)품목군 더미 데이터
interface CnCodeInfo {
  code: string; // 실제 CN/HS 코드 값 (예: '760611')
  displayName: string; // Select에 표시될 이름 (예: '760611 - 알루미늄 합금 직사각형 판')
  item: string; // (7) 품목
  itemGroup: string; // (8) 품목군
}
const DUMMY_CN_CODES: CnCodeInfo[] = [
  {
    code: '760611',
    displayName: '760611 - 알루미늄 합금 직사각형 판',
    item: '알루미늄 판',
    itemGroup: '압연 알루미늄',
  },
  {
    code: '720851',
    displayName: '720851 - 열간압연 철강 평판제품 (두께 10mm 초과)',
    item: '후판',
    itemGroup: '탄소강',
  },
  {
    code: '281122',
    displayName: '281122 - 이산화규소',
    item: '실리카',
    itemGroup: '무기화학품',
  },
  { code: ' ', displayName: '기타 (직접입력)', item: '', itemGroup: '' }, // 직접 입력 옵션
];

// (9)공정명, (10)단위공정명 더미 데이터
interface ProcessInfo {
  id: string;
  name: string;
  unitProcessName: string;
}
export const DUMMY_PROCESS_LIST_WITH_UNIT: ProcessInfo[] = [
  { id: 'proc1', name: '조립 공정 A', unitProcessName: '조립라인 #1' },
  { id: 'proc2', name: '가공 공정 B', unitProcessName: 'CNC머신 #3' },
  { id: 'proc3', name: '포장 공정 C', unitProcessName: '자동포장기 #A' },
  { id: 'proc4', name: '용광로 작업', unitProcessName: '1호기 용해 공정' },
];

// (11) 고객사명 더미 데이터 (체크박스용)
const DUMMY_CUSTOMERS: string[] = [
  '삼성전자',
  'LG화학',
  '현대모비스',
  'SK하이닉스',
  '포스코',
];

// 초기 제품 아이템 (이미지 첫번째 행 참고)
const initialProductItem: ProductItem = {
  id: 1,
  classification: '' /* classificationOptions[0] */, // 예: '제품' -> 실제 화면에서는 사용자가 선택
  productName: '', // 사용자가 직접 입력
  modelName: '', // 사용자가 직접 입력
  salesUnit: '' /* salesUnitOptions[0] */, // 예: 'kg' -> 실제 화면에서는 사용자가 선택
  weightPerUnit: '', // 사용자가 직접 입력
  cnHsCode: '', // 사용자가 직접 입력
  itemCbam: '', // 별도 파일 예정
  itemGroupCbam: '', // 별도 파일 예정
  processName: '' /* DUMMY_PROCESS_LIST[0]?.name */, // 예: '조립 공정 A' -> 실제 화면에서는 사용자가 선택
  unitProcessName: '', // 자동 표출 (미설정)
  customerNames: [], // 사용자가 직접 입력/선택
  attachedFile: undefined,
};

const ProductTabContent: React.FC<ProductTabContentProps> = ({
  siteId,
  // processListFromOtherTab = DUMMY_PROCESS_LIST
}) => {
  const [productSectionCollapsed, setProductSectionCollapsed] = useState(false);
  const [productItems, setProductItems] = useState<ProductItem[]>([
    initialProductItem, // 초기 아이템 1개로 시작
  ]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    productItems.length > 0 ? productItems[0].id : null
  ); // 모바일 뷰 등에서 선택된 아이템 ID
  const [hasSavedProducts, setHasSavedProducts] = useState(false);

  // State for ProductGroupSection (lifted up)
  const [useProductGroups, setUseProductGroups] = useState(false);
  const [productGroupItems, setProductGroupItems] = useState<
    ProductGroupItem[]
  >([]);

  const classificationOptions: ProductItem['classification'][] = [
    '제품',
    '반제품',
    '부산물',
  ];
  const salesUnitOptions: ProductItem['salesUnit'][] = [
    'kg',
    'EA',
    'L',
    'm',
    'm²',
    'm³',
    'MJ',
    'kWh',
  ];

  const guidanceText = `
(1) 구분: 제품, 반제품, 부산물 중에 선택합니다.
  - 제품(product and coproduct): 공정운영 목적에 맞게 생산되며 경제적인 가치를 갖는 제품을 말합니다. (외부로 판매되거나 후속공정의 원자재로 사용될 수 있는 제품)
  - 반제품(semi-finished product): 외부 판매 뿐 아니라 후속공정 또는 타 제품 생산공정으로 가는 제품
  - 부산물(byproduct): 제품 이외에 생산되는 경제적 가치가 있는 물질 (다른 공정의 원료나 연료로 사용되거나 외부 판매될 수 있는 물질) 예) 스팀, treated off-gas 등
(2) 제품명: 사업장에서 생산하여 판매한 제품명을 선택합니다.
(3) 모델명: 제품의 모델명을 작성합니다.
(4) 판매단위: 제품의 판매단위를 선택합니다. (kg, EA, L, m, m², m³, MJ, KWH)
(5) 단위 당 중량: 3번에 작성한 판매단위가 kg이 아닐 경우 단위 당 중량(kg)을 작성합니다. 예) 판매 단위 'EA' -> 1 EA당 무게(kg)
(6) CN코드/HS코드: EU로 수출하는 철강 또는 알루미늄 제품의 경우, CN코드(모르실 경우 HS코드)를 작성합니다. 특히 EU 수출 시 6자리 필수. UNIPASS 참고.
(9) 생산공정명: 제품이 생산되는 공정을 선택합니다.
(10) 고객사명: 제품을 생산한 후 납품하는 고객사를 다중 선택합니다. (반제품, 부산물은 고객사 선택 안 할 수 있음)
`;

  // 고객사 선택 모달 관련 상태
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [currentEditingProductId, setCurrentEditingProductId] = useState<
    number | null
  >(null); // 현재 고객사 편집 중인 제품 ID
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [modalSelectedCustomers, setModalSelectedCustomers] = useState<
    string[]
  >([]);

  // Dummy data for ProcessWithSubProcesses (4-1 공정 + 4-2 세부공정)
  const DUMMY_ALL_PROCESSES_WITH_SUB_PROCESSES: ProcessWithSubProcesses[] = [
    {
      id: 'proc1',
      processName: '조립 공정 A',
      processClassification: '제조',
      subProcesses: [
        { id: 'sub_proc_A1', name: '부품 검사' },
        { id: 'sub_proc_A2', name: '기본 골격 조립' },
        { id: 'sub_proc_A3', name: '최종 검수' },
      ],
    },
    {
      id: 'proc2',
      processName: '가공 공정 B',
      processClassification: '제조',
      subProcesses: [
        { id: 'sub_proc_B1', name: '원자재 절단' },
        { id: 'sub_proc_B2', name: 'CNC 가공' },
        { id: 'sub_proc_B3', name: '표면 처리' },
        { id: 'sub_proc_B4', name: '품질 검사' },
      ],
    },
    {
      id: 'proc3',
      processName: '포장 공정 C',
      processClassification: '제조',
      subProcesses: [
        { id: 'sub_proc_C1', name: '개별 포장' },
        { id: 'sub_proc_C2', name: '박스 포장' },
      ],
    },
    {
      id: 'proc4',
      processName: '용광로 작업',
      processClassification: '제조',
      subProcesses: [
        { id: 'sub_proc_D1', name: '원료 투입' },
        { id: 'sub_proc_D2', name: '용해' },
        { id: 'sub_proc_D3', name: '불순물 제거' },
        { id: 'sub_proc_D4', name: '주조' },
      ],
    },
    {
      id: 'util1',
      processName: '스팀 공급',
      processClassification: '유틸리티',
      subProcesses: [
        { id: 'sub_util1_1', name: '보일러 가동' },
        { id: 'sub_util1_2', name: '압력 조절' },
      ],
    },
  ];

  useEffect(() => {
    if (siteId) {
      console.log(`ProductTabContent: Loading data for site ID ${siteId}`);
      // 여기에 siteId 기반 데이터 로딩 로직 추가
    }
  }, [siteId]);

  const handleAddProduct = () => {
    setProductItems((prevItems) => {
      const newId =
        prevItems.length > 0
          ? Math.max(...prevItems.map((item) => item.id)) + 1
          : 1;
      const newItem: ProductItem = {
        id: newId,
        classification: '',
        productName: '',
        modelName: '',
        salesUnit: '',
        weightPerUnit: '',
        cnHsCode: '',
        processName: '',
        customerNames: [],
      };
      // setSelectedProductId(newId); // 필요시 활성화
      return [...prevItems, newItem];
    });
  };

  const handleDeleteProduct = (id: number) => {
    if (productItems.length <= 1 && id === productItems[0]?.id) {
      alert('최소 1개 이상의 제품 정보가 필요합니다.');
      return;
    }
    if (window.confirm('선택한 제품을 삭제하시겠습니까?')) {
      const updatedItems = productItems.filter((item) => item.id !== id);
      setProductItems(updatedItems);
      // if (selectedProductId === id) { // 필요시 활성화
      //   setSelectedProductId(
      //     updatedItems.length > 0 ? updatedItems[0].id : null
      //   );
      // }
    }
  };

  const handleProductInputChange = (
    id: number,
    field: keyof ProductItem,
    value: ProductInputValue
  ) => {
    setProductItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // 'customerNames' 필드는 handleCustomerChange 또는 saveCustomersToProductItem에서 직접 처리
          if (field === 'customerNames' && Array.isArray(value)) {
            return { ...item, customerNames: value };
          }
          const updatedItem = { ...item, [field]: value };

          // (6) CN코드/HS코드 변경 시 (7)품목, (8)품목군 자동 업데이트
          if (field === 'cnHsCode') {
            const selectedCnInfo = DUMMY_CN_CODES.find(
              (cn) => cn.code === value
            );
            if (selectedCnInfo) {
              updatedItem.itemCbam = selectedCnInfo.item;
              updatedItem.itemGroupCbam = selectedCnInfo.itemGroup;
              // 만약 '기타 (직접입력)'을 선택했고, 실제로는 직접 입력 필드를 보여줘야 한다면
              // 여기서 추가적인 상태(예: isCnCodeDirectInput)를 관리해야 할 수 있습니다.
              // 지금은 displayName을 사용하지 않으므로 code 값으로만 처리합니다.
            } else {
              updatedItem.itemCbam = '';
              updatedItem.itemGroupCbam = '';
            }
          }

          // (9) 공정명 변경 시 (10)단위공정명 자동 업데이트
          if (field === 'processName') {
            const selectedProcessInfo = DUMMY_PROCESS_LIST_WITH_UNIT.find(
              (p) => p.name === value
            );
            if (selectedProcessInfo) {
              updatedItem.unitProcessName = selectedProcessInfo.unitProcessName;
            } else {
              updatedItem.unitProcessName = '';
            }
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleFileChange = (id: number, file: File | null) => {
    setProductItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, attachedFile: file || undefined } : item
      )
    );
  };

  const handleSaveProducts = () => {
    // 필수 필드 유효성 검사 (예시)
    if (
      productItems.some(
        (item) =>
          !item.classification ||
          !item.productName ||
          !item.salesUnit ||
          !item.processName
        // 고객사명은 이제 선택사항이 될 수 있으므로 필수 검사에서 제외하거나 조건부로 추가
      )
    ) {
      alert('구분, 제품명, 판매 단위, 생산공정명은 필수 항목입니다.');
      return;
    }
    console.log('Saving Product Data:', { productItems });
    alert('제품 정보가 저장되었습니다. (콘솔 확인)');
    setHasSavedProducts(true);
    // 여기에 실제 저장 로직 (API 호출 등) 추가
    // 제품 정보 저장 후, 제품군 관리 섹션에서 사용할 수 있도록 상태 업데이트 또는 콜백 호출이 필요할 수 있음
  };

  // 저장 버튼 렌더링 함수
  const renderSaveButton = (
    onSave: () => void,
    isSaved: boolean,
    label: string
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
        className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
          isSaved
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        <FaSave className='mr-1' />
        {label} 저장
      </button>
    </div>
  );

  // 데스크톱용 폼 렌더링 (간소화 버전)
  // TODO: ProductDeskTopForm.tsx 로 분리
  // const renderDesktopForm = () => (
  //   <div className="overflow-x-auto">
  //     <table className="min-w-full border-collapse border border-gray-300">
  //       <thead className="bg-blue-100 text-sm">
  //         <tr>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(1)</div>구분</th>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(2)</div>제품명</th>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(3)</div>모델명</th>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(4)</div>판매 단위</th>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
  //             <div>(5)</div>
  //             <div>단위 당 중량</div>
  //             <div className="font-normal text-xs">(kg/판매단위)
  //               <Tooltip text="판매 단위가 'kg'이 아닐 경우, 해당 판매 단위 1단위 당 kg 중량을 기입합니다. (예: EA -> 1개당 kg)"><FaInfoCircle className="inline ml-1 text-gray-400 cursor-pointer" /></Tooltip>
  //             </div>
  //           </th>
  //           <th colSpan={3} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">CBAM 관련 정보</th>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(9)</div>공정명</th>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
  //             <div>(10)</div>단위공정명
  //             <Tooltip text="[6. 단위공정] 단계에서 단위공정 설정이 완료된 후에 표출됩니다."><FaInfoCircle className="inline ml-1 text-gray-400 cursor-pointer" /></Tooltip>
  //           </th>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
  //             <div>(11)</div>고객사명
  //             <Tooltip text="고객사명을 선택합니다. 반제품, 부산물은 고객사를 선택하지 않을 수 있습니다."><FaInfoCircle className="inline ml-1 text-gray-400 cursor-pointer" /></Tooltip>
  //           </th>
  //           <th rowSpan={2} className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(12)</div>파일 첨부</th>
  //           <th rowSpan={2} className="border border-gray-300 px-1 py-1 whitespace-nowrap"></th> {/* 삭제 버튼용 헤더 */}
  //         </tr>
  //         <tr>
  //           <th className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
  //               <div>(6)</div>CN코드<br />/HS코드
  //               <Tooltip text="EU 수출 철강/알루미늄: CN코드 6자리 필수. UNIPASS 참고 (https://unipass.customs.go.kr/clip/index.do '세계 HS > 관세율표')"><FaInfoCircle className="inline ml-1 text-gray-400 cursor-pointer" /></Tooltip>
  //           </th>
  //           <th className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(7)</div>품목</th>
  //           <th className="border border-gray-300 px-2 py-1 font-medium text-gray-700 whitespace-nowrap"><div>(8)</div>품목군</th>
  //         </tr>
  //       </thead>
  //       <tbody className="text-xs bg-white"> {/* tbody 배경색 흰색으로 명시 */}
  //         {/* 설명용 행 제거 */}

  //         {/* 실제 입력 행들 */}
  //         {productItems.map((item) => (
  //           <tr key={item.id} className="align-top">
  //             <td className="border border-gray-300 p-1 whitespace-nowrap">
  //               <select
  //                 value={item.classification}
  //                 onChange={(e) => handleProductInputChange(item.id, 'classification', e.target.value as ProductItem['classification'])}
  //                 className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs min-w-[100px]"
  //               >
  //                 <option value="">선택</option>
  //                 {classificationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  //               </select>
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap">
  //               <input type="text" value={item.productName} onChange={(e) => handleProductInputChange(item.id, 'productName', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-xs py-1 px-2 min-w-[150px]" />
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap">
  //               <input type="text" value={item.modelName} onChange={(e) => handleProductInputChange(item.id, 'modelName', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-xs py-1 px-2 min-w-[150px]" />
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap">
  //               <select
  //                 value={item.salesUnit}
  //                 onChange={(e) => handleProductInputChange(item.id, 'salesUnit', e.target.value as ProductItem['salesUnit'])}
  //                 className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs min-w-[100px]"
  //               >
  //                 <option value="">선택</option>
  //                 {salesUnitOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  //               </select>
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap">
  //               <input type="number" value={item.weightPerUnit} onChange={(e) => handleProductInputChange(item.id, 'weightPerUnit', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-xs py-1 px-2 min-w-[100px]" placeholder="숫자 입력"/>
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap">
  //               <select
  //                 value={item.cnHsCode}
  //                 onChange={(e) => handleProductInputChange(item.id, 'cnHsCode', e.target.value)}
  //                 className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs min-w-[150px]"
  //               >
  //                 <option value="">CN/HS코드 선택</option>
  //                 {DUMMY_CN_CODES.map(cn => (
  //                   <option key={cn.code} value={cn.code}>{cn.displayName}</option>
  //                 ))}
  //               </select>
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap text-center text-gray-500">
  //               {item.itemCbam || '-'}
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap text-center text-gray-500">
  //               {item.itemGroupCbam || '-'}
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap">
  //               <select
  //                 value={item.processName}
  //                 onChange={(e) => handleProductInputChange(item.id, 'processName', e.target.value)}
  //                 className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs min-w-[150px]"
  //               >
  //                 <option value="">공정 선택</option>
  //                 {DUMMY_PROCESS_LIST_WITH_UNIT.map(proc => <option key={proc.id} value={proc.name}>{proc.name}</option>)}
  //               </select>
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap text-center text-gray-500">
  //               {item.unitProcessName || '미설정'}
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap min-w-[250px]">
  //               {/* (11) 고객사명 - 모달 방식 */}
  //               <div className="space-y-1">
  //                 <button
  //                   type="button"
  //                   onClick={() => openCustomerModal(item.id)}
  //                   className="w-full text-xs py-1 px-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center"
  //                   disabled={item.classification === '반제품' || item.classification === '부산물'}
  //                 >
  //                   <span>고객사 선택</span>
  //                   <FaPlus size={10} />
  //                 </button>
  //                 <div className="flex flex-wrap gap-1 mt-1">
  //                   {item.customerNames.map((customer, index) => (
  //                     <div
  //                       key={index}
  //                       className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs flex items-center"
  //                     >
  //                       <FaTag className="mr-1" size={9} />
  //                       <span className="mr-0.5">{customer}</span>
  //                       <button
  //                         type="button"
  //                         className="text-blue-600 hover:text-blue-800"
  //                         onClick={() => removeCustomerFromProductItem(item.id, customer)}
  //                         disabled={item.classification === '반제품' || item.classification === '부산물'}
  //                       >
  //                         <FaTimes size={9} />
  //                       </button>
  //                     </div>
  //                   ))}
  //                   {item.customerNames.length === 0 && (item.classification !== '반제품' && item.classification !== '부산물') && (
  //                      <span className="text-gray-400 text-xs py-1">선택된 고객사 없음</span>
  //                   )}
  //                    {(item.classification === '반제품' || item.classification === '부산물') && (
  //                       <span className="text-gray-400 text-xs py-1">해당 없음</span>
  //                   )}
  //                 </div>
  //               </div>
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap">
  //               <input
  //                 type="file"
  //                 onChange={(e) => handleFileChange(item.id, e.target.files ? e.target.files[0] : null)}
  //                 className="text-xs w-full min-w-[200px] block py-1 px-2 border rounded-md shadow-sm border-gray-300 bg-white"
  //               />
  //                {/* Display uploaded file name if needed */}
  //                {typeof item.attachedFile === 'string' && item.attachedFile && (
  //                   <p className="text-xs text-gray-500 mt-1 truncate">{item.attachedFile}</p>
  //                )}
  //                {item.attachedFile instanceof File && (
  //                   <p className="text-xs text-gray-500 mt-1 truncate">{item.attachedFile.name}</p>
  //                )}
  //             </td>
  //             <td className="border border-gray-300 p-1 whitespace-nowrap text-center">
  //               <button
  //                 type="button"
  //                 onClick={() => handleDeleteProduct(item.id)}
  //                 className="text-red-600 hover:text-red-900 p-1"
  //                 aria-label="제품 삭제"
  //               >
  //                 <FaTrash />
  //               </button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );

  // TODO: 모바일용 폼 렌더링 ProductMobileForm.tsx 로 분리

  // --- Customer Modal Logic ---
  const openCustomerModal = (productId: number) => {
    const product = productItems.find((p) => p.id === productId);
    if (product) {
      setCurrentEditingProductId(productId);
      setModalSelectedCustomers(product.customerNames || []);
      setCustomerSearchTerm(''); // 검색어 초기화
      setShowCustomerModal(true);
    }
  };

  const toggleCustomerInModal = (customerName: string) => {
    setModalSelectedCustomers((prev) =>
      prev.includes(customerName)
        ? prev.filter((name) => name !== customerName)
        : [...prev, customerName]
    );
  };

  const saveCustomersToProductItem = () => {
    if (currentEditingProductId !== null) {
      handleProductInputChange(
        currentEditingProductId,
        'customerNames',
        modalSelectedCustomers
      );
    }
    setShowCustomerModal(false);
    setCurrentEditingProductId(null); // ID 초기화
  };

  const removeCustomerFromProductItem = (
    productId: number,
    customerName: string
  ) => {
    setProductItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            customerNames: item.customerNames.filter(
              (name) => name !== customerName
            ),
          };
        }
        return item;
      })
    );
  };

  // 필터링된 고객사 목록 (검색어에 따라)
  const filteredCustomersForModal = DUMMY_CUSTOMERS.filter((customer) =>
    customer.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );
  // --- End Customer Modal Logic ---

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h2 className='text-xl font-semibold text-gray-800'>
            5-1. 제품 목록
          </h2>
          <Tooltip text={guidanceText} position='bottom'>
            <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
          </Tooltip>
          <button
            type='button'
            className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
            onClick={() => setProductSectionCollapsed(!productSectionCollapsed)}
            aria-label={
              productSectionCollapsed
                ? '제품 목록 섹션 펼치기'
                : '제품 목록 섹션 접기'
            }
          >
            {productSectionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          </button>
        </div>
        {renderSaveButton(handleSaveProducts, hasSavedProducts, "제품")}
      </div>

      {!productSectionCollapsed && (
        <div className='space-y-6'>
          <div className='border rounded-md p-4'>
            <div className='flex justify-end items-center mb-4'>
              <button
                type='button'
                onClick={handleAddProduct}
                className='px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center'
              >
                <FaPlus className='mr-1' /> 제품 추가
              </button>
            </div>
    <div>
              {/* 반응형 처리: 데스크톱은 테이블, 모바일은 카드 리스트 */}
              <div className='hidden lg:block'>
                <ProductDeskTopForm
                  productItems={productItems}
                  classificationOptions={classificationOptions}
                  salesUnitOptions={salesUnitOptions}
                  dummyCnCodes={DUMMY_CN_CODES}
                  dummyProcessList={DUMMY_PROCESS_LIST_WITH_UNIT}
                  onProductInputChange={handleProductInputChange}
                  onFileChange={handleFileChange}
                  onDeleteProduct={handleDeleteProduct}
                  onOpenCustomerModal={openCustomerModal}
                  onRemoveCustomer={removeCustomerFromProductItem}
                />
              </div>
              <div className='lg:hidden space-y-4'>
                {productItems.map((item) => (
                  <ProductMobileForm
                    key={item.id}
                    item={item}
                    classificationOptions={classificationOptions}
                    salesUnitOptions={salesUnitOptions}
                    dummyCnCodes={DUMMY_CN_CODES}
                    dummyProcessList={DUMMY_PROCESS_LIST_WITH_UNIT}
                    onProductInputChange={handleProductInputChange}
                    onFileChange={handleFileChange}
                    onDeleteProduct={handleDeleteProduct}
                    onOpenCustomerModal={openCustomerModal}
                    onRemoveCustomer={removeCustomerFromProductItem}
                    isSelected={selectedProductId === item.id}
                    onSelectProduct={setSelectedProductId}
                  />
                ))}
              </div>
              {productItems.length === 0 && (
                <p className='text-center text-gray-500 py-4'>
                  제품 정보가 없습니다. &quot;제품 추가&quot; 버튼을 클릭하여
                  추가해주세요.
                </p>
              )}
            </div>
          </div>


        </div>
      )}
      {showCustomerModal && currentEditingProductId !== null && (
        <CustomerModal
          showModal={showCustomerModal}
          setShowModal={setShowCustomerModal}
          customerSearchTerm={customerSearchTerm}
          setCustomerSearchTerm={setCustomerSearchTerm}
          filteredCustomers={filteredCustomersForModal}
          selectedCustomers={modalSelectedCustomers}
          toggleCustomer={toggleCustomerInModal}
          saveCustomers={saveCustomersToProductItem}
          modalIdPrefix={`product-${currentEditingProductId}-customer`}
        />
      )}

      {/* 5-2. 제품군 섹션 */}
      <ProductGroupSection
        productItems={productItems}
        processList={DUMMY_PROCESS_LIST_WITH_UNIT.map((p) => ({
          id: p.id,
          name: p.name,
          unitProcessName: p.unitProcessName,
        }))}
        productGroupItemsState={productGroupItems}
        onProductGroupItemsChange={setProductGroupItems}
        useProductGroupsState={useProductGroups}
        onUseProductGroupsChange={setUseProductGroups}
      />

      {/* 5-3. 제품공정 섹션 */}
      <ProductProcessMappingSection
        allProducts={productItems}
        allProductGroups={useProductGroups ? productGroupItems : []}
        allProcessesWithSubProcesses={DUMMY_ALL_PROCESSES_WITH_SUB_PROCESSES}
      />
    </div>
  );
};

export default ProductTabContent;
