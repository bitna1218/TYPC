import React, { useState, useEffect } from 'react';
import {
  FaTrash,
  FaUpload,
  FaQuestionCircle,
  FaPlus,
  FaTimes,
  FaTag,
} from 'react-icons/fa';
import AccordionItem from '../common/AccordionItem';
import SupplierModal from './SupplierModal';

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

// 원자재 폼 인터페이스
interface MaterialFormProps {
  material: Material | undefined;
  components: MaterialComponent[];
  unitOptions: string[];
  physicalFormOptions: string[];
  onDelete: (id: number) => void;
  onInputChange: (id: number, field: keyof Material, value: string | number | File | null | string[]) => void;
  onFileUpload: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDelete: (id: number) => void;
  onAddComponent: (materialId: number) => void;
  onDeleteComponent: (componentId: number) => void;
  onComponentInputChange: (componentId: number, field: keyof MaterialComponent, value: string | number) => void;
  defaultSuppliers: string[];
}

/**
 * 원자재 상세 정보 폼 컴포넌트
 * 
 * 모바일 뷰에서 원자재 상세 정보를 편집하기 위한 폼입니다.
 * 기본 정보, 물질 특성, 수량 정보, 환경 지표, 공급 정보 등을 아코디언 형태로 제공합니다.
 */
