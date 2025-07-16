import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaTimes, FaTag } from 'react-icons/fa';
import SupplierModal from './SupplierModal';

// 포장재 인터페이스
interface PackagingMaterial {
  id: number;
  name: string;
  materialInfo: string;
  casNumber: string;
  unit: string;
  weightConversionFactor: number;
  suppliers: string[];
}

// 데스크탑 폼 컴포넌트 인터페이스
interface PackagingDeskTopFormProps {
  packagingMaterials: PackagingMaterial[];
  selectedPackagingMaterialId: number | null;
  unitOptions: string[];
  onSelectPackagingMaterial: (id: number) => void;
  onInputChange: (
    id: number,
    field: keyof PackagingMaterial,
    value: string | number | string[]
  ) => void;
  onDeletePackagingMaterial: (id: number) => void;
  defaultSuppliers: string[];
}

const PackagingDeskTopForm: React.FC<PackagingDeskTopFormProps> = ({
  packagingMaterials,
  selectedPackagingMaterialId,
  unitOptions,
  onSelectPackagingMaterial,
  onInputChange,
  onDeletePackagingMaterial,
  defaultSuppliers,
}) => {
  const selectedMaterial =
    packagingMaterials.find((m) => m.id === selectedPackagingMaterialId) ||
    packagingMaterials[0];

  // 공급업체 모달 상태 (내부 관리)
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);

  useEffect(() => {
    // 선택된 포장재가 변경되면 해당 포장재의 공급업체로 selectedSuppliers를 업데이트합니다.
    const currentMaterial = packagingMaterials.find(
      (m) => m.id === selectedPackagingMaterialId
    );
    setSelectedSuppliers(currentMaterial?.suppliers || []);
  }, [selectedPackagingMaterialId, packagingMaterials]);

  useEffect(() => {
    // 검색어나 기본 공급업체 목록이 변경되면 필터링된 공급업체 목록을 업데이트합니다.
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

  const handleToggleSupplier = (supplier: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplier)
        ? prev.filter((s) => s !== supplier)
        : [...prev, supplier]
    );
  };

  const handleSaveSuppliers = () => {
    if (selectedPackagingMaterialId) {
      onInputChange(
        selectedPackagingMaterialId,
        'suppliers',
        selectedSuppliers
      );
    }
    setShowSupplierModal(false);
  };

  const handleOpenSupplierModal = (materialId: number) => {
    onSelectPackagingMaterial(materialId); // Ensure the correct material is selected for context
    const material = packagingMaterials.find((m) => m.id === materialId);
    setSelectedSuppliers(material?.suppliers || []); // Initialize modal with current suppliers
    setShowSupplierModal(true);
  };

  if (!selectedMaterial) {
    return (
      <div className='hidden lg:block text-center text-gray-500 p-4'>
        포장재를 추가해주세요.
      </div>
    );
  }

  return (
    <div className='hidden lg:block mt-6'>
      <div className='overflow-x-auto bg-white border border-gray-200 rounded-md'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                (1) 포장재명
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                (2) 재질정보
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                (3) CAS No.
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                (4) 단위
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                (5) 단위 당 중량 (kg/단위)
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                (6) 공급업체
              </th>
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                작업
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {packagingMaterials.map((material) => (
              <tr
                key={material.id}
                className={`${
                  selectedPackagingMaterialId === material.id
                    ? 'bg-blue-50'
                    : ''
                }
                             hover:bg-gray-50 cursor-pointer`}
                onClick={() => onSelectPackagingMaterial(material.id)}
              >
                <td className='px-4 py-3 whitespace-nowrap'>
                  <input
                    type='text'
                    className={`w-full p-2 border rounded-md border-gray-300`}
                    value={material.name}
                    onChange={(e) =>
                      onInputChange(material.id, 'name', e.target.value)
                    }
                    placeholder='포장재명'
                  />
                </td>
                <td className='px-4 py-3 whitespace-nowrap'>
                  <input
                    type='text'
                    className={`w-full p-2 border rounded-md border-gray-300`}
                    value={material.materialInfo}
                    onChange={(e) =>
                      onInputChange(material.id, 'materialInfo', e.target.value)
                    }
                    placeholder='재질정보'
                  />
                </td>
                <td className='px-4 py-3 whitespace-nowrap'>
                  <input
                    type='text'
                    className={`w-full p-2 border rounded-md border-gray-300`}
                    value={material.casNumber}
                    onChange={(e) =>
                      onInputChange(material.id, 'casNumber', e.target.value)
                    }
                    placeholder='CAS No.'
                  />
                </td>
                <td className='px-4 py-3 whitespace-nowrap'>
                  <select
                    className={`w-full p-2 border rounded-md border-gray-300`}
                    value={material.unit}
                    onChange={(e) =>
                      onInputChange(material.id, 'unit', e.target.value)
                    }
                  >
                    {unitOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className='px-4 py-3 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <input
                      type='number'
                      className={`w-full p-2 border-l border-t border-b rounded-l-md border-gray-300`}
                      value={material.weightConversionFactor}
                      onChange={(e) =>
                        onInputChange(
                          material.id,
                          'weightConversionFactor',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder='단위 당 중량'
                      min='0'
                      step='0.001'
                    />
                    <span
                      className={`px-3 py-2 border-r border-t border-b rounded-r-md bg-gray-100 text-gray-600 text-sm ${
                        selectedPackagingMaterialId === material.id
                          ? 'border-yellow-300'
                          : 'border-gray-300'
                      }`}
                    >
                      kg/{material.unit || '단위'}
                    </span>
                  </div>
                </td>
                <td className='px-4 py-3 whitespace-nowrap'>
                  <div className='flex items-center space-x-2'>
                    <button
                      type='button'
                      className='text-sm text-blue-600 hover:text-blue-800 flex items-center p-1 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-md'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSupplierModal(material.id);
                      }}
                    >
                      <FaEdit className='mr-1' /> 선택
                    </button>
                    <div className='flex flex-wrap gap-1 max-w-[150px] overflow-hidden'>
                      {(material.suppliers || []).map((supplier, index) => (
                        <span
                          key={index}
                          className='px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center'
                        >
                          <FaTag className='mr-1' />
                          {supplier}
                          <button
                            type='button'
                            className='ml-1 text-blue-500 hover:text-blue-700'
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedSuppliers = (
                                material.suppliers || []
                              ).filter((s) => s !== supplier);
                              onInputChange(
                                material.id,
                                'suppliers',
                                updatedSuppliers
                              );
                            }}
                          >
                            <FaTimes size={10} />
                          </button>
                        </span>
                      ))}
                      {(!material.suppliers ||
                        material.suppliers.length === 0) && (
                        <span className='text-xs text-gray-400 italic'>
                          없음
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-center'>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePackagingMaterial(material.id);
                    }}
                    className='text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50'
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 공급업체 모달 */}
      {selectedMaterial && (
        <SupplierModal
          showModal={showSupplierModal}
          setShowModal={setShowSupplierModal}
          supplierSearchTerm={supplierSearchTerm}
          setSupplierSearchTerm={setSupplierSearchTerm}
          filteredSuppliers={filteredSuppliers}
          selectedSuppliers={selectedSuppliers}
          toggleSupplier={handleToggleSupplier}
          saveSuppliers={handleSaveSuppliers}
          modalIdPrefix={`packaging-desktop-supplier-${selectedMaterial.id}`}
        />
      )}
    </div>
  );
};

export default PackagingDeskTopForm;
