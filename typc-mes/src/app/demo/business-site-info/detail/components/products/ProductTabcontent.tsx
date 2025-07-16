'use client';

import React, { useState, useEffect } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaInfoCircle,
  FaSave,
} from 'react-icons/fa';
import Tooltip from '../common/Tooltip';
import CustomerModal from './CustomerModal'; // CustomerModal 임포트
import ProductDeskTopForm from './ProductDeskTopForm'; // Import Desktop Form
import ProductMobileForm from './ProductMobileForm'; // Import Mobile Form
import ProductGroupSection, {
  ProductGroupItem,
} from './product-groups/ProductGroupSection'; // Import Product Group Section
import ProductProcessMappingSection from './product-process-mapping/ProductProcessMappingSection'; // Import Product Process Mapping Section

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
  classification: '제조' | '유틸리티설비' | '환경오염물처리시설';
  unitProcessNames: string[]; // 단일 공정이 아닌 배열로 변경
}
export const DUMMY_PROCESS_LIST_WITH_UNIT: ProcessInfo[] = [
  { 
    id: 'proc1', 
    name: '조립 공정 A', 
    classification: '제조',
    unitProcessNames: ['조립라인 #1', '조립라인 #2', '품질검사 #1'] 
  },
  { 
    id: 'proc2', 
    name: '가공 공정 B', 
    classification: '제조',
    unitProcessNames: ['CNC머신 #1', 'CNC머신 #2', 'CNC머신 #3', '연삭기 #1'] 
  },
  { 
    id: 'proc3', 
    name: '포장 공정 C', 
    classification: '제조',
    unitProcessNames: ['자동포장기 #A', '자동포장기 #B', '라벨링기 #1'] 
  },
  { 
    id: 'proc4', 
    name: '용광로 작업', 
    classification: '제조',
    unitProcessNames: ['1호기 용해 공정', '2호기 용해 공정', '주조 공정', '냉각 공정'] 
  },
  { 
    id: 'proc5', 
    name: '화학반응 공정', 
    classification: '제조',
    unitProcessNames: ['반응기 #1', '반응기 #2', '분리탑 #1', '정제 공정'] 
  },
  { 
    id: 'util1', 
    name: '보일러 시설', 
    classification: '유틸리티설비',
    unitProcessNames: ['보일러 #1'] 
  },
  { 
    id: 'util2', 
    name: '압축공기 공급', 
    classification: '유틸리티설비',
    unitProcessNames: ['컴프레서 시설'] 
  },
  { 
    id: 'util3', 
    name: '냉각수 공급', 
    classification: '유틸리티설비',
    unitProcessNames: ['냉각탑 시설'] 
  },
  { 
    id: 'env1', 
    name: '대기오염방지시설', 
    classification: '환경오염물처리시설',
    unitProcessNames: ['집진시설'] 
  },
  { 
    id: 'env2', 
    name: '폐수처리시설', 
    classification: '환경오염물처리시설',
    unitProcessNames: ['폐수처리장'] 
  },
  { 
    id: 'env3', 
    name: '폐기물처리시설', 
    classification: '환경오염물처리시설',
    unitProcessNames: ['소각시설'] 
  },
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
    productItems.length > 0 ? productItems[0].id : null,
  ); // 모바일 뷰 등에서 선택된 아이템 ID
  const [hasSavedProducts, setHasSavedProducts] = useState(false);

  // State for ProductGroupSection (lifted up)
  const [useProductGroups, setUseProductGroups] = useState(false);
  const [productGroupItems, setProductGroupItems] = useState<
    ProductGroupItem[]
  >([]);

  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>('');

  // --- Dummy Data ---
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
  const [modalSelectedCustomers, setModalSelectedCustomers] = useState<
    string[]
  >([]);

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
    value: ProductInputValue,
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
              (cn) => cn.code === value,
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
              (p) => p.name === value,
            );
            if (selectedProcessInfo) {
              // 모든 단위공정명을 콤마로 구분하여 표시
              updatedItem.unitProcessName = selectedProcessInfo.unitProcessNames.join(', ');
            } else {
              updatedItem.unitProcessName = '';
            }
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const handleFileChange = (id: number, file: File | null) => {
    setProductItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, attachedFile: file || undefined } : item,
      ),
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
          !item.processName,
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
    label: string,
  ) => (
    <div className="flex items-center gap-2">
      {isSaved && (
        <span className="rounded-full bg-green-50 px-2 py-1 text-sm text-green-600">
          저장됨
        </span>
      )}
      <button
        type="button"
        onClick={onSave}
        className={`flex items-center rounded-md px-3 py-1.5 text-sm ${
          isSaved
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        <FaSave className="mr-1" />
        {label} 저장
      </button>
    </div>
  );

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
        : [...prev, customerName],
    );
  };

  const saveCustomersToProductItem = () => {
    if (currentEditingProductId !== null) {
      handleProductInputChange(
        currentEditingProductId,
        'customerNames',
        modalSelectedCustomers,
      );
    }
    setShowCustomerModal(false);
    setCurrentEditingProductId(null); // ID 초기화
  };

  const removeCustomerFromProductItem = (
    productId: number,
    customerName: string,
  ) => {
    setProductItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            customerNames: item.customerNames.filter(
              (name) => name !== customerName,
            ),
          };
        }
        return item;
      }),
    );
  };

  // 필터링된 고객사 목록 (검색어에 따라)
  const filteredCustomersForModal = DUMMY_CUSTOMERS.filter((customer) =>
    customer.toLowerCase().includes(customerSearchTerm.toLowerCase()),
  );
  // --- End Customer Modal Logic ---

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-800">
            5-1. 제품 목록
          </h2>
          <Tooltip text={guidanceText} position="bottom">
            <FaInfoCircle className="cursor-pointer text-gray-400 hover:text-gray-600" />
          </Tooltip>
          <button
            type="button"
            className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
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
        {renderSaveButton(handleSaveProducts, hasSavedProducts, '제품')}
      </div>

      {!productSectionCollapsed && (
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <div className="mb-4 flex items-center justify-end">
              <button
                type="button"
                onClick={handleAddProduct}
                className="flex items-center rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
              >
                <FaPlus className="mr-1" /> 제품 추가
              </button>
            </div>
            <div>
              {/* 반응형 처리: 데스크톱은 테이블, 모바일은 카드 리스트 */}
              <div className="hidden lg:block">
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
              <div className="space-y-4 lg:hidden">
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
                <p className="py-4 text-center text-gray-500">
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
          unitProcessName: p.unitProcessNames.join(', '), // 모든 단위공정명을 콤마로 구분하여 표시
        }))}
        productGroupItemsState={productGroupItems}
        onProductGroupItemsChange={setProductGroupItems}
        useProductGroupsState={useProductGroups}
        onUseProductGroupsChange={setUseProductGroups}
      />

      {/* 5-3. 제품공정 섹션 */}
      <ProductProcessMappingSection
        allProducts={productItems}
        allProcesses={DUMMY_PROCESS_LIST_WITH_UNIT}
      />
    </div>
  );
};

export default ProductTabContent;
