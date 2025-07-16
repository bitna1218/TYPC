import React, { useState, useEffect } from 'react';
import {
  FaTrash,
  FaUpload,
  FaQuestionCircle,
  FaPlus,
  FaEdit,
  FaTimes,
  FaTag,
} from 'react-icons/fa';
import SupplierModal from './SupplierModal'; // SupplierModal 임포트

// 원자재 인터페이스 정의
interface Material {
  id: number;
  name: string; // (1) 원자재명
  emissionCoefProvided: 'O' | 'X' | ''; // (2) 배출계수 제공 여부
  databaseType: 'O' | 'X' | ''; // (3) Database 유무
  physicalForm: '단일물질' | '혼합물' | ''; // (4) 물질정보
  materialInfo: string; // (5) 재질정보
  casNumber: string; // (6) CAS No.
  concentration: string; // (7) 농도 (%)
  unit: string; // (8) 단위
  weightConversionFactor: number; // (9) 단위 당 중량 (kg/단위)
  bioMassType: 'O' | 'X' | ''; // (10) 바이오매스 여부
  bioMassRatio: number; // (11) 함량 (%)
  emissionCoef: string; // (12) 배출계수
  emissionUnit: string; // (13) 배출계수 단위
  suppliers: string[]; // (14) 공급업체 - 다중선택 가능하도록 배열로 변경
  fileAttachment: File | null; // (15) 파일첨부
  inputAmount: number; // 투입량
  totalAmount: number; // 환산합계
}

// 혼합물 구성성분 인터페이스
interface MaterialComponent {
  id: number;
  materialId: number; // 소속된 원자재 ID
  name: string; // 재질정보
  casNumber: string; // CAS No.
  unit: string; // 단위
  inputAmount: number; // 투입량
  ratio: number; // 비율 (%)
  totalAmount: number; // 환산합계
}

// 툴팁 인터페이스
interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

// 툴팁 컴포넌트
const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className='relative inline-block'>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className='cursor-help'
      >
        {children}
      </div>

      {isVisible && (
        <div className='absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg -left-2'>
          {content}
          <div className='absolute w-0 h-0 border-8 border-transparent border-b-gray-800 -top-4 left-3' />
        </div>
      )}
    </div>
  );
};

// 테이블 컴포넌트 인터페이스
interface MaterialTableProps {
  materials: Material[];
  selectedMaterialId: number | null;
  unitOptions: string[];
  physicalFormOptions: string[];
  components: MaterialComponent[];
  onSelectMaterial: (id: number) => void;
  onInputChange: (
    id: number,
    field: keyof Material,
    value: string | number | File | null | string[]
  ) => void;
  onDeleteMaterial: (id: number) => void;
  onFileUpload: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDelete: (id: number) => void;
  onAddComponent: (materialId: number) => void;
  onDeleteComponent: (componentId: number) => void;
  onComponentInputChange: (
    componentId: number,
    field: keyof MaterialComponent,
    value: string | number
  ) => void;
  defaultSuppliers: string[];
}

/**
 * 원자재 테이블 컴포넌트 - 마스터-디테일 분할 화면 레이아웃
 *
 * 데스크탑 뷰에서 왼쪽에 원자재 목록(마스터), 오른쪽에 선택된 원자재의 상세 정보(디테일)를 표시합니다.
 */
