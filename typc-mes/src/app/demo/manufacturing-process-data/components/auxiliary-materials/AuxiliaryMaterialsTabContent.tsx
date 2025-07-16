'use client';

import React, { useState, useEffect } from 'react';
import {
  FaInfoCircle,
  FaSave,
  FaUpload,
  FaPlus,
  FaTimes,
  FaTag,
} from 'react-icons/fa';
import Tooltip from '../Tooltip';

// 인터페이스 정의
interface AuxiliaryMaterial {
  id: string;
  name: string;
  unit: string;
}

interface UnitProcess {
  id: string;
  name: string;
}

interface MonthlyUsageData {
  month: number;
  amount: number;
}

interface AuxiliaryMaterialUsageInput {
  materialId: string;
  materialName: string;
  selectedUnitProcesses: string[];
  unit: string;
  monthlyUsage: MonthlyUsageData[];
  totalAmount: number;
  dqi: 'M' | 'C' | 'E' | '';
  remarks: string;
  attachedFile?: File | null;
}

interface MaterialAllocation {
  materialId: string;
  materialName: string;
  unitProcessAllocations: {
    unitProcessId: string;
    unitProcessName: string;
    ratio: number;
  }[];
  totalRatio: number;
}

interface AuxiliaryMaterialsTabContentProps {
  siteId?: string;
}

// 더미 데이터 - 선택 가능한 부자재 목록
const AVAILABLE_AUXILIARY_MATERIALS: AuxiliaryMaterial[] = [
  { id: 'aux1', name: '첨가제 A', unit: 'kg' },
  { id: 'aux2', name: '윤활유', unit: 'L' },
  { id: 'aux3', name: '포장재', unit: 'EA' },
  { id: 'aux4', name: '접착제', unit: 'kg' },
  { id: 'aux5', name: '청소용 화학제', unit: 'L' },
  { id: 'aux6', name: '세정제', unit: 'L' },
  { id: 'aux7', name: '코팅제', unit: 'kg' },
  { id: 'aux8', name: '방부제', unit: 'kg' },
  { id: 'aux9', name: '윤활제', unit: 'L' },
  { id: 'aux10', name: '산업용 가스', unit: 'm³' },
];

const DUMMY_UNIT_PROCESSES: UnitProcess[] = [
  { id: 'unit1', name: '단위공정 1' },
  { id: 'unit2', name: '단위공정 2' },
  { id: 'unit3', name: '단위공정 4' },
  { id: 'unit4', name: '단위공정 5' },
  { id: 'unit5', name: '단위공정 7' },
  { id: 'unit6', name: '단위공정 8' },
  { id: 'unit7', name: '단위공정 9' },
];

const DQI_OPTIONS = [
  { value: 'M', label: 'M' },
  { value: 'C', label: 'C' },
  { value: 'E', label: 'E' },
];

const AuxiliaryMaterialsTabContent: React.FC<
  AuxiliaryMaterialsTabContentProps