const MaterialMobileForm: React.FC<MaterialFormProps> = ({
  material,
  components,
  unitOptions,
  physicalFormOptions,
  onDelete,
  onInputChange,
  onFileUpload,
  onFileDelete,
  onAddComponent,
  onDeleteComponent,
  onComponentInputChange,
  defaultSuppliers,
}) => {
  // 공급업체 선택 모달 상태
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  
  // 선택할 공급업체 상태 (모달에서 사용)
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  
  // 공급업체 검색어 상태
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);

  // material이 변경될 때 selectedSuppliers 업데이트
  useEffect(() => {
    setSelectedSuppliers(material?.suppliers || []);
  }, [material?.suppliers]);

  // supplierSearchTerm 또는 defaultSuppliers가 변경될 때 filteredSuppliers 업데이트
  useEffect(() => {
    if (!supplierSearchTerm.trim()) {
      // 검색어가 없을 때 기본 목록에서 '2.2 - ...' 제외하고 보여주기
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

  // material이 undefined인 경우를 처리
  if (!material) {
    return <div className="text-center text-gray-500 p-4">선택된 원자재가 없습니다.</div>;
  }
  
  // 공급업체 모달 열기
  const openSupplierModal = () => {
    // 현재 선택된 공급업체 상태 초기화
    setSelectedSuppliers(material.suppliers || []);
    setShowSupplierModal(true);
  };
  
  // 공급업체 모달 저장하기
  const saveSuppliers = () => {
    onInputChange(material.id, 'suppliers', selectedSuppliers);
    setShowSupplierModal(false);
  };
  
  // 공급업체 개별 삭제 
  const removeSupplier = (supplier: string) => {
    const updatedSuppliers = (material.suppliers || []).filter(
      (s) => s !== supplier
    );
    onInputChange(material.id, 'suppliers', updatedSuppliers);
  };
  
  // 공급업체 체크박스 토글
  const toggleSupplier = (supplier: string) => {
    if (selectedSuppliers.includes(supplier)) {
      setSelectedSuppliers(selectedSuppliers.filter(s => s !== supplier));
    } else {
      setSelectedSuppliers([...selectedSuppliers, supplier]);
    }
  };

  const { id: materialId } = material; // Destructure id from material safely

  return (
    <div className='border border-gray-200 rounded-md p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='font-medium'>원자재 상세 정보</h3>
        <button
          type='button'
          className='text-red-600 hover:text-red-800 flex items-center'
          onClick={() => onDelete(material.id)}
        >
          <FaTrash size={14} className='mr-1' />
          <span className='text-sm'>삭제</span>
        </button>
      </div>

      {/* 아코디언으로 필드 그룹화 */}
      <div className='space-y-4'>
        {/* 기본 정보 그룹 */}
        <AccordionItem title='기본 정보' defaultOpen={true}>
          <div className='space-y-4'>
            {/* 원자재명 */}
            <div>
              <div className='flex items-center'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  (1) 원자재명{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <Tooltip content='원자재의 이름을 입력하세요'>
                  <FaQuestionCircle className='ml-1 text-gray-400 text-sm' />
                </Tooltip>
              </div>
              <div className='relative'>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  value={material.name}
                  onChange={(e) =>
                    onInputChange(
                      material.id,
                      'name',
                      e.target.value
                    )
                  }
                  placeholder='원자재명 입력'
                />
                {material.name && (
                  <span className='absolute right-2 top-2'>
                    {material.databaseType === 'O' ? (
                      <span className='text-green-600 text-xs px-2 py-1 bg-green-100 rounded-full'>
                        DB 존재
                      </span>
                    ) : material.databaseType === 'X' ? (
                      <span className='text-red-600 text-xs px-2 py-1 bg-red-100 rounded-full'>
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
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.emissionCoefProvided}
                onChange={(e) =>
                  onInputChange(
                    material.id,
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
                  (3) Database 유무{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <Tooltip content={material.name ? '원자재명 입력에 따라 자동 설정됩니다' : 'O 선택 시 (4), (5), (6)이 비활성화됩니다'}>
                  <FaQuestionCircle className='ml-1 text-gray-400 text-sm' />
                </Tooltip>
              </div>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.databaseType}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'databaseType',
                    e.target.value as 'O' | 'X' | ''
                  )
                }
                disabled={material.emissionCoefProvided === 'O' || material.name !== ''}
              >
                <option value=''>선택</option>
                <option value='O'>O</option>
                <option value='X'>X</option>
              </select>
            </div>

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
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.physicalForm}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'physicalForm',
                    e.target.value as '단일물질' | '혼합물' | ''
                  )
                }
                disabled={material.databaseType === 'O'}
              >
                <option value=''>선택</option>
                {physicalFormOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </AccordionItem>

        {/* 물질 특성 그룹 */}
        <AccordionItem title='물질 특성 정보'>
          <div className='space-y-4'>
            {/* 재질정보 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                (5) 재질정보
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.materialInfo}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'materialInfo',
                    e.target.value
                  )
                }
                placeholder='재질정보 입력'
                disabled={material.databaseType === 'O'}
              />
            </div>

            {/* CAS No. */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                (6) CAS No.
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.casNumber}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'casNumber',
                    e.target.value
                  )
                }
                placeholder='CAS No. 입력'
                disabled={material.databaseType === 'O'}
              />
            </div>

            {/* 농도(%) */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                (7) 농도(%)
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.concentration}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'concentration',
                    e.target.value
                  )
                }
                placeholder='농도(%) 입력'
              />
            </div>
          </div>
        </AccordionItem>

        {/* 수량 정보 그룹 */}
        <AccordionItem title='수량 정보'>
          <div className='space-y-4'>
            {/* 단위 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                (8) 단위
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.unit}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'unit',
                    e.target.value
                  )
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
                  (9) 단위 당 중량 (kg/단위)
                </label>
                <Tooltip content='선택한 단위당 kg 중량값을 입력하세요'>
                  <FaQuestionCircle className='ml-1 text-gray-400 text-sm' />
                </Tooltip>
              </div>
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.weightConversionFactor}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'weightConversionFactor',
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder='단위 당 중량 입력'
                min='0'
                step='0.01'
              />
            </div>
          </div>
        </AccordionItem>

        {/* 환경 지표 그룹 */}
        <AccordionItem title='환경 지표'>
          <div className='space-y-4'>
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
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.bioMassType}
                onChange={(e) =>
                  onInputChange(
                    material.id,
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
              <input
                type='number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.bioMassRatio}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'bioMassRatio',
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder='함량(%) 입력'
                min='0'
                max='100'
                step='0.1'
                disabled={material.bioMassType !== 'O'}
              />
            </div>

            {/* 배출계수 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                (12) 배출계수
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                value={material.emissionCoef}
                onChange={(e) =>
                  onInputChange(
                    material.id,
                    'emissionCoef',
                    e.target.value
                  )
                }
                placeholder='배출계수 입력'
                disabled={material.emissionCoefProvided !== 'O'}
              />
            </div>

            {/* 배출계수 단위 - 현재 단위와 연동되는 읽기 전용 필드로 변경 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                (13) 배출계수 단위
              </label>
              <div className='w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md h-10'>
                {material.emissionCoefProvided === 'O' ? `kg/${material.unit}` : ''}
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* 공급 정보 그룹 */}
        <AccordionItem title='공급 정보'>
          <div className='space-y-4'>
            {/* 공급업체 - 다중 선택 가능하게 변경 */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                (14) 공급업체
              </label>
              <div className='space-y-2'>
                <button
                  type='button'
                  className='w-full px-3 py-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center'
                  onClick={openSupplierModal}
                >
                  <span>공급업체 선택</span>
                  <FaPlus size={12} />
                </button>
                
                {/* 선택된 공급업체 태그 표시 */}
                <div className='flex flex-wrap gap-2 mt-2'>
                  {(material.suppliers || []).map((supplier, index) => (
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
                  {(!material.suppliers || material.suppliers.length === 0) && (
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
              <div className='flex items-center space-x-2'>
                <label className='flex-1 flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-300 cursor-pointer hover:bg-blue-100'>
                  <FaUpload className='mr-2' size={14} />
                  <span>
                    {material.fileAttachment
                      ? material.fileAttachment.name
                      : '파일 선택'}
                  </span>
                  <input
                    type='file'
                    className='hidden'
                    onChange={(e) => onFileUpload(material.id, e)}
                    accept='.pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx'
                  />
                </label>

                {material.fileAttachment && (
                  <button
                    type='button'
                    className='px-3 py-2 bg-red-50 text-red-700 border border-red-300 rounded-md hover:bg-red-100'
                    onClick={() => onFileDelete(material.id)}
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* 구성성분 목록 (혼합물인 경우만) */}
        {material.physicalForm === '혼합물' && (
          <AccordionItem title="구성성분" defaultOpen={true}>
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h4 className="text-md font-medium text-gray-800">구성성분</h4>
                  <Tooltip content="혼합물의 모든 구성 성분을 입력하고, 비율(%)의 합이 100%가 되어야 합니다.">
                    <FaQuestionCircle className="ml-1 text-gray-400 text-sm" />
                  </Tooltip>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none text-sm flex items-center"
                  onClick={() => onAddComponent(material.id)}
                >
                  <FaPlus className="mr-1" size={12} />
                  <span>성분 추가</span>
                </button>
              </div>
              
              {components.length === 0 ? (
                <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-md">
                  구성성분을 추가해주세요
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {components.map(component => (
                      <div key={component.id} className="border border-gray-200 p-3 rounded-md bg-white shadow-sm">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-sm">구성성분 #{component.id}</span>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => onDeleteComponent(component.id)}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700">재질정보</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                              value={component.name}
                              onChange={(e) => onComponentInputChange(component.id, 'name', e.target.value)}
                              placeholder="재질정보 입력"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700">CAS No.</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                              value={component.casNumber}
                              onChange={(e) => onComponentInputChange(component.id, 'casNumber', e.target.value)}
                              placeholder="CAS No. 입력"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700">단위</label>
                            <select
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                              value={component.unit}
                              onChange={(e) => onComponentInputChange(component.id, 'unit', e.target.value)}
                            >
                              {unitOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700">투입량</label>
                            <input
                              type="number"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                              value={component.inputAmount}
                              onChange={(e) => onComponentInputChange(component.id, 'inputAmount', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              placeholder="투입량 입력"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700">비율(%)</label>
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                value={component.ratio}
                                onChange={(e) => onComponentInputChange(component.id, 'ratio', parseFloat(e.target.value) || 0)}
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="비율(%) 입력"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700">환산합계</label>
                              <div className="w-full px-2 py-1 text-sm bg-gray-100 border border-gray-300 rounded-md">
                                {component.totalAmount.toFixed(2)} {component.unit}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 합계 표시 */}
                  <div className="mt-4 flex justify-end items-center px-3 py-2 bg-gray-100 rounded-md">
                    <span className="font-medium text-sm mr-4">합계:</span>
                    <span className="font-bold">
                      {components.reduce((sum, comp) => sum + comp.ratio, 0).toFixed(1)}%
                    </span>
                  </div>
                  
                  {/* 경고 메시지 */}
                  {Math.abs(components.reduce((sum, comp) => sum + comp.ratio, 0) - 100) > 0.1 && (
                    <div className="mt-2 text-red-500 text-sm">
                      * 구성성분 비율의 합은 100%가 되어야 합니다.
                    </div>
                  )}
                </>
              )}
            </div>
          </AccordionItem>
        )}
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
        modalIdPrefix={`mobile-supplier-${materialId}`}
      />
    </div>
  );
};

export default MaterialMobileForm; 