const MaterialDeskTopForm: React.FC<MaterialTableProps> = ({
  materials,
  selectedMaterialId,
  unitOptions,
  physicalFormOptions,
  components,
  onSelectMaterial,
  onInputChange,
  onDeleteMaterial,
  onFileUpload,
  onFileDelete,
  onAddComponent,
  onDeleteComponent,
  onComponentInputChange,
  defaultSuppliers,
}) => {
  // 선택된 원자재 가져오기
  const selectedMaterial =
    materials.find((m) => m.id === selectedMaterialId) || materials[0];

  // 선택된 원자재의 구성성분 가져오기
  const selectedMaterialComponents = components.filter(
    (comp) => comp.materialId === selectedMaterial.id
  );

  // 구성성분 비율 합계 계산
  const totalRatio = selectedMaterialComponents.reduce(
    (sum, component) => sum + (component.ratio || 0),
    0
  );

  // 비율 합계 색상 계산
  const getRatioColor = () => {
    if (totalRatio === 0) return 'text-gray-500';
    if (Math.abs(totalRatio - 100) <= 0.1) return 'text-green-600';
    if (totalRatio < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 선택된 구성성분 ID
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(
    null
  );

  // 편집 모드 상태
  const [isEditingComponent, setIsEditingComponent] = useState(false);

  // 새 구성성분을 위한 상태
  const [newComponent, setNewComponent] = useState({
    name: '',
    casNumber: '',
    unit: unitOptions[0],
    inputAmount: unitOptions[0] !== 'kg' ? 0 : 1,
    ratio: 0,
  });

  // 선택된 구성성분 객체
  const selectedComponent = selectedComponentId
    ? selectedMaterialComponents.find((comp) => comp.id === selectedComponentId)
    : null;

  // 구성성분 총량 계산 함수 수정
  const calculateComponentTotalAmount = (
    materialInputAmount: number,
    componentInputAmount: number,
    ratio: number,
    unit: string
  ): number => {
    if (unit === 'kg') {
      // kg 단위: 원자재 투입량 × 1 × 비율(%)
      return materialInputAmount * 1 * (ratio / 100);
    } else {
      // 기타 단위: 원자재 투입량 × 구성성분 개수 × 구성성분 단위중량
      return materialInputAmount * componentInputAmount * ratio;
    }
  };

  // 혼합물 구성성분 입력값 변경 핸들러 - 구성성분 섹션에서 사용
  const handleComponentInputChange = (
    componentId: number,
    field: keyof MaterialComponent,
    value: string | number
  ) => {
    // 구성성분 정보 가져오기
    const component = selectedMaterialComponents.find(comp => comp.id === componentId);
    if (!component) return;

    if (field === 'unit' && value === 'kg') {
      // 단위가 kg으로 변경되면 투입량을 1로 설정
      onComponentInputChange(componentId, 'inputAmount', 1);
      // 이후 기존 로직 수행
      onComponentInputChange(componentId, field, value);
    } else {
      // 기존 로직 수행
      onComponentInputChange(componentId, field, value);
    }

    // 단위와 투입량 변경 시 환산합계 업데이트
    if (field === 'unit' || field === 'inputAmount' || field === 'ratio') {
      const newTotalAmount = calculateComponentTotalAmount(
        selectedMaterial.inputAmount,
        field === 'inputAmount' ? Number(value) : Number(component.inputAmount) || 0,
        field === 'ratio' ? Number(value) : Number(component.ratio) || 0,
        field === 'unit' ? String(value) : component.unit
      );
      
      onComponentInputChange(componentId, 'totalAmount', newTotalAmount);
    }
  };

  // 입력 필드 변경 핸들러 수정
  const handleInputFieldChange = (field: string, value: string | number) => {
    if (selectedComponentId) {
      // 기존 구성성분 편집
      handleComponentInputChange(
        selectedComponentId,
        field as keyof MaterialComponent,
        value
      );
    } else {
      // 새 구성성분 추가
      if (field === 'unit') {
        // 단위가 변경되고 kg로 설정되면 투입량을 1로 자동 설정
        if (value === 'kg') {
          setNewComponent({
            ...newComponent,
            [field]: value,
            inputAmount: 1
          });
          return;
        }
      }
      
      setNewComponent({
        ...newComponent,
        [field]: value,
      });
    }
  };

  // 구성성분 저장 핸들러 수정
  const handleSaveComponent = () => {
    if (!selectedComponentId) {
      // 이미 handleDirectAddComponent에서 구성성분 추가를 처리함
      // 여기서는 newComponent 상태 값을 사용하여 필드 값만 업데이트
      
      // 선택된 구성성분이 없으면 저장하지 않음
      console.log('저장할 구성성분이 선택되지 않았습니다.');
    } else {
      // 기존 구성성분 업데이트
      console.log('기존 구성성분 업데이트:', selectedComponentId);
    }

    // 편집 모드 종료
    setIsEditingComponent(false);
  };

  // 공급업체 선택 모달 상태
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);

  // selectedMaterial 또는 defaultSuppliers가 변경될 때 selectedSuppliers 및 filteredSuppliers 업데이트
  useEffect(() => {
    setSelectedSuppliers(selectedMaterial?.suppliers || []);
  }, [selectedMaterial?.suppliers]);

  useEffect(() => {
    if (!supplierSearchTerm.trim()) {
      setFilteredSuppliers(defaultSuppliers.filter(s => s !== '2.2 - (1) 공급업체명 (다중선택)'));
    } else {
      setFilteredSuppliers(
        defaultSuppliers.filter(
          (s) => 
            s !== '2.2 - (1) 공급업체명 (다중선택)' &&
            s.toLowerCase().includes(supplierSearchTerm.toLowerCase())
        )
      );
    }
  }, [supplierSearchTerm, defaultSuppliers]);

  // 공급업체 모달 열기
  const openSupplierModal = () => {
    setSelectedSuppliers(selectedMaterial.suppliers || []);
    setShowSupplierModal(true);
  };
  
  // 공급업체 모달 저장하기
  const saveSuppliers = () => {
    onInputChange(selectedMaterial.id, 'suppliers', selectedSuppliers);
    setShowSupplierModal(false);
  };
  
  // 공급업체 개별 삭제 
  const removeSupplier = (supplier: string) => {
    const updatedSuppliers = (selectedMaterial.suppliers || []).filter(
      (s) => s !== supplier
    );
    onInputChange(selectedMaterial.id, 'suppliers', updatedSuppliers);
  };
  
  // 공급업체 체크박스 토글
  const toggleSupplier = (supplier: string) => {
    if (selectedSuppliers.includes(supplier)) {
      setSelectedSuppliers(selectedSuppliers.filter(s => s !== supplier));
    } else {
      setSelectedSuppliers([...selectedSuppliers, supplier]);
    }
  };

  // 구성성분 추가 핸들러 - 완전히 새로 구현
  const handleDirectAddComponent = () => {
    if (selectedMaterial.physicalForm !== '혼합물') {
      alert('혼합물이 아닌 원자재에는 구성성분을 추가할 수 없습니다.');
      return;
    }

    // onAddComponent 함수 호출 (원자재 ID만 전달)
    onAddComponent(selectedMaterial.id);
    
    // 구성성분이 추가된 후 selectedMaterialComponents가 업데이트될 때까지 기다린 후
    // 새 구성성분을 선택하고 편집 모드로 전환
    setTimeout(() => {
      // 새로 추가된 components 배열을 확인하고 마지막 구성성분을 선택
      const latestComponents = selectedMaterialComponents;
      console.log('업데이트된 구성성분 목록:', latestComponents);
      
      if (latestComponents.length > 0) {
        const latestComponent = latestComponents[latestComponents.length - 1];
        setSelectedComponentId(latestComponent.id);
        
        // 새 구성성분 필드 설정
        setNewComponent({
          name: latestComponent.name || '',
          casNumber: latestComponent.casNumber || '',
          unit: latestComponent.unit || unitOptions[0],
          inputAmount: latestComponent.unit !== 'kg' ? 0 : 1,
          ratio: 0,
        });
        
        // 편집 모드 활성화
        setIsEditingComponent(true);
      }
    }, 200); // 시간을 더 길게 설정
  };

  if (!selectedMaterial) { // selectedMaterial이 없을 경우 (materials 배열이 비어있는 초기 상태 등)
    return <div className="hidden lg:block text-center text-gray-500 p-4">원자재를 추가해주세요.</div>;
  }

  return (
    <div className='hidden lg:flex space-x-4 mt-4'>
      {/* 마스터 영역: 원자재 목록 */}
      <div className='w-1/3 bg-white border border-gray-200 rounded-md overflow-hidden'>
        <div className='bg-gray-100 px-4 py-3 border-b border-gray-200'>
          <h3 className='font-medium text-gray-800'>원자재 목록</h3>
        </div>
        <div className='overflow-y-auto' style={{ maxHeight: '600px' }}>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  원자재명
                </th>
                <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  물질정보
                </th>
                <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  작업
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {materials.map((material) => (
                <tr
                  key={material.id}
                  className={
                    selectedMaterialId === material.id
                      ? 'bg-blue-50 cursor-pointer'
                      : 'hover:bg-gray-50 cursor-pointer'
                  }
                  onClick={() => onSelectMaterial(material.id)}
                >
                  <td className='px-3 py-2 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {material.name || `원자재 ${material.id}`}
                    </div>
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        material.physicalForm === '혼합물'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {material.physicalForm || '미지정'}
                    </span>
                  </td>
                  <td className='px-3 py-2 whitespace-nowrap'>
                    <button
                      type='button'
                      className='text-red-600 hover:text-red-800'
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMaterial(material.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 디테일 영역: 선택된 원자재 상세 정보 */}
      <div className='w-2/3 bg-white border border-gray-200 rounded-md overflow-hidden'>
        <div className='bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
          <h3 className='font-medium text-gray-800'>
            {selectedMaterial.name || `원자재 ${selectedMaterial.id}`} 상세 정보
          </h3>
          {selectedMaterial.physicalForm === '혼합물' && (
            <span className='px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full'>
              혼합물
            </span>
          )}
        </div>
        <div className='p-4 overflow-y-auto' style={{ maxHeight: '600px' }}>
          <div className='grid grid-cols-2 gap-4'>
            {/* 기본 정보 */}
            <div className='col-span-2'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                기본 정보
              </h4>
              <div className='grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md'>
                {/* 원자재명 */}
                <div>
                  <div className='flex items-center'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      (1) 원자재명 <span className='text-red-500'>*</span>
                    </label>
                  </div>
                  <div className='relative'>
                    <input
                      type='text'
                      className='w-full p-2 border border-gray-300 rounded-md'
                      value={selectedMaterial.name}
                      onChange={(e) =>
                        onInputChange(selectedMaterial.id, 'name', e.target.value)
                      }
                      placeholder='원자재명 입력'
                    />
                    {selectedMaterial.name && (
                      <span className='absolute right-2 top-2'>
                        {selectedMaterial.databaseType === 'O' ? (
                          <span className='text-green-600 text-sm px-2 py-1 bg-green-100 rounded-full'>
                            DB 존재
                          </span>
                        ) : selectedMaterial.databaseType === 'X' ? (
                          <span className='text-red-600 text-sm px-2 py-1 bg-red-100 rounded-full'>
                            DB 없음
                          </span>
                        ) : null}
                      </span>
                    )}
                  </div>
                </div>

                {/* 배출계수 제공 여부 */}
                <div>
                  <div className='flex items-center'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      (2) 배출계수 제공 여부{' '}
                      <span className='text-red-500'>*</span>
                    </label>
                  </div>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterial.emissionCoefProvided}
                    onChange={(e) =>
                      onInputChange(
                        selectedMaterial.id,
                        'emissionCoefProvided',
                        e.target.value as 'O' | 'X' | ''
                      )
                    }
                  >
                    <option value=''>선택</option>
                    <option value='O'>O</option>
                    <option value='X'>X</option>
                  </select>
                </div>

                {/* Database 유무 */}
                <div>
                  <div className='flex items-center'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      (3) Database 유무 <span className='text-red-500'>*</span>
                    </label>
                    {selectedMaterial.name && (
                      <Tooltip content='원자재명 입력에 따라 자동 설정됩니다'>
                        <FaQuestionCircle className='ml-1 text-gray-400 text-sm' />
                      </Tooltip>
                    )}
                  </div>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterial.databaseType}
                    onChange={(e) =>
                      onInputChange(
                        selectedMaterial.id,
                        'databaseType',
                        e.target.value as 'O' | 'X' | ''
                      )
                    }
                    disabled={selectedMaterial.emissionCoefProvided === 'O' || selectedMaterial.name !== ''}
                  >
                    <option value=''>선택</option>
                    <option value='O'>O</option>
                    <option value='X'>X</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 물질 특성 */}
            <div className='col-span-2'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                물질 특성
              </h4>
              <div className='grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-md'>
                {/* 물질정보 */}
                <div>
                  <div className='flex items-center'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      (4) 물질정보
                    </label>
                    <Tooltip content='혼합물 선택 시 구성성분을 추가해야 합니다'>
                      <FaQuestionCircle className='ml-1 text-gray-400 text-sm' />
                    </Tooltip>
                  </div>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterial.physicalForm}
                    onChange={(e) =>
                      onInputChange(
                        selectedMaterial.id,
                        'physicalForm',
                        e.target.value as '단일물질' | '혼합물' | ''
                      )
                    }
                    disabled={selectedMaterial.databaseType === 'O'}
                  >
                    {physicalFormOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 재질정보 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    (5) 재질정보
                  </label>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterial.materialInfo}
                    onChange={(e) =>
                      onInputChange(
                        selectedMaterial.id,
                        'materialInfo',
                        e.target.value
                      )
                    }
                    disabled={selectedMaterial.databaseType === 'O'}
                    placeholder='재질정보 입력'
                  />
                </div>

                {/* CAS No. */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    (6) CAS No.
                  </label>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterial.casNumber}
                    onChange={(e) =>
                      onInputChange(
                        selectedMaterial.id,
                        'casNumber',
                        e.target.value
                      )
                    }
                    disabled={selectedMaterial.databaseType === 'O'}
                    placeholder='CAS 번호 입력'
                  />
                </div>

                {/* 농도(%) */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    (7) 농도(%)
                  </label>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterial.concentration}
                    onChange={(e) =>
                      onInputChange(
                        selectedMaterial.id,
                        'concentration',
                        e.target.value
                      )
                    }
                    placeholder='농도 입력'
                  />
                </div>
              </div>
            </div>

            {/* 수량 정보 */}
            <div className='col-span-2'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                수량 정보
              </h4>
              <div className='grid grid-cols-1 gap-4 p-3 bg-gray-50 rounded-md'>
                <div className='grid grid-cols-3 gap-4'>
                  {/* 단위 */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      (8) 단위
                    </label>
                    <select
                      className='w-full p-2 border border-gray-300 rounded-md'
                      value={selectedMaterial.unit}
                      onChange={(e) =>
                        onInputChange(selectedMaterial.id, 'unit', e.target.value)
                      }
                    >
                      {unitOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 단위 당 중량 */}
                  <div>
                    <div className='flex items-center'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        (9) 단위 당 중량
                      </label>
                      <Tooltip content='선택한 단위당 kg 중량값을 입력하세요'>
                        <FaQuestionCircle className='ml-1 text-gray-400 text-sm' />
                      </Tooltip>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='number'
                        className='w-full p-2 border border-gray-300 rounded-l-md'
                        min='0'
                        step='0.001'
                        value={selectedMaterial.weightConversionFactor}
                        onChange={(e) =>
                          onInputChange(
                            selectedMaterial.id,
                            'weightConversionFactor',
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                      <div className='px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md whitespace-nowrap'>
                        kg/{selectedMaterial.unit}
                      </div>
                    </div>
                  </div>

                  {/* 투입량 */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      {selectedComponentId && selectedComponent?.unit === 'kg' || 
                       !selectedComponentId && newComponent.unit === 'kg' 
                       ? '(8) 투입량 (kg 단위는 고정값 1)' 
                       : '(8) 투입량 (구성성분 개수)'}
                      <span className='ml-1 text-xs text-gray-500'>
                        {selectedComponentId && selectedComponent?.unit === 'kg' || 
                         !selectedComponentId && newComponent.unit === 'kg' 
                         ? '(kg 단위는 항상 1)' 
                         : '(원자재 1개당 들어가는 수량)'}
                      </span>
                    </label>
                    <input
                      type='number'
                      className='w-full p-2 border border-gray-300 rounded-md'
                      value={
                        selectedComponentId
                          ? selectedComponent?.inputAmount || 0
                          : newComponent.inputAmount
                      }
                      onChange={(e) =>
                        handleInputFieldChange(
                          'inputAmount',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min='0'
                      step='0.001'
                      readOnly={selectedComponentId && selectedComponent?.unit === 'kg' || 
                               !selectedComponentId && newComponent.unit === 'kg'}
                    />
                  </div>
                </div>
                
                {/* 환산합계 표시 */}
                <div className='mt-2 pt-2 border-t border-gray-200'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-medium text-gray-700'>환경 지표:</span>
                    <div className='flex items-center'>
                      <span className='text-sm text-gray-600 mr-2'>총 환산량:</span>
                      <span className='font-medium text-blue-600'>
                        {(selectedMaterial.inputAmount * selectedMaterial.weightConversionFactor).toFixed(2)} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 환경 지표 */}
            <div className='col-span-2'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                환경 지표
              </h4>
              <div className='grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md'>
                {/* 바이오매스 여부 */}
                <div>
                  <div className='flex items-center'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      (10) 바이오매스 여부
                    </label>
                    <Tooltip content='O 선택 시 함량(%) 입력이 필요합니다'>
                      <FaQuestionCircle className='ml-1 text-gray-400 text-sm' />
                    </Tooltip>
                  </div>
                  <select
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterial.bioMassType}
                    onChange={(e) =>
                      onInputChange(
                        selectedMaterial.id,
                        'bioMassType',
                        e.target.value as 'O' | 'X' | ''
                      )
                    }
                  >
                    <option value=''>선택</option>
                    <option value='O'>O</option>
                    <option value='X'>X</option>
                  </select>
                </div>

                {/* 함량(%) */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    (11) 함량(%)
                  </label>
                  <div className='flex items-center'>
                    <input
                      type='number'
                      className='w-full p-2 border border-gray-300 rounded-l-md'
                      min='0'
                      max='100'
                      step='0.1'
                      value={selectedMaterial.bioMassRatio}
                      onChange={(e) =>
                        onInputChange(
                          selectedMaterial.id,
                          'bioMassRatio',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      disabled={selectedMaterial.bioMassType !== 'O'}
                    />
                    <div className='px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md'>
                      %
                    </div>
                  </div>
                </div>

                {/* 배출계수 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    (12) 배출계수
                  </label>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded-md'
                    value={selectedMaterial.emissionCoef}
                    onChange={(e) =>
                      onInputChange(
                        selectedMaterial.id,
                        'emissionCoef',
                        e.target.value
                      )
                    }
                    disabled={selectedMaterial.emissionCoefProvided !== 'O'}
                    placeholder='배출계수 입력'
                  />
                </div>

                {/* 배출계수 단위 - 현재 단위와 연동되는 읽기 전용 필드로 변경 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    (13) 배출계수 단위
                  </label>
                  <div className='w-full p-2 bg-gray-100 border border-gray-300 rounded-md h-10'>
                    {selectedMaterial.emissionCoefProvided === 'O' ? `kg/${selectedMaterial.unit}` : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* 공급 정보 */}
            <div className='col-span-2'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                공급 정보
              </h4>
              <div className='grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md'>
                {/* 공급업체 - 다중 선택 가능하게 변경 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    (14) 공급업체
                  </label>
                  <div className='space-y-2'>
                    <button
                      type='button'
                      className='w-full p-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center'
                      onClick={openSupplierModal}
                    >
                      <span>공급업체 선택</span>
                      <FaPlus size={12} />
                    </button>
                    
                    {/* 선택된 공급업체 태그 표시 */}
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {(selectedMaterial.suppliers || []).map((supplier, index) => (
                        <div
                          key={index}
                          className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center'
                        >
                          <FaTag className='mr-1' size={10} />
                          <span className='mr-1'>{supplier}</span>
                          <button
                            type='button'
                            className='text-blue-600 hover:text-blue-800'
                            onClick={() => removeSupplier(supplier)}
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                      
                      {/* 선택된 공급업체가 없는 경우 안내 메시지 */}
                      {(!selectedMaterial.suppliers || selectedMaterial.suppliers.length === 0) && (
                        <span className='text-gray-500 text-sm'>
                          선택된 공급업체가 없습니다
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 파일첨부 */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    (15) 파일첨부
                  </label>
                  {selectedMaterial.fileAttachment ? (
                    <div className='flex items-center p-2 bg-blue-50 border border-blue-200 rounded-md'>
                      <span className='text-sm text-blue-700 flex-1 truncate'>
                        {selectedMaterial.fileAttachment.name}
                      </span>
                      <button
                        type='button'
                        className='ml-2 text-red-600 hover:text-red-800'
                        onClick={() => onFileDelete(selectedMaterial.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <div className='flex items-center'>
                      <label className='flex items-center p-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200'>
                        <FaUpload className='mr-2' />
                        <span className='text-sm'>파일 업로드</span>
                        <input
                          type='file'
                          className='hidden'
                          onChange={(e) => onFileUpload(selectedMaterial.id, e)}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 혼합물 구성성분 - 사이드바이사이드 레이아웃 */}
            {selectedMaterial.physicalForm === '혼합물' && (
              <div className='col-span-2 mt-4'>
                <div className='flex justify-between items-center mb-3'>
                  <div className='flex items-center'>
                    <h4 className='text-sm font-medium text-gray-700'>
                      구성성분
                    </h4>
                    <span className='ml-2 text-xs text-red-600'>
                      * 구성성분 비율 합산 값이 100%가 되어야 합니다.
                    </span>
                  </div>
                </div>

                <div className='flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4 bg-gray-50 border border-gray-200 rounded-md p-3'>
                  {/* 왼쪽/상단: 구성성분 목록 */}
                  <div className='w-full 2xl:w-1/2 bg-white border border-gray-200 rounded-md overflow-hidden'>
                    <div className='bg-purple-100 px-3 py-2 border-b border-gray-200 flex justify-between items-center'>
                      <div className='flex items-center flex-wrap'>
                        <h5 className='text-sm font-medium text-purple-800'>
                          구성성분 목록
                        </h5>
                        <div
                          className={`ml-2 text-xs ${getRatioColor()} font-medium`}
                        >
                          {selectedMaterial.unit === 'kg' && (
                            <span>(비율 합산: {totalRatio.toFixed(1)}%)</span>
                          )}
                        </div>
                        
                        {/* 환산합계 합산 표시 */}
                        <div className='ml-2 text-xs'>
                          <span>총 환산합계: </span>
                          <span className={`font-medium ${
                            Math.abs(selectedMaterialComponents.reduce((sum, comp) => sum + (comp.totalAmount || 0), 0) - selectedMaterial.totalAmount) < 0.01
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {selectedMaterialComponents.reduce((sum, comp) => sum + (comp.totalAmount || 0), 0).toFixed(2)}kg
                          </span>
                          <span className='mx-1'>/</span>
                          <span className='font-medium text-blue-600'>{selectedMaterial.totalAmount.toFixed(2)}kg</span>
                        </div>
                      </div>
                      <button
                        type='button'
                        className='text-xs px-2 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center'
                        onClick={handleDirectAddComponent}
                      >
                        <FaPlus size={10} className='mr-1' />
                        추가
                      </button>
                    </div>

                    {selectedMaterialComponents.length > 0 ? (
                      <div
                        className='overflow-y-auto'
                        style={{ maxHeight: '300px' }}
                      >
                        <table className='min-w-full divide-y divide-gray-200'>
                          <thead className='bg-gray-50'>
                            <tr>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-500'>
                                재질정보
                              </th>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-500'>
                                단위
                              </th>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-500'>
                                {selectedMaterial.unit === 'kg' ? '비율(%)' : `중량환산계수(kg/${selectedMaterial.unit})`}
                              </th>
                              <th className='px-3 py-2 text-left text-xs font-medium text-gray-500'>
                                환산합계(kg)
                              </th>
                              <th className='px-3 py-2'></th>
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-200 bg-white'>
                            {selectedMaterialComponents.map((component) => (
                              <tr
                                key={component.id}
                                className={`cursor-pointer ${
                                  selectedComponentId === component.id
                                    ? 'bg-blue-50'
                                    : 'hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                  setSelectedComponentId(component.id);
                                  setIsEditingComponent(true);
                                }}
                              >
                                <td className='px-3 py-2 whitespace-nowrap text-sm'>
                                  {component.name || '미지정'}
                                </td>
                                <td className='px-3 py-2 whitespace-nowrap text-sm'>
                                  {component.unit}
                                </td>
                                <td className='px-3 py-2 whitespace-nowrap text-sm'>
                                  {component.ratio}{selectedMaterial.unit === 'kg' ? '%' : ''}
                                </td>
                                <td className='px-3 py-2 whitespace-nowrap text-sm'>
                                  {component.totalAmount?.toFixed(2) || 0}
                                </td>
                                <td className='px-3 py-2 whitespace-nowrap text-right'>
                                  <button
                                    type='button'
                                    className='text-red-600 hover:text-red-800'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteComponent(component.id);
                                      if (
                                        component.id === selectedComponentId
                                      ) {
                                        setSelectedComponentId(null);
                                        setIsEditingComponent(false);
                                      }
                                    }}
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className='p-4 text-center text-sm text-gray-500'>
                        등록된 구성성분이 없습니다
                      </div>
                    )}
                  </div>

                  {/* 오른쪽/하단: 구성성분 상세/편집 */}
                  <div className='w-full 2xl:w-1/2 bg-white border border-gray-200 rounded-md overflow-hidden'>
                    <div className='bg-purple-100 px-3 py-2 border-b border-gray-200 flex justify-between items-center'>
                      <h5 className='text-sm font-medium text-purple-800'>
                        {isEditingComponent
                          ? selectedComponentId
                            ? '구성성분 편집'
                            : '새 구성성분 추가'
                          : '구성성분 상세'}
                      </h5>
                      {isEditingComponent && (
                        <button
                          type='button'
                          className='text-gray-500 hover:text-gray-700'
                          onClick={() => setIsEditingComponent(false)}
                        >
                          <FaTimes size={14} />
                        </button>
                      )}
                    </div>

                    <div className='p-3'>
                      {isEditingComponent ? (
                        /* 편집 모드 */
                        <div className='space-y-3'>
                          {/* 재질정보 */}
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              재질정보
                            </label>
                            <input
                              type='text'
                              className='w-full p-2 border border-gray-300 rounded-md'
                              value={
                                selectedComponentId
                                  ? selectedComponent?.name || ''
                                  : newComponent.name
                              }
                              onChange={(e) =>
                                handleInputFieldChange('name', e.target.value)
                              }
                              placeholder='재질정보 입력'
                            />
                          </div>

                          {/* CAS No. */}
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              CAS No.
                            </label>
                            <input
                              type='text'
                              className='w-full p-2 border border-gray-300 rounded-md'
                              value={
                                selectedComponentId
                                  ? selectedComponent?.casNumber || ''
                                  : newComponent.casNumber
                              }
                              onChange={(e) =>
                                handleInputFieldChange(
                                  'casNumber',
                                  e.target.value
                                )
                              }
                              placeholder='CAS No. 입력'
                            />
                          </div>

                          {/* 단위 */}
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              단위
                            </label>
                            <select
                              className='w-full p-2 border border-gray-300 rounded-md'
                              value={
                                selectedComponentId
                                  ? selectedComponent?.unit || unitOptions[0]
                                  : newComponent.unit
                              }
                              onChange={(e) =>
                                handleInputFieldChange('unit', e.target.value)
                              }
                            >
                              {unitOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 투입량 */}
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              {selectedComponentId && selectedComponent?.unit === 'kg' || 
                               !selectedComponentId && newComponent.unit === 'kg' 
                               ? '(8) 투입량 (kg 단위는 고정값 1)' 
                               : '(8) 투입량 (구성성분 개수)'}
                              <span className='ml-1 text-xs text-gray-500'>
                                {selectedComponentId && selectedComponent?.unit === 'kg' || 
                                 !selectedComponentId && newComponent.unit === 'kg' 
                                 ? '(kg 단위는 항상 1)' 
                                 : '(원자재 1개당 들어가는 수량)'}
                              </span>
                            </label>
                            <input
                              type='number'
                              className='w-full p-2 border border-gray-300 rounded-md'
                              value={
                                selectedComponentId
                                  ? selectedComponent?.inputAmount || 0
                                  : newComponent.inputAmount
                              }
                              onChange={(e) =>
                                handleInputFieldChange(
                                  'inputAmount',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min='0'
                              step='0.001'
                              readOnly={selectedComponentId && selectedComponent?.unit === 'kg' || 
                                       !selectedComponentId && newComponent.unit === 'kg'}
                            />
                          </div>

                          {/* 비율(%) */}
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              {selectedComponentId && selectedComponent?.unit === 'kg' || 
                               !selectedComponentId && newComponent.unit === 'kg' 
                               ? '(9) 비율 (%)' 
                               : '(9) 중량환산계수 (kg/' + (selectedComponentId ? selectedComponent?.unit : newComponent.unit) + ')'}
                              <span className='ml-1 text-xs text-gray-500'>
                                {selectedComponentId && selectedComponent?.unit === 'kg' || 
                                 !selectedComponentId && newComponent.unit === 'kg' 
                                 ? '(비율 합계가 100%가 되어야 함)' 
                                 : '(구성성분 1개당 무게)'}
                              </span>
                            </label>
                            <input
                              type='number'
                              className='w-full p-2 border border-gray-300 rounded-md'
                              value={
                                selectedComponentId
                                  ? selectedComponent?.ratio || 0
                                  : newComponent.ratio
                              }
                              onChange={(e) =>
                                handleInputFieldChange(
                                  'ratio',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min='0'
                              max={selectedComponentId && selectedComponent?.unit === 'kg' || 
                                  !selectedComponentId && newComponent.unit === 'kg' ? '100' : undefined}
                              step='0.1'
                            />
                          </div>

                          {/* 환산합계 */}
                          {selectedComponentId && (
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>
                                (10) 환산합계 (kg)
                                <span className='ml-1 text-xs text-gray-500'>
                                  (원자재의 환산합계와 일치해야 함)
                                </span>
                              </label>
                              <input
                                type='number'
                                className='w-full p-2 border border-gray-300 rounded-md bg-gray-100'
                                value={selectedComponent?.totalAmount || 0}
                                readOnly
                              />
                            </div>
                          )}

                          {/* 저장/취소 버튼 */}
                          <div className='flex justify-end space-x-2 pt-2'>
                            <button
                              type='button'
                              className='px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
                              onClick={() => setIsEditingComponent(false)}
                            >
                              취소
                            </button>
                            <button
                              type='button'
                              className='px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                              onClick={handleSaveComponent}
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : selectedComponentId ? (
                        /* 상세 보기 모드 */
                        <div className='space-y-4'>
                          <div className='grid grid-cols-2 gap-3'>
                            <div>
                              <p className='text-xs text-gray-500 mb-1'>
                                재질정보
                              </p>
                              <p className='font-medium'>
                                {selectedComponent?.name || '-'}
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-500 mb-1'>
                                CAS No.
                              </p>
                              <p className='font-medium'>
                                {selectedComponent?.casNumber || '-'}
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-500 mb-1'>단위</p>
                              <p className='font-medium'>
                                {selectedComponent?.unit || '-'}
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-500 mb-1'>
                                투입량
                              </p>
                              <p className='font-medium'>
                                {selectedComponent?.inputAmount || '0'}
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-500 mb-1'>
                                비율(%)
                              </p>
                              <p className='font-medium'>
                                {selectedComponent?.ratio || '0'}%
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-500 mb-1'>
                                환산합계
                              </p>
                              <p className='font-medium'>
                                {selectedComponent?.totalAmount || '0'}
                              </p>
                            </div>
                          </div>

                          <div className='flex justify-end'>
                            <button
                              type='button'
                              className='flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200'
                              onClick={() => setIsEditingComponent(true)}
                            >
                              <FaEdit className='mr-1' />
                              편집
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* 선택된 구성성분이 없는 경우 */
                        <div className='py-8 text-center text-gray-500'>
                          <p>구성성분을 선택하거나 추가하세요</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 공급업체 선택 모달 */}
      <SupplierModal 
        showModal={showSupplierModal}
        setShowModal={setShowSupplierModal}
        supplierSearchTerm={supplierSearchTerm}
        setSupplierSearchTerm={setSupplierSearchTerm}
        filteredSuppliers={filteredSuppliers}
        selectedSuppliers={selectedSuppliers}
        toggleSupplier={toggleSupplier}
        saveSuppliers={saveSuppliers}
        modalIdPrefix="desktop-supplier" // 데스크탑용 ID prefix
      />
    </div>
  );
};

export default MaterialDeskTopForm;
