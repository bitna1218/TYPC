import React, { useState, useEffect } from 'react';
import {
  FaTrash,
  FaEdit,
  FaTimes,
  FaTag,
  FaQuestionCircle,
} from 'react-icons/fa';
import SupplierModal from './SupplierModal';

// 포장재 인터페이스 (PurchasesTabContent.tsx와 동일하게 유지)
interface PackagingMaterial {
  id: number;
  name: string; // (1) 포장재명
  materialInfo: string; // (2) 재질정보
  casNumber: string; // (3) CAS No.
  unit: string; // (4) 단위
  weightConversionFactor: number; // (5) 단위 당 중량 (kg/단위)
  suppliers: string[]; // (6) 공급업체
}

// 모바일 폼 컴포넌트 인터페이스
interface PackagingMobileFormProps {
  packagingMaterial: PackagingMaterial | undefined;
  unitOptions: string[];
  onDelete: (id: number) => void;
  onInputChange: (
    id: number,
    field: keyof PackagingMaterial,
    value: string | number | string[]
  ) => void;
  defaultSuppliers: string[]; // 부모로부터 기본 공급업체 목록을 받음
}

const PackagingMobileForm: React.FC<PackagingMobileFormProps> = ({
  packagingMaterial,
  unitOptions,
  onDelete,
  onInputChange,
  defaultSuppliers,
}) => {
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);

  useEffect(() => {
    // packagingMaterial이 변경될 때 selectedSuppliers 업데이트
    setSelectedSuppliers(packagingMaterial?.suppliers || []);
  }, [packagingMaterial?.suppliers]);

  useEffect(() => {
    // supplierSearchTerm 또는 defaultSuppliers가 변경될 때 filteredSuppliers 업데이트
    if (!supplierSearchTerm.trim()) {
      setFilteredSuppliers(
        defaultSuppliers.filter((s) => s !== '2.2 - (1) 공급업체명 (다중선택)')
      );
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

  if (!packagingMaterial) {
    return (
      <div className='text-center text-gray-500 p-4'>
        선택된 포장재가 없습니다.
      </div>
    );
  }

  const {
    id,
    name,
    materialInfo,
    casNumber,
    unit,
    weightConversionFactor,
    suppliers,
  } = packagingMaterial;

  const handleToggleSupplier = (supplier: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplier)
        ? prev.filter((s) => s !== supplier)
        : [...prev, supplier]
    );
  };

  const handleSaveSuppliers = () => {
    onInputChange(id, 'suppliers', selectedSuppliers);
    setShowSupplierModal(false);
  };

  const handleRemoveSupplier = (supplierToRemove: string) => {
    const updatedSuppliers = (suppliers || []).filter(
      (s) => s !== supplierToRemove
    );
    onInputChange(id, 'suppliers', updatedSuppliers);
  };

  // 임시 Tooltip 컴포넌트 (경로 문제 해결 전까지)
  const Tooltip = ({
    children,
    content,
  }: {
    children: React.ReactNode;
    content: string;
  }) => (
    <div className='relative group'>
      {children}
      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
        {content}
      </div>
    </div>
  );

  return (
    <div className='bg-white shadow rounded-lg p-4 space-y-6'>
      {/* 포장재명 */}
      <div>
        <label
          htmlFor={`packaging-name-${id}`}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          (1) 포장재명 <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          id={`packaging-name-${id}`}
          className='w-full px-3 py-2 bg-yellow-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          value={name}
          onChange={(e) => onInputChange(id, 'name', e.target.value)}
          placeholder='포장재명 입력'
        />
      </div>

      {/* 재질정보 */}
      <div>
        <label
          htmlFor={`packaging-material-info-${id}`}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          (2) 재질정보
        </label>
        <input
          type='text'
          id={`packaging-material-info-${id}`}
          className='w-full px-3 py-2 bg-yellow-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          value={materialInfo}
          onChange={(e) => onInputChange(id, 'materialInfo', e.target.value)}
          placeholder='재질정보 입력'
        />
      </div>

      {/* CAS No. */}
      <div>
        <label
          htmlFor={`packaging-cas-${id}`}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          (3) CAS No.
        </label>
        <input
          type='text'
          id={`packaging-cas-${id}`}
          className='w-full px-3 py-2 bg-yellow-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          value={casNumber}
          onChange={(e) => onInputChange(id, 'casNumber', e.target.value)}
          placeholder='CAS No. 입력'
        />
      </div>

      {/* 단위 */}
      <div>
        <label
          htmlFor={`packaging-unit-${id}`}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          (4) 단위
        </label>
        <select
          id={`packaging-unit-${id}`}
          className='w-full px-3 py-2 bg-orange-100 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          value={unit}
          onChange={(e) => onInputChange(id, 'unit', e.target.value)}
        >
          {unitOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* 단위 당 중량 */}
      <div>
        <div className='flex items-center mb-1'>
          <label
            htmlFor={`packaging-weight-factor-${id}`}
            className='block text-sm font-medium text-gray-700'
          >
            (5) 단위 당 중량 (kg/단위)
          </label>
          <Tooltip content='선택한 단위당 kg 중량값을 입력하세요. 예: 1개 당 0.5kg이면 0.5 입력'>
            <FaQuestionCircle className='ml-1 text-gray-400 text-xs cursor-help' />
          </Tooltip>
        </div>
        <input
          type='number'
          id={`packaging-weight-factor-${id}`}
          className='w-full px-3 py-2 bg-yellow-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          value={weightConversionFactor}
          onChange={(e) =>
            onInputChange(
              id,
              'weightConversionFactor',
              parseFloat(e.target.value) || 0
            )
          }
          placeholder='단위 당 중량 입력'
          min='0'
          step='0.001' // 더 정밀한 입력 허용
        />
      </div>

      {/* 공급업체 */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-gray-700'>
          (6) 공급업체
        </label>
        <div className='flex flex-wrap gap-2'>
          {(suppliers || []).map((supplier, index) => (
            <span
              key={index}
              className='px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full flex items-center'
            >
              <FaTag className='mr-2' />
              {supplier}
              <button
                type='button'
                className='ml-2 text-blue-500 hover:text-blue-700'
                onClick={() => handleRemoveSupplier(supplier)}
              >
                <FaTimes size={12} />
              </button>
            </span>
          ))}
          {(!suppliers || suppliers.length === 0) && (
            <span className='text-xs text-gray-400 italic'>
              선택된 공급업체 없음
            </span>
          )}
        </div>
        <button
          type='button'
          className='mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center'
          onClick={() => {
            // 모달 열기 전, 현재 포장재의 공급업체로 selectedSuppliers 상태 초기화
            setSelectedSuppliers(packagingMaterial.suppliers || []);
            setShowSupplierModal(true);
          }}
        >
          <FaEdit className='mr-1' /> 공급업체 선택/수정
        </button>
      </div>

      {/* 삭제 버튼 */}
      <div className='flex justify-end mt-6'>
        <button
          type='button'
          onClick={() => onDelete(id)}
          className='px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 flex items-center transition ease-in-out duration-150'
        >
          <FaTrash className='mr-2' /> 포장재 삭제
        </button>
      </div>

      {/* 공급업체 모달 */}
      <SupplierModal
        showModal={showSupplierModal}
        setShowModal={setShowSupplierModal}
        supplierSearchTerm={supplierSearchTerm}
        setSupplierSearchTerm={setSupplierSearchTerm}
        filteredSuppliers={filteredSuppliers} // 필터링된 목록 전달
        selectedSuppliers={selectedSuppliers} // 현재 선택된 공급업체들 전달
        toggleSupplier={handleToggleSupplier} // 선택 토글 함수 전달
        saveSuppliers={handleSaveSuppliers} // 저장 함수 전달
        modalIdPrefix={`packaging-mobile-supplier-${id}`} // 고유 ID prefix
      />
    </div>
  );
};

export default PackagingMobileForm;