> = ({ siteId }) => {
  const [usageData, setUsageData] = useState<AuxiliaryMaterialUsageInput[]>([]);
  const [allocationMethod, setAllocationMethod] = useState<
    '제품 생산량' | '비율 직접 입력'
  >('제품 생산량');
  const [materialAllocations, setMaterialAllocations] = useState<
    MaterialAllocation[]
  >([]);
  const [showUnitProcessModal, setShowUnitProcessModal] = useState(false);
  const [currentEditingMaterialId, setCurrentEditingMaterialId] = useState<
    string | null
  >(null);
  const [tempSelectedProcesses, setTempSelectedProcesses] = useState<string[]>(
    []
  );
  const [ratioMethodDescription, setRatioMethodDescription] = useState<string>('');
  const [attachedRatioFile, setAttachedRatioFile] = useState<File | null>(null);

  // 초기 데이터 생성 (빈 배열로 시작)
  useEffect(() => {
    if (siteId) {
    }
    // 처음엔 빈 배열로 시작
    setUsageData([]);
  }, [siteId]);

  // 부자재 행 추가
  const addAuxiliaryMaterialRow = () => {
    const newId = `aux_${Date.now()}`;
    const newRow: AuxiliaryMaterialUsageInput = {
      materialId: newId,
      materialName: '',
      selectedUnitProcesses: [],
      unit: '',
      monthlyUsage: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        amount: 0,
      })),
      totalAmount: 0,
      dqi: '',
      remarks: '',
      attachedFile: null,
    };
    setUsageData((prev) => [...prev, newRow]);
  };

  // 부자재 행 삭제
  const removeAuxiliaryMaterialRow = (materialId: string) => {
    setUsageData((prev) => prev.filter((item) => item.materialId !== materialId));
  };

  // 부자재 선택
  const handleMaterialSelect = (materialId: string, selectedAuxMaterialId: string) => {
    const selectedMaterial = AVAILABLE_AUXILIARY_MATERIALS.find(
      (material) => material.id === selectedAuxMaterialId
    );
    
    if (selectedMaterial) {
      setUsageData((prev) =>
        prev.map((item) =>
          item.materialId === materialId
            ? {
                ...item,
                materialName: selectedMaterial.name,
                unit: selectedMaterial.unit,
              }
            : item
        )
      );
    }
  };

  // 할당 데이터 업데이트 - 단위공정이 선택된 항목이 있으면 자동으로 할당 데이터 생성
  useEffect(() => {
    const allocations: MaterialAllocation[] = usageData
      .filter((item) => item.selectedUnitProcesses.length > 0)
      .map((item) => ({
        materialId: item.materialId,
        materialName: item.materialName,
        unitProcessAllocations: item.selectedUnitProcesses.map(
          (processId) => {
            const process = DUMMY_UNIT_PROCESSES.find(
              (p) => p.id === processId
            );
            
            // 제품 생산량 기반 자동 계산 (더미 데이터로 균등 분배)
            const autoRatio = allocationMethod === '제품 생산량'
              ? Math.round((100 / item.selectedUnitProcesses.length) * 10) / 10
              : 0;
              
            return {
              unitProcessId: processId,
              unitProcessName: process?.name || '',
              ratio: autoRatio,
            };
          }
        ),
        totalRatio: allocationMethod === '제품 생산량' ? 100 : 0,
      }));
    setMaterialAllocations(allocations);
  }, [allocationMethod, usageData]);

  // 월별 사용량 변경
  const handleMonthlyUsageChange = (
    materialId: string,
    month: number,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;

    setUsageData((prev) =>
      prev.map((item) => {
        if (item.materialId === materialId) {
          const updatedMonthlyUsage = item.monthlyUsage.map((monthData) =>
            monthData.month === month
              ? { ...monthData, amount: numValue }
              : monthData
          );
          const totalAmount = updatedMonthlyUsage.reduce(
            (sum, data) => sum + data.amount,
            0
          );

          return {
            ...item,
            monthlyUsage: updatedMonthlyUsage,
            totalAmount,
          };
        }
        return item;
      })
    );
  };

  // 단위공정 선택 모달 열기
  const openUnitProcessModal = (materialId: string) => {
    const material = usageData.find((item) => item.materialId === materialId);
    if (material) {
      setCurrentEditingMaterialId(materialId);
      setTempSelectedProcesses([...material.selectedUnitProcesses]);
      setShowUnitProcessModal(true);
    }
  };

  // 단위공정 선택 토글
  const toggleUnitProcess = (processId: string) => {
    setTempSelectedProcesses((prev) =>
      prev.includes(processId)
        ? prev.filter((id) => id !== processId)
        : [...prev, processId]
    );
  };

  // 전체선택 토글
  const toggleSelectAll = () => {
    const isAllSelected = tempSelectedProcesses.length === DUMMY_UNIT_PROCESSES.length;
    if (isAllSelected) {
      setTempSelectedProcesses([]);
    } else {
      setTempSelectedProcesses(DUMMY_UNIT_PROCESSES.map(process => process.id));
    }
  };

  // 단위공정 선택 저장
  const saveUnitProcessSelection = () => {
    if (currentEditingMaterialId) {
      setUsageData((prev) =>
        prev.map((item) =>
          item.materialId === currentEditingMaterialId
            ? { ...item, selectedUnitProcesses: [...tempSelectedProcesses] }
            : item
        )
      );
    }
    setShowUnitProcessModal(false);
    setCurrentEditingMaterialId(null);
  };

  // 단위공정 제거
  const removeUnitProcess = (materialId: string, processId: string) => {
    setUsageData((prev) =>
      prev.map((item) =>
        item.materialId === materialId
          ? {
              ...item,
              selectedUnitProcesses: item.selectedUnitProcesses.filter(
                (id) => id !== processId
              ),
            }
          : item
      )
    );
  };

  // DQI 변경
  const handleDQIChange = (materialId: string, dqi: 'M' | 'C' | 'E' | '') => {
    setUsageData((prev) =>
      prev.map((item) =>
        item.materialId === materialId ? { ...item, dqi } : item
      )
    );
  };

  // 비고 변경
  const handleRemarksChange = (materialId: string, remarks: string) => {
    setUsageData((prev) =>
      prev.map((item) =>
        item.materialId === materialId ? { ...item, remarks } : item
      )
    );
  };

  // 파일 변경
  const handleFileChange = (materialId: string, file: File | null) => {
    setUsageData((prev) =>
      prev.map((item) =>
        item.materialId === materialId ? { ...item, attachedFile: file } : item
      )
    );
  };

  // 비율 변경
  const handleRatioChange = (
    materialId: string,
    processId: string,
    ratio: number
  ) => {
    setMaterialAllocations((prev) =>
      prev.map((allocation) => {
        if (allocation.materialId === materialId) {
          const updatedAllocations = allocation.unitProcessAllocations.map(
            (process) =>
              process.unitProcessId === processId
                ? { ...process, ratio }
                : process
          );
          const totalRatio = updatedAllocations.reduce(
            (sum, process) => sum + process.ratio,
            0
          );

          return {
            ...allocation,
            unitProcessAllocations: updatedAllocations,
            totalRatio,
          };
        }
        return allocation;
      })
    );
  };

  // 저장
  const handleSave = () => {
    console.log('Usage Data:', usageData);
    console.log('Allocation Data:', materialAllocations);
    alert('부자재 사용량 데이터가 저장되었습니다.');
  };

  // 단위공정 모달 렌더링
  const renderUnitProcessModal = () => {
    if (!showUnitProcessModal) return null;

    const isAllSelected = tempSelectedProcesses.length === DUMMY_UNIT_PROCESSES.length;
    const isPartiallySelected = tempSelectedProcesses.length > 0 && tempSelectedProcesses.length < DUMMY_UNIT_PROCESSES.length;

    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg shadow-xl w-full max-w-md p-6'>
          <h3 className='text-lg font-medium mb-4'>투입 단위공정 선택</h3>

          {/* 전체선택 체크박스 */}
          <div className='flex items-center p-3 mb-2 bg-gray-50 border border-gray-300 rounded-md'>
            <input
              type='checkbox'
              id='select-all-processes'
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isPartiallySelected;
              }}
              onChange={toggleSelectAll}
              className='mr-3'
            />
            <label
              htmlFor='select-all-processes'
              className='flex-1 cursor-pointer font-medium text-gray-700'
            >
              전체선택 ({tempSelectedProcesses.length}/{DUMMY_UNIT_PROCESSES.length})
            </label>
          </div>

          <div className='max-h-60 overflow-y-auto border border-gray-200 rounded-md mb-4'>
            {DUMMY_UNIT_PROCESSES.map((process) => (
              <div
                key={process.id}
                className='flex items-center p-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0'
              >
                <input
                  type='checkbox'
                  id={`process-${process.id}`}
                  checked={tempSelectedProcesses.includes(process.id)}
                  onChange={() => toggleUnitProcess(process.id)}
                  className='mr-3'
                />
                <label
                  htmlFor={`process-${process.id}`}
                  className='flex-1 cursor-pointer'
                >
                  {process.name}
                </label>
              </div>
            ))}
          </div>

          <div className='mb-4 text-sm'>
            <span className='font-medium'>선택됨: </span>
            <span>{tempSelectedProcesses.length}개</span>
          </div>

          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
              onClick={() => setShowUnitProcessModal(false)}
            >
              취소
            </button>
            <button
              type='button'
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              onClick={saveUnitProcessSelection}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 데스크톱 테이블 렌더링
  const renderDesktopTable = () => (
    <div>
      {/* 추가 버튼 */}
      <div className='mb-4 flex justify-end'>
        <button
          type='button'
          onClick={addAuxiliaryMaterialRow}
          className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center text-sm'
        >
          <FaPlus className='mr-2' />
          부자재 추가
        </button>
      </div>
      
      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse border border-gray-300'>
        <thead className='bg-blue-100'>
          <tr>
            <th
              colSpan={3}
              className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm'
            >
              부자재 정보
            </th>
            <th
              colSpan={13}
              className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm'
            >
              (5) 월별 부자재 투입량 데이터
            </th>
            <th
              rowSpan={2}
              className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm min-w-[80px]'
            >
              데이터 품질정보
              <br />
              (6)
              <br />
              DQI
            </th>
            <th
              rowSpan={2}
              className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm min-w-[100px]'
            >
              (7)
              <br />
              비고
            </th>
            <th
              rowSpan={2}
              className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm min-w-[100px]'
            >
              (8)
              <br />
              파일첨부
            </th>
            <th
              rowSpan={2}
              className='border border-gray-300 px-2 py-3 font-medium text-gray-700 text-sm min-w-[80px]'
            >
              삭제
            </th>
          </tr>
          <tr>
            <th
              className='border border-gray-300 px-2 py-2 font-medium text-gray-700 text-sm min-w-[120px]'
            >
              (1)
              <br />
              부자재명
            </th>
            <th
              className='border border-gray-300 px-2 py-2 font-medium text-gray-700 text-sm min-w-[150px]'
            >
              (2)
              <br />
              투입 단위공정
              <Tooltip
                text='단위공정 목록에서 다중 선택합니다.'
                position='bottom'
              >
                <FaInfoCircle className='text-gray-400 hover:text-gray-600 cursor-pointer' />
              </Tooltip>
            </th>
            <th
              className='border border-gray-300 px-2 py-2 font-medium text-gray-700 text-sm min-w-[80px]'
            >
              (3)
              <br />
              단위
            </th>
            <th
              className='border border-gray-300 px-2 py-2 font-medium text-gray-700 text-sm min-w-[100px]'
            >
              (4)
              <br />
              합계
            </th>
            {Array.from({ length: 12 }, (_, i) => (
              <th
                key={i}
                className='border border-gray-300 px-1 py-2 font-medium text-gray-700 text-xs min-w-[80px]'
              >
                {i + 1}월
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white'>
          {usageData.length === 0 ? (
            <tr>
              <td 
                colSpan={17} 
                className='border border-gray-300 px-4 py-8 text-center text-gray-500'
              >
                부자재 추가 버튼을 클릭하여 부자재를 추가해주세요.
              </td>
            </tr>
          ) : (
            usageData.map((item) => (
              <tr key={item.materialId} className='hover:bg-gray-50'>
                {/* 부자재명 - 선택 */}
                <td className='border border-gray-300 px-2 py-2'>
                  <select
                    value={item.materialName ? AVAILABLE_AUXILIARY_MATERIALS.find(m => m.name === item.materialName)?.id || '' : ''}
                    onChange={(e) => handleMaterialSelect(item.materialId, e.target.value)}
                    className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500'
                  >
                    <option value=''>부자재 선택</option>
                    {AVAILABLE_AUXILIARY_MATERIALS.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </td>

              {/* 투입 단위공정 - 다중 선택 */}
              <td className='border border-gray-300 px-2 py-2'>
                <div className='space-y-1'>
                  <button
                    type='button'
                    onClick={() => openUnitProcessModal(item.materialId)}
                    className='w-full text-xs py-1 px-2 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center'
                  >
                    <span>
                      단위공정 선택 ({item.selectedUnitProcesses.length})
                    </span>
                    <FaPlus size={10} />
                  </button>
                  <div className='flex flex-wrap gap-1 mt-1'>
                    {item.selectedUnitProcesses.map((processId) => {
                      const process = DUMMY_UNIT_PROCESSES.find(
                        (p) => p.id === processId
                      );
                      return (
                        <div
                          key={processId}
                          className='bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs flex items-center'
                        >
                          <FaTag className='mr-1' size={9} />
                          <span className='mr-0.5'>{process?.name}</span>
                          <button
                            type='button'
                            className='text-blue-600 hover:text-blue-800'
                            onClick={() =>
                              removeUnitProcess(item.materialId, processId)
                            }
                          >
                            <FaTimes size={9} />
                          </button>
                        </div>
                      );
                    })}
                    {item.selectedUnitProcesses.length === 0 && (
                      <span className='text-gray-400 text-xs py-1'>
                        선택된 단위공정 없음
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* 단위 - 자동표출 */}
              <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50'>
                {item.unit}
              </td>

              {/* 합계 - 자동계산 */}
              <td className='border border-gray-300 px-2 py-2 text-sm text-gray-600 bg-gray-50 text-right'>
                {item.totalAmount.toLocaleString()}
              </td>

              {/* 월별 투입량 - 입력 */}
              {item.monthlyUsage.map((monthData) => (
                <td
                  key={monthData.month}
                  className='border border-gray-300 px-1 py-1'
                >
                  <input
                    type='number'
                    value={monthData.amount || ''}
                    onChange={(e) =>
                      handleMonthlyUsageChange(
                        item.materialId,
                        monthData.month,
                        e.target.value
                      )
                    }
                    className='w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500 text-right'
                    placeholder='0'
                    min='0'
                    step='0.01'
                  />
                </td>
              ))}

              {/* DQI */}
              <td className='border border-gray-300 px-1 py-1'>
                <select
                  value={item.dqi}
                  onChange={(e) =>
                    handleDQIChange(
                      item.materialId,
                      e.target.value as 'M' | 'C' | 'E' | ''
                    )
                  }
                  className='w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500'
                >
                  <option value=''>선택</option>
                  {DQI_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>

              {/* 비고 */}
              <td className='border border-gray-300 px-1 py-1'>
                <input
                  type='text'
                  value={item.remarks}
                  onChange={(e) =>
                    handleRemarksChange(item.materialId, e.target.value)
                  }
                  className='w-full px-1 py-1 text-xs border-0 focus:ring-1 focus:ring-blue-500'
                  placeholder='비고 입력'
                />
              </td>

              {/* 파일첨부 */}
              <td className='border border-gray-300 px-2 py-2'>
                <div className='flex flex-col items-center space-y-1'>
                  <label className='cursor-pointer'>
                    <input
                      type='file'
                      className='hidden'
                      onChange={(e) =>
                        handleFileChange(
                          item.materialId,
                          e.target.files?.[0] || null
                        )
                      }
                    />
                    <FaUpload className='text-blue-500 hover:text-blue-700' />
                  </label>
                  {item.attachedFile && (
                    <span className='text-xs text-gray-600 truncate max-w-[80px]'>
                      {item.attachedFile.name}
                    </span>
                  )}
                </div>
              </td>

              {/* 삭제 버튼 */}
              <td className='border border-gray-300 px-2 py-2 text-center'>
                <button
                  type='button'
                  onClick={() => removeAuxiliaryMaterialRow(item.materialId)}
                  className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                  aria-label='삭제'
                >
                  <FaTimes size={14} />
                </button>
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );

  // 할당방법 섹션 렌더링 - 단위공정이 선택된 항목이 있으면 자동 표시
  const renderAllocationSection = () => {
    const hasSelectedProcesses = usageData.some(item => item.selectedUnitProcesses.length > 0);
    if (!hasSelectedProcesses) return null;

    return (
      <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          &lt;부자재 투입량 비율&gt;
        </h3>

        <div className='mb-4 space-y-3'>
          <div className='flex items-center space-x-4'>
            <label className='text-sm font-medium text-gray-700'>
              비율 산정 방법:
            </label>
            <input
              type='text'
              value={ratioMethodDescription}
              onChange={(e) => setRatioMethodDescription(e.target.value)}
              className='flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 bg-yellow-100'
              placeholder='비율 산정 방법을 입력하세요'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <label className='cursor-pointer px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 flex items-center'>
              <input
                type='file'
                className='hidden'
                onChange={(e) => setAttachedRatioFile(e.target.files?.[0] || null)}
              />
              <FaUpload className='mr-1' />
              파일 첨부
            </label>
            {attachedRatioFile && (
              <span className='text-sm text-gray-600'>
                {attachedRatioFile.name}
              </span>
            )}
          </div>
        </div>

        <div className='space-y-6'>
          {materialAllocations.map((allocation) => (
            <div
              key={allocation.materialId}
              className='bg-white border border-blue-300 rounded-lg p-4'
            >
              <h4 className='text-base font-semibold text-gray-800 mb-3'>
                {allocation.materialName}
              </h4>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {allocation.unitProcessAllocations.map((process) => (
                  <div
                    key={process.unitProcessId}
                    className='bg-blue-100 p-3 rounded'
                  >
                    <div className='text-sm font-medium text-gray-700 mb-1'>
                      {process.unitProcessName}
                    </div>
                    <div className='flex items-center space-x-2'>
                      {allocationMethod === '비율 직접 입력' ? (
                        <input
                          type='number'
                          value={process.ratio || ''}
                          onChange={(e) =>
                            handleRatioChange(
                              allocation.materialId,
                              process.unitProcessId,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-yellow-100'
                          placeholder='비율 입력'
                          min='0'
                          max='100'
                          step='0.1'
                        />
                      ) : (
                        <div className='w-full px-2 py-1 text-sm bg-gray-100 rounded text-center'>
                          {process.ratio.toFixed(1)}
                        </div>
                      )}
                      <span className='text-sm'>%</span>
                    </div>
                  </div>
                ))}

                {/* 합산 표시 */}
                <div className='bg-blue-200 p-3 rounded flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='text-sm font-medium text-gray-700'>
                      합산
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        Math.abs(allocation.totalRatio - 100) < 0.1
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {allocation.totalRatio.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {Math.abs(allocation.totalRatio - 100) >= 0.1 && (
                <p className='text-red-600 text-sm mt-2'>
                  ⚠️ 비율의 합이 100%가 되어야 합니다.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 모바일 렌더링
  const renderMobileView = () => (
    <div className='space-y-4'>
      {usageData.map((item) => (
        <div
          key={item.materialId}
          className='border rounded-lg p-4 bg-white shadow-sm'
        >
          <div className='mb-3'>
            <h4 className='font-semibold text-gray-800'>{item.materialName}</h4>
            <p className='text-sm text-gray-600'>
              단위: {item.unit} | 합계: {item.totalAmount.toLocaleString()}
            </p>
          </div>

          {/* 단위공정 선택 */}
          <div className='mb-3'>
            <button
              type='button'
              onClick={() => openUnitProcessModal(item.materialId)}
              className='w-full text-xs py-2 px-3 bg-blue-50 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 flex justify-between items-center'
            >
              <span>투입 단위공정 ({item.selectedUnitProcesses.length})</span>
              <FaPlus size={12} />
            </button>
            <div className='flex flex-wrap gap-1 mt-2'>
              {item.selectedUnitProcesses.map((processId) => {
                const process = DUMMY_UNIT_PROCESSES.find(
                  (p) => p.id === processId
                );
                return (
                  <div
                    key={processId}
                    className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center'
                  >
                    <span className='mr-1'>{process?.name}</span>
                    <button
                      type='button'
                      className='text-blue-600 hover:text-blue-800'
                      onClick={() =>
                        removeUnitProcess(item.materialId, processId)
                      }
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 월별 투입량 */}
          <div className='grid grid-cols-3 gap-2 mb-3'>
            {item.monthlyUsage.map((monthData) => (
              <div key={monthData.month} className='text-center'>
                <label className='block text-xs text-gray-500 mb-1'>
                  {monthData.month}월
                </label>
                <input
                  type='number'
                  value={monthData.amount || ''}
                  onChange={(e) =>
                    handleMonthlyUsageChange(
                      item.materialId,
                      monthData.month,
                      e.target.value
                    )
                  }
                  className='w-full px-2 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-blue-500'
                  placeholder='0'
                  min='0'
                  step='0.01'
                />
              </div>
            ))}
          </div>

          {/* DQI, 비고, 파일 */}
          <div className='grid grid-cols-3 gap-2'>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>DQI</label>
              <select
                value={item.dqi}
                onChange={(e) =>
                  handleDQIChange(
                    item.materialId,
                    e.target.value as 'M' | 'C' | 'E' | ''
                  )
                }
                className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500'
              >
                <option value=''>선택</option>
                {DQI_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>비고</label>
              <input
                type='text'
                value={item.remarks}
                onChange={(e) =>
                  handleRemarksChange(item.materialId, e.target.value)
                }
                className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500'
                placeholder='비고'
              />
            </div>
            <div>
              <label className='block text-xs text-gray-500 mb-1'>파일</label>
              <input
                type='file'
                onChange={(e) =>
                  handleFileChange(item.materialId, e.target.files?.[0] || null)
                }
                className='w-full text-xs'
              />
            </div>
          </div>
        </div>
      ))}

      {/* 모바일 할당 섹션 */}
      {usageData.some(item => item.selectedUnitProcesses.length > 0) && (
        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            부자재 투입량 비율
          </h3>
          {materialAllocations.map((allocation) => (
            <div
              key={allocation.materialId}
              className='bg-white border border-blue-300 rounded-lg p-4 mb-4'
            >
              <h4 className='text-base font-semibold text-gray-800 mb-3'>
                {allocation.materialName}
              </h4>
              <div className='space-y-3'>
                {allocation.unitProcessAllocations.map((process) => (
                  <div
                    key={process.unitProcessId}
                    className='flex justify-between items-center bg-blue-100 p-2 rounded'
                  >
                    <span className='text-sm font-medium'>
                      {process.unitProcessName}
                    </span>
                    <div className='flex items-center space-x-1'>
                      {allocationMethod === '비율 직접 입력' ? (
                        <input
                          type='number'
                          value={process.ratio || ''}
                          onChange={(e) =>
                            handleRatioChange(
                              allocation.materialId,
                              process.unitProcessId,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className='w-16 px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-yellow-100 text-center'
                          placeholder='0'
                          min='0'
                          max='100'
                          step='0.1'
                        />
                      ) : (
                        <span className='w-16 text-xs bg-gray-100 rounded px-1 py-1 text-center'>
                          {process.ratio.toFixed(1)}
                        </span>
                      )}
                      <span className='text-xs'>%</span>
                    </div>
                  </div>
                ))}
                <div className='text-center py-2 bg-blue-200 rounded'>
                  <span
                    className={`text-sm font-bold ${
                      Math.abs(allocation.totalRatio - 100) < 0.1
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    합산: {allocation.totalRatio.toFixed(1)}%
                  </span>
                </div>
                {Math.abs(allocation.totalRatio - 100) >= 0.1 && (
                  <p className='text-red-600 text-xs text-center'>
                    ⚠️ 비율의 합이 100%가 되어야 합니다.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      {/* 헤더 */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>
          2. 부자재 사용량
        </h2>
        <div className='flex items-center space-x-4'>
          {/* 할당방법 선택 */}
          <div className='flex items-center space-x-2'>
            <label className='text-sm font-medium text-gray-700'>할당방법:</label>
            <select
              value={allocationMethod}
              onChange={(e) =>
                setAllocationMethod(
                  e.target.value as '제품 생산량' | '비율 직접 입력'
                )
              }
              className='px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='제품 생산량'>제품 생산량</option>
              <option value='비율 직접 입력'>비율 직접 입력</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center text-sm'
          >
            <FaSave className='mr-2' />
            저장
          </button>
        </div>
      </div>

      {/* 안내 문구 (API 연결 시 삭제)*/}
      <div className='mb-6 space-y-2'>
        <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-green-700 text-sm'>
            할당 방법을 [1-5. 데이터 관리 방식]에서 가져옴
          </p>
        </div>
        <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
          <p className='text-green-700 text-sm'>
            (2) 투입 단위공정 칸에 [6. 단위공정] 목록이 나오고 다중 선택합니다.
          </p>
          <p className='text-green-700 text-sm mt-1'>
            (전체 선택 기능도 꼭 넣어주세요)
          </p>
        </div>
        {allocationMethod === '비율 직접 입력' && (
          <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-green-700 text-sm'>
              할당 방법에서 &quot;비율 직접 입력&quot;을 선택할 경우, 단위공정
              별로 비율을 작성해야 합니다.
            </p>
            <p className='text-green-700 text-sm mt-1'>
              <span className='text-red-600 font-medium'>
                작성한 비율의 총합이 100%가 되어야 합니다.
              </span>
            </p>
          </div>
        )}
        {allocationMethod === '제품 생산량' && (
          <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-green-700 text-sm'>
              할당 방법에서 &quot;제품 생산량&quot;을 선택할 경우, 단위공정 별
              제품 생산량 합계 값을 통해 비율이 자동 계산됩니다. 별도 입력이
              필요하지 않습니다.
            </p>
          </div>
        )}
      </div>

      {/* 반응형 렌더링 */}
      <div className='hidden lg:block'>
        {renderDesktopTable()}
        {renderAllocationSection()}
      </div>

      <div className='lg:hidden'>{renderMobileView()}</div>

      {/* 단위공정 선택 모달 */}
      {renderUnitProcessModal()}
    </div>
  );
};

export default AuxiliaryMaterialsTabContent;
